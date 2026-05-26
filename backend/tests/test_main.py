import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

# Banco em memória exclusivo para testes
TEST_DB_URL = "sqlite:///./test_tickets.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

Base.metadata.create_all(bind=engine)

client = TestClient(app)


# ── Helpers ──────────────────────────────────────────────────────────────────

def register_and_login(email="test@example.com", password="secret123", name="Tester"):
    client.post("/auth/register", json={"name": name, "email": email, "password": password})
    resp = client.post("/auth/login", json={"email": email, "password": password})
    return resp.json()["access_token"]


def auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}


# ── Auth Tests ────────────────────────────────────────────────────────────────

def test_register_success():
    resp = client.post(
        "/auth/register",
        json={"name": "Alice", "email": "alice@test.com", "password": "pass1234"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "alice@test.com"
    assert "id" in data


def test_register_duplicate_email():
    client.post("/auth/register", json={"name": "Bob", "email": "bob@test.com", "password": "pass"})
    resp = client.post(
        "/auth/register",
        json={"name": "Bob2", "email": "bob@test.com", "password": "pass"},
    )
    assert resp.status_code == 400
    assert "E-mail já cadastrado" in resp.json()["detail"]


def test_login_success():
    client.post("/auth/register", json={"name": "Carol", "email": "carol@test.com", "password": "mypass"})
    resp = client.post("/auth/login", json={"email": "carol@test.com", "password": "mypass"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password():
    client.post("/auth/register", json={"name": "Dan", "email": "dan@test.com", "password": "correct"})
    resp = client.post("/auth/login", json={"email": "dan@test.com", "password": "wrong"})
    assert resp.status_code == 401


def test_login_nonexistent_user():
    resp = client.post("/auth/login", json={"email": "ghost@test.com", "password": "anything"})
    assert resp.status_code == 401


# ── Ticket Tests ──────────────────────────────────────────────────────────────

def test_create_ticket():
    token = register_and_login("t1@test.com", "pass123", "T1")
    resp = client.post(
        "/tickets/",
        json={"title": "Bug crítico", "description": "O sistema travou."},
        headers=auth_headers(token),
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Bug crítico"
    assert data["status"] == "Aberto"


def test_create_ticket_unauthenticated():
    resp = client.post(
        "/tickets/",
        json={"title": "Sem auth", "description": "Deve falhar."},
    )
    assert resp.status_code == 401


def test_list_tickets():
    token = register_and_login("t2@test.com", "pass123", "T2")
    client.post("/tickets/", json={"title": "T-A", "description": "desc"}, headers=auth_headers(token))
    client.post("/tickets/", json={"title": "T-B", "description": "desc"}, headers=auth_headers(token))
    resp = client.get("/tickets/", headers=auth_headers(token))
    assert resp.status_code == 200
    assert len(resp.json()) >= 2


def test_get_ticket_by_id():
    token = register_and_login("t3@test.com", "pass123", "T3")
    create_resp = client.post(
        "/tickets/",
        json={"title": "Specific Ticket", "description": "Details here."},
        headers=auth_headers(token),
    )
    ticket_id = create_resp.json()["id"]
    resp = client.get(f"/tickets/{ticket_id}", headers=auth_headers(token))
    assert resp.status_code == 200
    assert resp.json()["id"] == ticket_id


def test_get_ticket_not_found():
    token = register_and_login("t4@test.com", "pass123", "T4")
    resp = client.get("/tickets/99999", headers=auth_headers(token))
    assert resp.status_code == 404


def test_update_ticket_status():
    token = register_and_login("t5@test.com", "pass123", "T5")
    create_resp = client.post(
        "/tickets/",
        json={"title": "Status Test", "description": "Muda status."},
        headers=auth_headers(token),
    )
    ticket_id = create_resp.json()["id"]

    for new_status in ["Em andamento", "Finalizado", "Aberto"]:
        resp = client.patch(
            f"/tickets/{ticket_id}/status",
            json={"status": new_status},
            headers=auth_headers(token),
        )
        assert resp.status_code == 200
        assert resp.json()["status"] == new_status


def test_update_status_invalid_value():
    token = register_and_login("t6@test.com", "pass123", "T6")
    create_resp = client.post(
        "/tickets/",
        json={"title": "Invalid Status", "description": "desc"},
        headers=auth_headers(token),
    )
    ticket_id = create_resp.json()["id"]
    resp = client.patch(
        f"/tickets/{ticket_id}/status",
        json={"status": "Invalido"},
        headers=auth_headers(token),
    )
    assert resp.status_code == 422


def test_delete_ticket_own():
    token = register_and_login("t7@test.com", "pass123", "T7")
    create_resp = client.post(
        "/tickets/",
        json={"title": "Delete Me", "description": "bye."},
        headers=auth_headers(token),
    )
    ticket_id = create_resp.json()["id"]
    resp = client.delete(f"/tickets/{ticket_id}", headers=auth_headers(token))
    assert resp.status_code == 204


def test_delete_ticket_other_user():
    token_a = register_and_login("owner@test.com", "pass123", "Owner")
    token_b = register_and_login("other@test.com", "pass123", "Other")
    create_resp = client.post(
        "/tickets/",
        json={"title": "Protected Ticket", "description": "Only owner can delete."},
        headers=auth_headers(token_a),
    )
    ticket_id = create_resp.json()["id"]
    resp = client.delete(f"/tickets/{ticket_id}", headers=auth_headers(token_b))
    assert resp.status_code == 403


def test_health_check():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"

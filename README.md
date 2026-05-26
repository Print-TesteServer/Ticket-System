# TicketOS — Sistema de Abertura de Chamados

Sistema full stack para abertura e gestão de tickets/chamados, desenvolvido com **FastAPI + React**.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy |
| Banco de dados | SQLite (padrão) |
| Autenticação | JWT (python-jose + bcrypt) |
| Frontend | React 18, Vite, React Router |
| Testes | Pytest + TestClient |
| Deploy | Docker + Docker Compose |

---

## Estrutura do Projeto

```
ticket-system/
├── backend/
│   ├── app/
│   │   ├── main.py          # Entry point FastAPI
│   │   ├── database.py      # Configuração SQLAlchemy
│   │   ├── models.py        # Modelos ORM (User, Ticket)
│   │   ├── schemas.py       # Schemas Pydantic
│   │   ├── auth.py          # JWT + bcrypt
│   │   └── routers/
│   │       ├── auth.py      # POST /auth/register, /auth/login
│   │       └── tickets.py   # CRUD /tickets/
│   ├── tests/
│   │   └── test_main.py     # 14 testes automatizados
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/      # UI reutilizável (layout, tickets, ícones)
│   │   ├── context/         # Auth + Toast
│   │   ├── lib/             # Constantes e helpers
│   │   ├── pages/           # Login, Dashboard, CreateTicket
│   │   ├── styles.css
│   │   └── App.jsx
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── start.ps1              # Docker (Windows)
├── start.sh               # Docker (Linux/Mac)
└── start-local.ps1        # Instruções para dev local
```

---

## Portas do projeto

| Serviço | Docker (host) | Local (sem Docker) |
|---------|---------------|-------------------|
| **Frontend (React)** | **80** → `http://localhost/login` | **5173** → `http://localhost:5173/login` |
| **Backend (API)** | **8000** → `http://localhost:8000/docs` | **8000** → `http://localhost:8000/docs` |

Ao iniciar (Docker, `uvicorn` ou `npm run dev`), o terminal exibe essas URLs automaticamente.

---

## Execução Rápida (Docker)

> Pré-requisito: Docker e Docker Compose instalados.  
> Execute sempre na **pasta raiz** (onde está o `docker-compose.yml`).

```bash
git clone https://github.com/Print-TesteServer/Ticket-System.git
cd ticket-system

```bash
docker compose down
docker compose up --build
```

### URLs (Docker)

| Tela | URL |
|------|-----|
| **Login** | **http://localhost/login** |
| Chamados | http://localhost/ |
| Novo chamado | http://localhost/new |
| API / Swagger | http://localhost:8000/docs |

### Sem Node.js instalado

Se `npm` não for reconhecido no terminal, use **apenas Docker**. O build do frontend roda dentro do container.

### Docker Desktop ainda mostra `3000:80`?

Os containers antigos mantêm o mapeamento anterior. Na raiz do projeto:

```bash
docker compose down
docker compose up --build
```

Confira em **Containers** → `ticket-frontend` deve aparecer **`80:80`**, não `3000:80`.

---

## Execução Local (sem Docker)

Use **dois terminais**. O script `.\start-local.ps1` (Windows) lista os comandos e URLs.

### Terminal 1 — Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

O terminal exibirá: `http://localhost:8000/docs` e `http://localhost:5173/login`.

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

O terminal exibirá: `http://localhost:5173/login` (interface) e lembrete da API na porta 8000.

### URLs (local)

| Tela | URL |
|------|-----|
| **Login** | **http://localhost:5173/login** |
| Chamados | http://localhost:5173/ |
| Novo chamado | http://localhost:5173/new |
| API / Swagger | http://localhost:8000/docs |

---

## Testes

```bash
cd backend

# Com virtualenv ativado:
pytest tests/ -v
```

Cobertura dos testes (14 casos):
- Registro de usuário (sucesso + e-mail duplicado)
- Login (sucesso + senha errada + usuário inexistente)
- Criar ticket (autenticado + sem auth)
- Listar tickets
- Buscar ticket por ID (sucesso + não encontrado)
- Atualizar status (todos os valores + valor inválido)
- Excluir ticket (dono + outro usuário — 403)
- Health check

---

## API — Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastrar novo usuário |
| POST | `/auth/login` | Login — retorna JWT |

### Tickets (requer JWT no header `Authorization: Bearer <token>`)

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/tickets/` | Listar todos os tickets |
| POST | `/tickets/` | Criar novo ticket |
| GET | `/tickets/{id}` | Buscar ticket por ID |
| PATCH | `/tickets/{id}/status` | Atualizar status |
| DELETE | `/tickets/{id}` | Excluir ticket (somente dono) |

### Status disponíveis
- `Aberto`
- `Em andamento`
- `Finalizado`

---

## Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend/` para customizar:

```env
DATABASE_URL=sqlite:///./tickets.db
SECRET_KEY=seu-segredo-aqui
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## Funcionalidades

- Autenticação JWT com bcrypt
- Rotas protegidas no frontend (redirect automático)
- Interceptor Axios — token injetado automaticamente
- Filtro por status e busca por título
- Cards de estatísticas clicáveis (filtro rápido)
- Controle de permissão — só o dono pode excluir o ticket
- Tratamento de erros em todas as operações (API + toasts/modais no frontend)
- Interface com sidebar, layout em duas colunas no login e feedback visual moderno
- Design responsivo (mobile-friendly)
- Documentação automática via Swagger UI (`/docs`)

---

## Atendimento aos requisitos do teste

| Requisito | Status |
|-----------|--------|
| Backend Python (FastAPI) | ✅ |
| Criar ticket | ✅ `POST /tickets/` |
| Listar tickets | ✅ `GET /tickets/` |
| Atualizar status (Aberto / Em andamento / Finalizado) | ✅ `PATCH /tickets/{id}/status` |
| SQLite | ✅ (padrão; PostgreSQL via `DATABASE_URL`) |
| Código organizado e legível | ✅ |
| Frontend React | ✅ |
| Tela abrir ticket (título + descrição) | ✅ `/new` |
| Tela listar tickets | ✅ `/` |
| Alterar status na UI | ✅ botões por status em cada card |
| **Diferencial:** autenticação | ✅ JWT |
| **Diferencial:** Docker | ✅ `docker-compose.yml` |
| **Diferencial:** testes | ✅ 14 testes Pytest |
| **Diferencial:** tratamento de erros | ✅ HTTP exceptions + toasts |
| **Diferencial:** organização | ✅ pastas `backend/app`, `frontend/src/components` |
| README com instruções | ✅ |

---

## Melhorias Futuras

- [ ] Paginação na listagem de tickets
- [ ] Comentários nos tickets
- [ ] Notificações por e-mail na mudança de status
- [ ] Painel de admin com métricas
- [ ] PostgreSQL em produção

---

## Troubleshooting Docker

### Build parece travar no `npm install`

O Docker não exibe progresso de comandos longos por padrão. Para ver a saída completa:

```bash
docker compose up --build --progress=plain
```

Se ainda travar, verifique sua conexão com a internet (o npm precisa baixar pacotes). A primeira build demora mais; as seguintes usam cache.

### Warning: `version` obsoleto

A linha `version` foi removida do `docker-compose.yml`. Se ainda aparecer, atualize o Docker Desktop.

### Frontend não consegue falar com a API

O `VITE_API_URL` no `docker-compose.yml` define a URL da API que o **browser** usa para chamar o backend. Se você estiver expondo o backend em uma porta diferente da 8000, ajuste:

```yaml
args:
  VITE_API_URL: http://SEU_IP:8000
```

### Porta 80 já em uso

Troque o mapeamento do frontend no `docker-compose.yml`:

```yaml
ports:
  - "8080:80"   # acesse em http://localhost:8080/login
```

Depois rode `docker compose up --build` novamente na **raiz** do projeto.

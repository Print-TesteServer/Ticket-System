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
│   │   ├── api/axios.js     # Instância Axios + interceptors
│   │   ├── context/         # AuthContext (estado global)
│   │   ├── pages/
│   │   │   ├── Login.jsx    # Login + Cadastro
│   │   │   ├── Dashboard.jsx  # Lista de tickets + filtros
│   │   │   └── CreateTicket.jsx  # Formulário de abertura
│   │   ├── styles.css       # Design system completo
│   │   └── App.jsx          # Roteamento + rotas protegidas
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

---

## Execução Rápida (Docker)

> Pré-requisito: Docker e Docker Compose instalados.

```bash
git clone https://github.com/seu-usuario/ticket-system.git
cd ticket-system

docker compose up --build
```

- **Frontend:** http://localhost
- **Backend API:** http://localhost:8000
- **Docs interativa:** http://localhost:8000/docs

---

## Execução Local (sem Docker)

### Backend

```bash
cd backend

# Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Instalar dependências
pip install -r requirements.txt

# Rodar o servidor
uvicorn app.main:app --reload --port 8000
```

A API estará disponível em `http://localhost:8000`.  
Documentação interativa em `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend

npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

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
- Tratamento de erros em todas as operações
- Design responsivo (mobile-friendly)
- Documentação automática via Swagger UI (`/docs`)

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

Troque a porta do frontend no `docker-compose.yml`:

```yaml
ports:
  - "3000:80"   # acesse em http://localhost:3000
```

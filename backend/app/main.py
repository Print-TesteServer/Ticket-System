from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import auth, tickets

# Cria todas as tabelas na inicialização
Base.metadata.create_all(bind=engine)


def _print_startup_banner() -> None:
    print(
        "\n"
        "  ========================================================\n"
        "   TicketOS — API (local, porta 8000)\n"
        "  ========================================================\n"
        "   Swagger:   http://localhost:8000/docs\n"
        "   Health:    http://localhost:8000/health\n"
        "   Interface: http://localhost:5173/login  (npm run dev)\n"
        "  ========================================================\n",
        flush=True,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    _print_startup_banner()
    yield


app = FastAPI(
    title="Sistema de Tickets",
    description="API para abertura e gestão de chamados/tickets.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tickets.router)


@app.get("/", tags=["Info"], include_in_schema=False)
def root():
    """Página inicial da API — a interface React não roda nesta porta."""
    return {
        "message": "TicketOS API em execução.",
        "ui": "Abra o frontend em http://localhost/login (Docker) ou http://localhost:5173 (npm run dev).",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "ticket-system-api"}

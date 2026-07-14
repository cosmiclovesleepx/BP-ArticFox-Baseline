from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, modules, jobs, reports

# Fase de pruebas: crear tablas directamente (sin Alembic todavía).
# Cuando se pase a producción, esto se reemplaza por migraciones de Alembic.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Polar Ops API (test)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "tauri://localhost", "http://tauri.localhost"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(modules.router)
app.include_router(jobs.router)
app.include_router(reports.router)


@app.get("/health")
def health():
    return {"status": "ok"}

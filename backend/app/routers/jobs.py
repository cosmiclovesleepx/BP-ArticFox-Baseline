"""
Ejecuta scripts del registry. Por decisión de producto: UN script a la vez
(lock global), nada de cola distribuida todavía — eso se evalúa más
adelante si se necesita paralelismo real.

Para esta Fase de pruebas se expone polling simple (GET /jobs/{id}) en vez
de WebSocket, para mantener el backend mínimo. Cambiar a WS es un paso
aislado cuando se quiera log en vivo real en la UI.
"""
import os
import tempfile
import threading
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.workers.registry import REGISTRY

router = APIRouter(prefix="/jobs", tags=["jobs"])

_execution_lock = threading.Lock()


class JobOut(BaseModel):
    id: str
    estado: str
    log: list
    bigquery_table: str | None = None

    class Config:
        from_attributes = True


@router.post("", response_model=JobOut)
def create_job(
    entrypoint: str = Form(...),
    periodo: str = Form(default=""),
    file: UploadFile = None,
    db: Session = Depends(get_db),
):
    if entrypoint not in REGISTRY:
        raise HTTPException(400, f"entrypoint '{entrypoint}' no registrado en workers/registry.py")
    if file is None:
        raise HTTPException(400, "Se requiere un archivo")

    script = db.query(models.ModuleScript).filter(models.ModuleScript.entrypoint == entrypoint).first()

    job = models.Job(
        module_script_id=script.id if script else None,
        archivo_nombre=file.filename,
        estado="pending",
        log=[],
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Guardar el archivo temporalmente
    suffix = os.path.splitext(file.filename)[1]
    tmp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}{suffix}")
    with open(tmp_path, "wb") as f:
        f.write(file.file.read())

    log_lines: list[str] = []

    def log(line: str):
        log_lines.append(line)

    job.estado = "running"
    job.started_at = datetime.now(timezone.utc)
    db.commit()

    try:
        with _execution_lock:  # un script a la vez
            result = REGISTRY[entrypoint](tmp_path, {"periodo": periodo}, log)
        job.estado = "done"
        job.bigquery_table = result.get("bigquery_table")
    except Exception as e:  # noqa: BLE001
        job.estado = "error"
        log(f"ERROR: {e}")
    finally:
        job.log = log_lines
        job.finished_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(job)
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    return job


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(404, "Job no encontrado")
    return job

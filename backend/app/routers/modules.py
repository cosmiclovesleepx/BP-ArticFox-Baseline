from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter(prefix="/modules", tags=["modules"])


class ScriptOut(BaseModel):
    id: str
    slug: str
    nombre: str
    entrypoint: str
    tipo_input: str

    class Config:
        from_attributes = True


class ModuleOut(BaseModel):
    id: str
    slug: str
    nombre: str
    descripcion: str | None
    color: str | None
    scripts: list[ScriptOut]

    class Config:
        from_attributes = True


class ScriptIn(BaseModel):
    nombre: str
    entrypoint: str
    tipo_input: str = "xlsx"


class ModuleIn(BaseModel):
    slug: str
    nombre: str
    descripcion: str | None = None
    color: str | None = "#5EEAD4"
    scripts: list[ScriptIn] = []


@router.get("", response_model=list[ModuleOut])
def list_modules(db: Session = Depends(get_db)):
    return db.query(models.Module).filter(models.Module.activo == True).all()  # noqa: E712


@router.get("/{slug}", response_model=ModuleOut)
def get_module(slug: str, db: Session = Depends(get_db)):
    m = db.query(models.Module).filter(models.Module.slug == slug).first()
    if not m:
        raise HTTPException(404, "Módulo no encontrado")
    return m


@router.post("", response_model=ModuleOut)
def create_module(body: ModuleIn, db: Session = Depends(get_db)):
    if db.query(models.Module).filter(models.Module.slug == body.slug).first():
        raise HTTPException(409, "Ya existe un módulo con ese slug")

    m = models.Module(slug=body.slug, nombre=body.nombre, descripcion=body.descripcion, color=body.color)
    db.add(m)
    db.flush()

    for s in body.scripts:
        db.add(models.ModuleScript(
            module_id=m.id,
            slug=s.entrypoint.split(".")[-1],
            nombre=s.nombre,
            entrypoint=s.entrypoint,
            tipo_input=s.tipo_input,
        ))

    db.commit()
    db.refresh(m)
    return m

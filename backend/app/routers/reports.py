"""
Fase de pruebas: CRUD local de reportes y accesos en PostgreSQL, SIN tocar
la API real de Looker/Data Studio todavía. Cuando se configure la API real,
esto se convierte en un proxy (este router seguiría existiendo, pero
delegando a la API de Google en vez de leer/escribir solo en la tabla local).
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter(prefix="/reports", tags=["reports"])


class ReportOut(BaseModel):
    id: str
    nombre: str

    class Config:
        from_attributes = True


class AccessIn(BaseModel):
    user_id: str
    nivel: str = "viewer"


class AccessOut(BaseModel):
    user_id: str
    nivel: str

    class Config:
        from_attributes = True


@router.get("", response_model=list[ReportOut])
def list_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).all()


@router.get("/{report_id}/access", response_model=list[AccessOut])
def get_access(report_id: str, db: Session = Depends(get_db)):
    return db.query(models.ReportAccess).filter(models.ReportAccess.report_id == report_id).all()


@router.post("/{report_id}/access", response_model=AccessOut)
def add_access(report_id: str, body: AccessIn, db: Session = Depends(get_db)):
    if not db.query(models.Report).filter(models.Report.id == report_id).first():
        raise HTTPException(404, "Reporte no encontrado")
    access = models.ReportAccess(report_id=report_id, user_id=body.user_id, nivel=body.nivel)
    db.merge(access)
    db.commit()
    return access


@router.delete("/{report_id}/access/{user_id}")
def remove_access(report_id: str, user_id: str, db: Session = Depends(get_db)):
    db.query(models.ReportAccess).filter(
        models.ReportAccess.report_id == report_id, models.ReportAccess.user_id == user_id
    ).delete()
    db.commit()
    return {"ok": True}

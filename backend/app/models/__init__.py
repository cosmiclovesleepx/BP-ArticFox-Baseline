import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Boolean, ForeignKey, JSON, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


def now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    username: Mapped[str] = mapped_column(String, unique=True)
    email: Mapped[str] = mapped_column(String, nullable=True)
    role: Mapped[str] = mapped_column(String, default="viewer")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    # En producción: SIN password_hash aquí. El registro/autenticación real vive en
    # el admin panel de blackpolar.org; esta tabla solo cachea identidad + rol local.


class Module(Base):
    __tablename__ = "modules"
    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    slug: Mapped[str] = mapped_column(String, unique=True)
    nombre: Mapped[str] = mapped_column(String)
    descripcion: Mapped[str] = mapped_column(Text, nullable=True)
    icono: Mapped[str] = mapped_column(String, nullable=True)
    color: Mapped[str] = mapped_column(String, nullable=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)

    scripts: Mapped[list["ModuleScript"]] = relationship(back_populates="module", cascade="all, delete-orphan")


class ModuleScript(Base):
    __tablename__ = "module_scripts"
    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    module_id: Mapped[str] = mapped_column(ForeignKey("modules.id"))
    slug: Mapped[str] = mapped_column(String)
    nombre: Mapped[str] = mapped_column(String)
    entrypoint: Mapped[str] = mapped_column(String)  # clave en workers/registry.py
    tipo_input: Mapped[str] = mapped_column(String, default="xlsx")
    config_schema: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)

    module: Mapped["Module"] = relationship(back_populates="scripts")


class Job(Base):
    __tablename__ = "jobs"
    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    module_script_id: Mapped[str] = mapped_column(ForeignKey("module_scripts.id"))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=True)
    archivo_nombre: Mapped[str] = mapped_column(String, nullable=True)
    estado: Mapped[str] = mapped_column(String, default="pending")  # pending|running|done|error
    log: Mapped[list] = mapped_column(JSON, default=list)
    bigquery_table: Mapped[str] = mapped_column(String, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class Report(Base):
    __tablename__ = "reports"
    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    looker_report_id: Mapped[str] = mapped_column(String, nullable=True)
    nombre: Mapped[str] = mapped_column(String)
    module_id: Mapped[str] = mapped_column(ForeignKey("modules.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class ReportAccess(Base):
    __tablename__ = "report_access"
    report_id: Mapped[str] = mapped_column(ForeignKey("reports.id"), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)
    nivel: Mapped[str] = mapped_column(String, default="viewer")  # viewer|editor

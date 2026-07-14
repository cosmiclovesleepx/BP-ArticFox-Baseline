"""
Carga datos de prueba: el módulo "Cliente X" con su script "Aire" (ya
conectado al registry real), y un reporte de ejemplo. Correr una vez con:
    python seed.py
"""
from app.database import SessionLocal, Base, engine
from app import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

if not db.query(models.Module).filter(models.Module.slug == "cliente-x").first():
    m = models.Module(slug="cliente-x", nombre="Cliente X", descripcion="Carga de manifiestos y sincronización BigQuery", color="#5EEAD4")
    db.add(m)
    db.flush()
    db.add(models.ModuleScript(module_id=m.id, slug="aire", nombre="Aire", entrypoint="cliente-x.aire", tipo_input="xlsx"))
    db.add(models.Report(nombre="Operaciones Aire — Mensual", module_id=m.id))
    db.commit()
    print("Seed insertado: módulo cliente-x + script aire + reporte de ejemplo.")
else:
    print("Seed ya existía, no se insertó nada.")

db.close()

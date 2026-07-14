# Backend de pruebas — Polar Ops

FastAPI + PostgreSQL solo para desarrollo local. Sin credenciales reales de
api.blackpolar.org ni de Google (BigQuery/Looker) todavía — eso es el último
paso del roadmap (ver `docs/arquitectura.md`).

## Levantar

```bash
# 1. Base de datos de pruebas
docker compose up -d

# 2. Entorno Python
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Datos de prueba
python seed.py

# 4. Levantar la API
uvicorn app.main:app --reload --port 8000
```

Docs interactivas en `http://localhost:8000/docs`.

## Probar el flujo completo (Aire)

El script `app/workers/cliente_x/aire.py` ya es funcional de verdad: convierte
cualquier `.xlsx` a `.csv` real (no hay BigQuery todavía, esa parte está
marcada con `[PRUEBA]` en el log). Pruébalo así:

```bash
curl -X POST http://localhost:8000/jobs \
  -F "entrypoint=cliente-x.aire" \
  -F "periodo=2026-06" \
  -F "file=@/ruta/a/tu/archivo.xlsx"
```

## Modos de autenticación

- `AUTH_MODE=fake` (default en `.env`): cualquier usuario/contraseña entra, no
  llama a ninguna API externa. Así se desarrolla todo lo demás sin depender de
  credenciales reales.
- `AUTH_MODE=blackpolar`: queda el router ya preparado (`app/routers/auth.py`)
  con el `TODO` exacto de dónde conectar `api.blackpolar.org` cuando llegue el
  momento — solo se cambia esa variable y se implementa la llamada HTTP.

## Qué falta para producción (deliberadamente NO incluido aquí)

- Credenciales reales de PostgreSQL de producción (hoy apunta al contenedor local).
- Integración real con `api.blackpolar.org` (`AUTH_MODE=blackpolar`).
- Credenciales de Google Cloud (BigQuery, Looker API) — el script `aire.py`
  tiene el punto exacto marcado con `[PRUEBA]` donde se conecta la subida real.
- Migraciones con Alembic en vez de `Base.metadata.create_all`.

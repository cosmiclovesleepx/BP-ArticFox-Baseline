# Polar Ops

Sistema de automatización de scripts con frontend compartido (web/desktop/mobile),
backend FastAPI y PostgreSQL. Ver `docs/arquitectura.md` para el diseño completo.

## Estado actual

- ✅ **Frontend** (React + Vite + TS + Tailwind v4 + shadcn-style): `npm run dev`
- ✅ **Desktop (Tauri)**: estructura lista en `src-tauri/`, requiere Rust instalado
  localmente (no se puede compilar en este sandbox). `npm run desktop:dev`
- ✅ **Backend de PRUEBAS** (FastAPI + PostgreSQL local vía Docker): ver `backend/README.md`
- ⏳ **Pendiente (último paso del roadmap)**: credenciales reales de
  `api.blackpolar.org`, PostgreSQL de producción, BigQuery y Looker API.

## Orden para correr todo localmente

```bash
# Terminal 1 — base de datos + API de pruebas
cd backend
docker compose up -d
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload --port 8000

# Terminal 2 — frontend en navegador
npm install
npm run dev

# Terminal 2 (alternativa) — frontend como app de escritorio (requiere Rust)
npm run desktop:dev
```

> Nota: el frontend hoy (Fase 0) sigue usando `src/data/mock.ts` con datos
> hardcoded, todavía no llama al backend de pruebas. Ese cableado (`fetch` real
> hacia `localhost:8000`) es el siguiente paso natural — el backend ya está
> listo y probado para recibirlo.

## Instalar Rust (para compilar Tauri)

No viene preinstalado en ningún sistema operativo. Instálalo con:
https://www.rust-lang.org/tools/install (rustup, multiplataforma — Windows,
macOS, Linux). Después, `cargo` y `rustc` quedan disponibles en tu terminal y
`npm run desktop:dev` levanta la ventana nativa.

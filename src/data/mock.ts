import type { AppModule, Report } from '@/types'

// FASE 0: datos hardcoded.
// FASE 1: reemplazar por `await api.get('/modules')` y `await api.get('/reports')`.

export const MODULES: AppModule[] = [
  {
    id: 'cliente-x',
    nombre: 'Cliente X',
    desc: 'Carga de manifiestos y sincronización BigQuery / Looker',
    color: '#5EEAD4',
    scripts: [
      { id: 'aire', nombre: 'Aire', tag: 'XLSX → CSV → BigQuery' },
      { id: 'tierra', nombre: 'Tierra', tag: 'XLSX → CSV → BigQuery' },
      { id: 'naviera', nombre: 'Naviera', tag: 'XLSX → CSV → BigQuery' },
    ],
  },
  {
    id: 'cliente-y',
    nombre: 'Cliente Y',
    desc: 'Conciliación de facturas y reportes financieros',
    color: '#FB923C',
    scripts: [{ id: 'facturas', nombre: 'Facturas', tag: 'XLSX → Validación → SQL' }],
  },
]

export const REPORTS: Report[] = [
  { id: 1, nombre: 'Operaciones Aire — Mensual', usuarios: 14, vistas: '1,204', editado: 'hace 2 días' },
  { id: 2, nombre: 'Tierra — Seguimiento Diario', usuarios: 9, vistas: '832', editado: 'hace 5 horas' },
  { id: 3, nombre: 'Naviera — Consolidado', usuarios: 6, vistas: '410', editado: 'hace 1 semana' },
]

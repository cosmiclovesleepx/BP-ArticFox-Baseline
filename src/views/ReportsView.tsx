import { useState } from 'react'
import { REPORTS } from '@/data/mock'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Report } from '@/types'

// FASE 3: reemplazar REPORTS por GET /reports (proxy a Looker API),
// y el modal por GET/POST/DELETE /reports/{id}/access

export function ReportsView() {
  const [editing, setEditing] = useState<Report | null>(null)

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-text-dim font-mono">Looker / Data Studio — {REPORTS.length} reportes</div>
        <Button variant="outline" size="sm">
          + nuevo reporte
        </Button>
      </div>
      <div className="rounded-lg border border-line bg-panel overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_100px_120px_90px] px-4 py-2 text-[10px] font-mono text-text-dim border-b border-line">
          <div>REPORTE</div>
          <div>USUARIOS</div>
          <div>VISTAS</div>
          <div>EDITADO</div>
          <div></div>
        </div>
        {REPORTS.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-[1fr_100px_100px_120px_90px] px-4 py-3 text-sm border-b border-line last:border-0 items-center hover:bg-panel-2 transition-colors"
          >
            <div className="font-display">{r.nombre}</div>
            <div className="font-mono text-text-dim">{r.usuarios}</div>
            <div className="font-mono text-text-dim">{r.vistas}</div>
            <div className="font-mono text-text-dim text-xs">{r.editado}</div>
            <button onClick={() => setEditing(r)} className="text-xs font-mono text-accent hover:underline text-right">
              gestionar
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[420px] rounded-lg border border-line bg-panel p-5"
          >
            <div className="font-display font-semibold mb-1">{editing.nombre}</div>
            <div className="text-xs text-text-dim mb-4 font-mono">acceso de usuarios</div>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {['m.rojas', 'c.peña', 'a.gomez'].map((u) => (
                <div key={u} className="flex items-center justify-between text-xs font-mono bg-panel-2 rounded px-3 py-2">
                  <span>{u}</span>
                  <span className="text-accent">acceso ✓</span>
                </div>
              ))}
            </div>
            <Input placeholder="añadir usuario por correo…" className="mb-3" />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setEditing(null)}>
                cerrar
              </Button>
              <Button size="sm" onClick={() => setEditing(null)}>
                guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

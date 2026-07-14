import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { AppModule, JobStatus } from '@/types'

// FASE 0: ejecución simulada con un log fijo.
// FASE 1: reemplazar runScript() por:
//   1. POST /jobs (multipart: archivo + module_script_id + params) -> { job_id }
//   2. abrir WebSocket a /jobs/{job_id}/stream y hacer push de cada línea al log
//   3. cerrar cuando llegue el evento "done" o "error"

export function ModuleDetail({ modulo, onBack }: { modulo: AppModule; onBack: () => void }) {
  const [scriptSel, setScriptSel] = useState(modulo.scripts[0].id)
  const [fileName, setFileName] = useState<string | null>(null)
  const [status, setStatus] = useState<JobStatus>('idle')
  const [logIdx, setLogIdx] = useState(0)

  const log = [
    'Leyendo archivo .xlsx…',
    `Detectando tipo de hoja: ${scriptSel.toUpperCase()}`,
    'Convirtiendo XLSX → CSV…',
    'Aplicando esquema de columnas…',
    `Subiendo a BigQuery (dataset: ${modulo.id.replace('-', '_')}.${scriptSel})…`,
    'Registrando fecha de carga y trazabilidad…',
    'Carga completada ✓',
  ]

  function runScript() {
    if (!fileName) return
    setStatus('running')
    setLogIdx(0)
    let i = 0
    const t = setInterval(() => {
      i++
      setLogIdx(i)
      if (i >= log.length) {
        clearInterval(t)
        setStatus('done')
      }
    }, 400)
  }

  return (
    <div className="p-6 max-w-3xl">
      <button onClick={onBack} className="text-xs text-text-dim hover:text-text font-mono mb-4">
        ← módulos
      </button>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center font-mono text-sm font-semibold"
          style={{ background: modulo.color + '22', color: modulo.color, border: `1px solid ${modulo.color}55` }}
        >
          {modulo.nombre[0]}
        </div>
        <div>
          <div className="font-display font-semibold">{modulo.nombre}</div>
          <div className="text-xs text-text-dim">{modulo.desc}</div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-5 space-y-4">
          <div>
            <label className="text-xs text-text-dim font-mono">tipo de script</label>
            <div className="flex gap-2 mt-2">
              {modulo.scripts.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScriptSel(s.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-colors ${
                    scriptSel === s.id
                      ? 'border-accent text-accent bg-accent/10'
                      : 'border-line text-text-dim hover:text-text'
                  }`}
                >
                  {s.nombre}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-text-dim font-mono mt-1">
              {modulo.scripts.find((s) => s.id === scriptSel)?.tag}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-dim font-mono">archivo excel</label>
            <label className="mt-2 flex items-center justify-center border border-dashed border-line rounded-md py-6 text-xs text-text-dim cursor-pointer hover:border-accent/40 transition-colors">
              <input
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
              {fileName ? <span className="font-mono text-text">{fileName}</span> : 'Arrastra o haz clic para subir .xlsx'}
            </label>
          </div>

          <Button onClick={runScript} disabled={!fileName || status === 'running'}>
            {status === 'running' ? 'Ejecutando…' : 'Ejecutar script'}
          </Button>

          {status !== 'idle' && (
            <div className="rounded-md bg-[#05070B] border border-line p-3 font-mono text-[11px] text-text-dim space-y-1">
              {log.slice(0, logIdx).map((l, i) => (
                <div key={i} className={i === log.length - 1 ? 'text-accent' : ''}>
                  <span className="text-text-dim/60">$</span> {l}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

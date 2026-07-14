import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// FASE 4: este formulario hace POST /modules y POST /modules/{slug}/scripts.
// El campo "entrypoint" de cada script DEBE coincidir con una clave ya
// registrada en backend/app/workers/registry.py (ver arquitectura.md sección 4).
// No se ejecuta código arbitrario: solo se selecciona entre scripts ya auditados.

interface ScriptDraft {
  nombre: string
  entrypoint: string
  tipoInput: string
}

export function CreateModuleView({ onBack }: { onBack: () => void }) {
  const [nombre, setNombre] = useState('')
  const [slug, setSlug] = useState('')
  const [desc, setDesc] = useState('')
  const [scripts, setScripts] = useState<ScriptDraft[]>([{ nombre: '', entrypoint: '', tipoInput: 'xlsx' }])

  function updateScript(i: number, field: keyof ScriptDraft, value: string) {
    setScripts((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))
  }

  return (
    <div className="p-6 max-w-2xl">
      <button onClick={onBack} className="text-xs text-text-dim hover:text-text font-mono mb-4">
        ← módulos
      </button>
      <div className="font-display font-semibold text-base mb-1">Nuevo módulo</div>
      <div className="text-xs text-text-dim mb-6">
        Define la configuración. El código de cada script debe existir y estar registrado en el backend.
      </div>

      <Card>
        <CardContent className="pt-5 space-y-4">
          <div>
            <label className="text-xs text-text-dim font-mono">nombre</label>
            <Input className="mt-1.5" placeholder="Cliente Z" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-text-dim font-mono">slug (identificador único)</label>
            <Input className="mt-1.5" placeholder="cliente-z" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-text-dim font-mono">descripción</label>
            <Input className="mt-1.5" placeholder="¿qué automatiza este módulo?" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>

          <div className="pt-2 border-t border-line">
            <div className="text-xs text-text-dim font-mono mb-2">scripts del módulo</div>
            <div className="space-y-3">
              {scripts.map((s, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 bg-panel-2 border border-line rounded-md p-3">
                  <div>
                    <label className="text-[10px] text-text-dim font-mono">nombre</label>
                    <Input
                      className="mt-1"
                      placeholder="Aire"
                      value={s.nombre}
                      onChange={(e) => updateScript(i, 'nombre', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-dim font-mono">entrypoint (registry.py)</label>
                    <Input
                      className="mt-1"
                      placeholder="cliente-z.aire"
                      value={s.entrypoint}
                      onChange={(e) => updateScript(i, 'entrypoint', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-dim font-mono">input esperado</label>
                    <Input
                      className="mt-1"
                      value={s.tipoInput}
                      onChange={(e) => updateScript(i, 'tipoInput', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setScripts((p) => [...p, { nombre: '', entrypoint: '', tipoInput: 'xlsx' }])}
            >
              + añadir script
            </Button>
          </div>

          <Button className="mt-2">Crear módulo</Button>
        </CardContent>
      </Card>
    </div>
  )
}

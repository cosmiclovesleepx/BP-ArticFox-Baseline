import { MODULES } from '@/data/mock'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AppModule } from '@/types'

function ModuleCard({ m, onOpen }: { m: AppModule; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="text-left">
      <Card className="p-5 hover:border-accent/40 transition-colors h-full">
        <div
          className="w-9 h-9 rounded-md mb-4 flex items-center justify-center font-mono text-sm font-semibold"
          style={{ background: m.color + '22', color: m.color, border: `1px solid ${m.color}55` }}
        >
          {m.nombre[0]}
        </div>
        <div className="font-display font-semibold text-sm mb-1">{m.nombre}</div>
        <div className="text-xs text-text-dim mb-4 leading-relaxed">{m.desc}</div>
        <div className="flex flex-wrap gap-1.5">
          {m.scripts.map((s) => (
            <Badge key={s.id}>{s.nombre}</Badge>
          ))}
        </div>
      </Card>
    </button>
  )
}

function AddModuleCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="rounded-lg border border-dashed border-line p-5 text-left hover:border-accent/50 transition-colors flex flex-col justify-center items-center gap-2 text-text-dim min-h-[150px]"
    >
      <span className="text-2xl font-mono">+</span>
      <span className="text-sm font-display">Añadir módulo</span>
    </button>
  )
}

export function ModulesView({
  onOpenModule,
  onCreateModule,
}: {
  onOpenModule: (m: AppModule) => void
  onCreateModule: () => void
}) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4 max-w-5xl">
        {MODULES.map((m) => (
          <ModuleCard key={m.id} m={m} onOpen={() => onOpenModule(m)} />
        ))}
        <AddModuleCard onOpen={onCreateModule} />
      </div>
    </div>
  )
}

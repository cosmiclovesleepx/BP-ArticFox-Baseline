const ITEMS = [
  { id: 'modulos', label: 'Módulos', icon: '▦' },
  { id: 'reportes', label: 'Reportes', icon: '◫' },
  { id: 'usuarios', label: 'Usuarios', icon: '◍' },
  { id: 'config', label: 'Configuración', icon: '⚙' },
] as const

export type ViewId = (typeof ITEMS)[number]['id']

export function Sidebar({ active, setActive }: { active: ViewId; setActive: (id: ViewId) => void }) {
  return (
    <div className="w-56 shrink-0 border-r border-line bg-panel flex flex-col">
      <div className="px-5 py-5 border-b border-line flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-accent/15 border border-accent/40 flex items-center justify-center text-accent font-display font-bold text-xs">
          P
        </div>
        <span className="font-display tracking-[0.2em] text-xs text-text-dim">POLAR OPS</span>
      </div>
      <nav className="flex-1 py-3">
        {ITEMS.map((it) => (
          <button
            key={it.id}
            onClick={() => setActive(it.id)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors border-l-2 ${
              active === it.id
                ? 'border-accent text-text bg-panel-2'
                : 'border-transparent text-text-dim hover:text-text'
            }`}
          >
            <span className="font-mono text-base">{it.icon}</span>
            {it.label}
          </button>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-line flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-panel-2 border border-line flex items-center justify-center text-xs font-mono">
          JD
        </div>
        <div className="text-xs">
          <div>juan.delgado</div>
          <div className="text-text-dim font-mono text-[10px]">admin</div>
        </div>
      </div>
    </div>
  )
}

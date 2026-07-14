import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { expandWindow } from '@/lib/tauri'

// FASE 0: login simulado (cualquier credencial pasa tras un delay falso).
// FASE 1: reemplazar handleLogin por POST a api.blackpolar.org/auth/login,
// guardar el JWT (ej. en memoria + refresh, no localStorage por seguridad) y
// solo entonces llamar onSuccess().

type Stage = 'boot' | 'login'

export function SplashLogin({ onSuccess }: { onSuccess: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [stage, setStage] = useState<Stage>('boot')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setStage('login'), 1000)
    return () => clearTimeout(t)
  }, [])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!user || !pass) {
      setError('Ingresa usuario y contraseña.')
      return
    }
    setLoading(true)
    setTimeout(async () => {
      setLoading(false)
      setExpanded(true)
      await expandWindow()
      setTimeout(onSuccess, 500)
    }, 800)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#05070B]">
      <div
        className={`transition-all duration-500 ease-out rounded-xl border border-line overflow-hidden bg-panel
        ${expanded ? 'w-full h-full rounded-none' : 'w-[360px] h-[420px] shadow-[0_20px_60px_-20px_rgba(94,234,212,0.15)]'}`}
      >
        {!expanded && (
          <div className="w-full h-full flex flex-col items-center justify-center px-8 animate-in fade-in">
            <div className="relative mb-6">
              <div className="w-14 h-14 rounded-lg border border-accent/40 flex items-center justify-center font-display font-bold text-xl text-accent">
                P
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-accent-2 animate-pulse" />
            </div>
            <div className="font-display text-sm tracking-[0.3em] text-text-dim mb-8">POLAR OPS</div>

            {stage === 'boot' && (
              <div className="font-mono text-xs text-text-dim flex items-center gap-2">
                <span className="animate-pulse">●</span> inicializando sesión…
              </div>
            )}

            {stage === 'login' && (
              <form onSubmit={handleLogin} className="w-full space-y-3">
                <Input placeholder="usuario" value={user} onChange={(e) => setUser(e.target.value)} />
                <Input
                  type="password"
                  placeholder="contraseña"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                {error && <div className="text-xs text-accent-2 font-mono">{error}</div>}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Verificando…' : 'Iniciar sesión'}
                </Button>
                <div className="text-[10px] text-text-dim text-center font-mono pt-1">
                  api.blackpolar.org · PostgreSQL
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

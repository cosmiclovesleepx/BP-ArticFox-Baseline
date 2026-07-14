import { useState } from 'react'
import { SplashLogin } from '@/views/SplashLogin'
import { Sidebar, type ViewId } from '@/views/Sidebar'
import { TopBar } from '@/views/TopBar'
import { ModulesView } from '@/views/ModulesView'
import { ModuleDetail } from '@/views/ModuleDetail'
import { ReportsView } from '@/views/ReportsView'
import { CreateModuleView } from '@/views/CreateModuleView'
import { PlaceholderView } from '@/views/PlaceholderView'
import type { AppModule } from '@/types'

const TITLES: Record<ViewId, string> = {
  modulos: 'Módulos',
  reportes: 'Reportes',
  usuarios: 'Usuarios',
  config: 'Configuración',
}

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [active, setActive] = useState<ViewId>('modulos')
  const [openModule, setOpenModule] = useState<AppModule | null>(null)
  const [creatingModule, setCreatingModule] = useState(false)

  if (!authed) return <SplashLogin onSuccess={() => setAuthed(true)} />

  function changeView(id: ViewId) {
    setActive(id)
    setOpenModule(null)
    setCreatingModule(false)
  }

  const title = creatingModule ? 'Nuevo módulo' : openModule ? openModule.nombre : TITLES[active]
  const breadcrumb = creatingModule ? 'módulos / nuevo' : openModule ? `módulos / ${openModule.id}` : active

  return (
    <div className="h-screen w-screen flex bg-bg">
      <Sidebar active={active} setActive={changeView} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} breadcrumb={breadcrumb} />
        <div className="flex-1 overflow-y-auto">
          {active === 'modulos' &&
            (creatingModule ? (
              <CreateModuleView onBack={() => setCreatingModule(false)} />
            ) : openModule ? (
              <ModuleDetail modulo={openModule} onBack={() => setOpenModule(null)} />
            ) : (
              <ModulesView onOpenModule={setOpenModule} onCreateModule={() => setCreatingModule(true)} />
            ))}
          {active === 'reportes' && <ReportsView />}
          {active === 'usuarios' && <PlaceholderView label="gestión de usuarios" />}
          {active === 'config' && <PlaceholderView label="configuración general" />}
        </div>
      </div>
    </div>
  )
}

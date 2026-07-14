export interface ModuleScript {
  id: string
  nombre: string
  tag: string
}

export interface AppModule {
  id: string
  nombre: string
  desc: string
  color: string
  scripts: ModuleScript[]
}

export interface Report {
  id: number
  nombre: string
  usuarios: number
  vistas: string
  editado: string
}

export type JobStatus = 'idle' | 'running' | 'done'

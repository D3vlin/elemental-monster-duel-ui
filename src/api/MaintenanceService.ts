import { supabaseGet } from './SupabaseService'
import type { MaintenanceWindow } from './dto/MaintenanceWindowDto'

// Se apoya en el índice único parcial de la BD (a lo sumo una fila con
// active = true) — por eso alcanza con pedir "la que esté activa" y quedarse
// con la primera: nunca hay ambigüedad de cuál mostrar.
const SELECT =
  'id,startsAt:starts_at,endsAt:ends_at,translations:maintenance_window_translation(title,message,note,locale(code))'

const getActiveWindow = () =>
  supabaseGet<MaintenanceWindow[]>('/maintenance_window', { select: SELECT, active: 'eq.true' })

export const MaintenanceService = {
  getActiveWindow,
}

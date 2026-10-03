// Lectura directa a Supabase (PostgREST), sin pasar por la api en Render —
// para datos que deben seguir disponibles aunque la api esté caída o en
// mantenimiento (ver maintenance_window). Solo SELECT: la única barrera de
// seguridad es RLS del lado de Supabase, no hay nada de esto detrás de auth.
//
// Nota a futuro: si se agrega Auth (probablemente vía una api nueva para
// eso), ahí sí conviene reevaluar @supabase/supabase-js en vez de fetch
// crudo — maneja sesión/refresh de tokens, Realtime y Storage, nada de lo
// cual hace falta hoy para justificar el peso de la librería en el bundle.
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './SupabaseConst'

export class SupabaseRequestError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function supabaseGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''

  let response: Response
  try {
    response = await fetch(`${SUPABASE_URL}/rest/v1${path}${query}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })
  } catch (error) {
    console.error('Supabase request failed:', error)
    throw new SupabaseRequestError('No se pudo conectar con Supabase.', 0)
  }

  if (!response.ok) {
    const body: { message?: string } | null = await response.json().catch(() => null)
    throw new SupabaseRequestError(body?.message ?? 'Supabase request failed', response.status)
  }

  return response.json() as Promise<T>
}

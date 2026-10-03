// Aviso de mantenimiento programado, leído directo de Supabase (ver
// MaintenanceService/SupabaseService) — sigue funcionando aunque la api en
// Render esté caída o en medio de un deploy, que es justo cuando más hace
// falta. No reemplaza la app entera como ServiceUnavailablePage: es un
// banner que convive con el resto del contenido.
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSupabaseQuery } from '@hooks/useSupabaseQuery'
import { MaintenanceService } from '@api/MaintenanceService'
import { formatRemaining } from './formatRemaining'

const POLL_MS = 60_000
const TICK_MS = 30_000

export default function MaintenanceBanner() {
  const { t, i18n } = useTranslation()
  const { data } = useSupabaseQuery(['maintenance-window'], () => MaintenanceService.getActiveWindow(), {
    refetchInterval: POLL_MS,
  })
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(id)
  }, [])

  const activeWindow = data?.[0]
  if (!activeWindow) return null

  const startsAt = new Date(activeWindow.startsAt).getTime()
  const endsAt = new Date(activeWindow.endsAt).getTime()
  if (now >= endsAt) return null

  const translation =
    activeWindow.translations.find((entry) => entry.locale.code === i18n.language) ?? activeWindow.translations[0]
  if (!translation) return null

  const isUpcoming = now < startsAt
  const remaining = formatRemaining((isUpcoming ? startsAt : endsAt) - now)

  return (
    <div
      role="status"
      className="border-b border-(--accent-border) bg-(--accent-bg) px-4 py-3 text-center text-sm text-(--text-h)"
    >
      <p className="font-semibold">{translation.title}</p>
      <p>{translation.message}</p>
      <p>{t(isUpcoming ? 'maintenance.startsIn' : 'maintenance.endsIn', { time: remaining })}</p>
      {translation.note && <p className="mt-1 text-xs italic opacity-80">{translation.note}</p>}
    </div>
  )
}

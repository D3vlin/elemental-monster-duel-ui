// Formatea un remanente en ms como "2d 3h", "3h 15m", "15m" o "< 1m" — la
// unidad más grande que aplica, más la siguiente, sin precisión de segundos
// (no hace falta para una ventana de mantenimiento).
export function formatRemaining(ms: number): string {
  if (ms <= 0) return '0m'

  const totalMinutes = Math.floor(ms / 60_000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m`
  return '< 1m'
}

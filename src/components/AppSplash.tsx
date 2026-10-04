// Splash de arranque: tapa la app un instante al aterrizar en Home (carga
// directa o refresh) y se desvanece para revelar el contenido, que ya está
// montado detrás — sin parpadeo. Reusa GameLogo, el mismo tratamiento que
// LoadingOverlay, para que "el logo" sea una sola cosa en toda la app.
import { useEffect, useState } from 'react'
import { Z_MODAL } from '@constants/zIndex'
import GameLogo from './GameLogo'

const VISIBLE_MS = 1200
const FADE_MS = 300

export default function AppSplash() {
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setVisible(false), VISIBLE_MS)
    const unmountTimer = window.setTimeout(() => setMounted(false), VISIBLE_MS + FADE_MS)
    return () => {
      window.clearTimeout(hideTimer)
      window.clearTimeout(unmountTimer)
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      data-testid="app-splash"
      className={`fixed inset-0 ${Z_MODAL} flex items-center justify-center bg-(--bg)`}
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease` }}
    >
      <GameLogo className="text-4xl" />
    </div>
  )
}

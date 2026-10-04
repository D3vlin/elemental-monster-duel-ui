// Splash de arranque: tapa la app un instante al aterrizar en Home (carga
// directa o refresh) y se desvanece para revelar el contenido, que ya está
// montado detrás — sin parpadeo. Reusa GameLogo, el mismo tratamiento que
// LoadingOverlay, para que "el logo" sea una sola cosa en toda la app.
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Z_MODAL } from '@constants/zIndex'
import GameLogo from './GameLogo'

const VISIBLE_MS = 1200
const FADE_MS = 300

export default function AppSplash() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(true)
  const dismissedRef = useRef(false)

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setVisible(false), VISIBLE_MS)
    const unmountTimer = window.setTimeout(() => setMounted(false), VISIBLE_MS + FADE_MS)
    return () => {
      window.clearTimeout(hideTimer)
      window.clearTimeout(unmountTimer)
    }
  }, [])

  function skip() {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setVisible(false)
    setMounted(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    skip()
  }

  if (!mounted) return null

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={t('splash.skip')}
      data-testid="app-splash"
      onClick={skip}
      onKeyDown={handleKeyDown}
      className={`fixed inset-0 ${Z_MODAL} flex items-center justify-center bg-(--bg)`}
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease` }}
    >
      <GameLogo className="text-4xl" />
    </div>
  )
}

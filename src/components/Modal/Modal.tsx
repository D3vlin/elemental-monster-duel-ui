import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Z_MODAL } from '@constants/zIndex'
import type { ModalOrigin } from './modalOrigin'

const TRANSITION_MS = 180
const HIDDEN_TRANSFORM = 'scale(0.1)'

function transformToward(center: ModalOrigin | null, origin: ModalOrigin | null): string {
  if (!origin || !center) return HIDDEN_TRANSFORM
  const dx = origin.x - center.x
  const dy = origin.y - center.y
  return `translate(${dx}px, ${dy}px) scale(0.1)`
}

interface ModalProps {
  origin: ModalOrigin | null
  onClose: () => void
  ariaLabel?: string
  panelClassName: string
  children: (requestClose: () => void) => ReactNode
}

export default function Modal({ origin, onClose, ariaLabel, panelClassName, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelCenter, setPanelCenter] = useState<ModalOrigin | null>(null)
  const [transform, setTransform] = useState(HIDDEN_TRANSFORM)
  const [visible, setVisible] = useState(false)

  useLayoutEffect(() => {
    const rect = panelRef.current?.getBoundingClientRect()
    const center = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null
    setPanelCenter(center)
    setTransform(transformToward(center, origin))
    const raf = requestAnimationFrame(() => {
      setVisible(true)
      setTransform('translate(0, 0) scale(1)')
    })
    return () => cancelAnimationFrame(raf)
  }, [origin])

  const requestClose = useCallback(() => {
    setVisible(false)
    setTransform(transformToward(panelCenter, origin))
    window.setTimeout(onClose, TRANSITION_MS)
  }, [origin, onClose, panelCenter])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [requestClose])

  return (
    <div
      className={`fixed inset-0 ${Z_MODAL} flex items-center justify-center bg-black/50 p-4`}
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${TRANSITION_MS}ms ease` }}
      onClick={(event) => {
        if (!panelRef.current?.contains(event.target as Node)) requestClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={panelClassName}
        style={{ transform, transition: `transform ${TRANSITION_MS}ms ease` }}
      >
        {children(requestClose)}
      </div>
    </div>
  )
}

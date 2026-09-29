// <main> centrado a pantalla completa, base compartida por las pantallas de
// un solo bloque de contenido (Home, ServiceUnavailable). `className` agrega
// lo que varía entre ellas (p. ej. el gap).
import type { ReactNode } from 'react'

interface BodyContainerProps {
  className?: string
  children: ReactNode
}

export default function BodyContainer({ className = '', children }: BodyContainerProps) {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-center bg-(--bg) p-6 text-center ${className}`}>
      {children}
    </main>
  )
}

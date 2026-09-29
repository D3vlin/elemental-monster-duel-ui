import type { MouseEvent } from 'react'

export interface ModalOrigin {
  x: number
  y: number
}

export function getClickOrigin(event: MouseEvent<HTMLElement>): ModalOrigin {
  if (event.clientX === 0 && event.clientY === 0) {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
  return { x: event.clientX, y: event.clientY }
}

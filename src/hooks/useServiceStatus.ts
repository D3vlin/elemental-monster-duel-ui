import { useSyncExternalStore } from 'react'

type Listener = () => void

let isUnavailable = false
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((listener) => listener())
}

export function reportServiceUnavailable() {
  if (isUnavailable) return
  isUnavailable = true
  notify()
}

export function resetServiceStatus() {
  if (!isUnavailable) return
  isUnavailable = false
  notify()
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return isUnavailable
}

export function useServiceStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot)
}

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useWhatsNewUnseen } from '@hooks/useWhatsNewUnseen'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useWhatsNewUnseen', () => {
  it('is unseen when there is a latest entry and nothing was seen before', () => {
    const { result } = renderHook(() => useWhatsNewUnseen(5))

    expect(result.current.hasUnseen).toBe(true)
  })

  it('is not unseen while there is no latest entry yet', () => {
    const { result } = renderHook(() => useWhatsNewUnseen(undefined))

    expect(result.current.hasUnseen).toBe(false)
  })

  it('clears once the latest entry is marked as seen, and persists it', () => {
    const { result, rerender } = renderHook(({ id }) => useWhatsNewUnseen(id), { initialProps: { id: 5 } })

    act(() => result.current.markSeen())
    rerender({ id: 5 })

    expect(result.current.hasUnseen).toBe(false)
    expect(localStorage.getItem('whatsNewLastSeenId')).toBe('5')
  })

  it('flips back to unseen when a newer entry shows up', () => {
    const { result, rerender } = renderHook(({ id }) => useWhatsNewUnseen(id), { initialProps: { id: 5 } })

    act(() => result.current.markSeen())
    rerender({ id: 6 })

    expect(result.current.hasUnseen).toBe(true)
  })

  it('does not throw when localStorage.getItem is unavailable, treating it as nothing seen', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })

    const { result } = renderHook(() => useWhatsNewUnseen(5))

    expect(result.current.hasUnseen).toBe(true)
  })

  it('does not throw when localStorage.setItem is unavailable, still updating in-memory state', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota exceeded', 'QuotaExceededError')
    })

    const { result } = renderHook(() => useWhatsNewUnseen(5))

    act(() => result.current.markSeen())

    expect(result.current.hasUnseen).toBe(false)
  })
})

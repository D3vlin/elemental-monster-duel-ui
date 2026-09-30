import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useWhatsNewUnseen } from '@hooks/useWhatsNewUnseen'

beforeEach(() => {
  localStorage.clear()
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
})

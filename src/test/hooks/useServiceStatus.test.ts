import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { reportServiceUnavailable, resetServiceStatus, useServiceStatus } from '@hooks/useServiceStatus'

afterEach(() => {
  resetServiceStatus()
})

describe('useServiceStatus', () => {
  it('starts as available', () => {
    const { result } = renderHook(() => useServiceStatus())

    expect(result.current).toBe(false)
  })

  it('flips to unavailable when reported, and notifies subscribers', () => {
    const { result } = renderHook(() => useServiceStatus())

    act(() => reportServiceUnavailable())

    expect(result.current).toBe(true)
  })

  it('flips back to available on reset', () => {
    const { result } = renderHook(() => useServiceStatus())

    act(() => reportServiceUnavailable())
    act(() => resetServiceStatus())

    expect(result.current).toBe(false)
  })

  it('is idempotent — reporting twice does not break state', () => {
    const { result } = renderHook(() => useServiceStatus())

    act(() => {
      reportServiceUnavailable()
      reportServiceUnavailable()
    })

    expect(result.current).toBe(true)
  })
})

import { afterEach, describe, expect, it } from 'vitest'
import { ApiRequestError } from '@api/unwrapResponse'
import { resetServiceStatus, useServiceStatus } from '@hooks/useServiceStatus'
import { renderHook } from '@testing-library/react'
import { queryClient } from '../queryClient'

afterEach(() => {
  resetServiceStatus()
})

describe('queryClient retry', () => {
  it('retries once on a service-down error (503)', () => {
    const retry = queryClient.getDefaultOptions().queries?.retry as (failureCount: number, error: unknown) => boolean

    expect(retry(0, new ApiRequestError('down', 503, 'error'))).toBe(true)
    expect(retry(1, new ApiRequestError('down', 503, 'error'))).toBe(false)
  })

  it('retries once on a network failure (code 0)', () => {
    const retry = queryClient.getDefaultOptions().queries?.retry as (failureCount: number, error: unknown) => boolean

    expect(retry(0, new ApiRequestError('offline', 0, 'error'))).toBe(true)
  })

  it('never retries a business error such as 404', () => {
    const retry = queryClient.getDefaultOptions().queries?.retry as (failureCount: number, error: unknown) => boolean

    expect(retry(0, new ApiRequestError('not found', 404, 'Not Found'))).toBe(false)
  })
})

describe('queryClient onError', () => {
  it('reports the service as unavailable on a service-down error', () => {
    queryClient.getQueryCache().config.onError?.(
      new ApiRequestError('down', 503, 'error'),
      // @ts-expect-error minimal query stub, only onError's handling of the error matters here
      {},
    )

    const { result } = renderHook(() => useServiceStatus())
    expect(result.current).toBe(true)
  })

  it('does not report the service as unavailable on a business error', () => {
    queryClient.getQueryCache().config.onError?.(
      new ApiRequestError('not found', 404, 'Not Found'),
      // @ts-expect-error minimal query stub, only onError's handling of the error matters here
      {},
    )

    const { result } = renderHook(() => useServiceStatus())
    expect(result.current).toBe(false)
  })
})

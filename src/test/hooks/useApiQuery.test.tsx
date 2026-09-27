import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import type { Message } from '@api/Message'
import { ApiRequestError } from '@api/unwrapResponse'
import { useApiQuery } from '@hooks/useApiQuery'

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useApiQuery', () => {
  it('resolves with the unwrapped data on a success Message', async () => {
    const service = vi.fn<() => Promise<Message<string>>>().mockResolvedValue({
      code: 200,
      status: 'success',
      data: 'hello',
    })

    const { result } = renderHook(() => useApiQuery(['greeting'], service), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe('hello')
    expect(service).toHaveBeenCalledTimes(1)
  })

  it('surfaces a non-success Message as an ApiRequestError', async () => {
    const service = vi.fn<() => Promise<Message<string>>>().mockResolvedValue({
      code: 500,
      status: 'error',
      message: 'boom',
    })

    const { result } = renderHook(() => useApiQuery(['greeting'], service), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeInstanceOf(ApiRequestError)
    expect((result.current.error as ApiRequestError).code).toBe(500)
    expect((result.current.error as ApiRequestError).status).toBe('error')
    expect(result.current.error?.message).toBe('boom')
  })

  it('never calls the service when disabled', () => {
    const service = vi.fn<() => Promise<Message<string>>>()

    renderHook(() => useApiQuery(['greeting'], service, { enabled: false }), { wrapper })

    expect(service).not.toHaveBeenCalled()
  })

  it('applies a select transform to the unwrapped data', async () => {
    const service = vi.fn<() => Promise<Message<string>>>().mockResolvedValue({
      code: 200,
      status: 'success',
      data: 'hello',
    })

    const { result } = renderHook(
      () => useApiQuery(['greeting'], service, { select: (data) => (data ?? '').toUpperCase() }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe('HELLO')
  })
})

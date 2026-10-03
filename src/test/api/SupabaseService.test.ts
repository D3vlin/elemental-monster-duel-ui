import { afterEach, describe, expect, it, vi } from 'vitest'
import { supabaseGet, SupabaseRequestError } from '@api/SupabaseService'

function mockFetchOnce(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('supabaseGet', () => {
  it('resolves with the parsed JSON body on success', async () => {
    mockFetchOnce(new Response(JSON.stringify({ id: 1 }), { status: 200 }))

    const result = await supabaseGet<{ id: number }>('/maintenance_window')

    expect(result).toEqual({ id: 1 })
  })

  it('throws a generic message on an HTTP error, never the raw PostgREST message', async () => {
    mockFetchOnce(
      new Response(JSON.stringify({ message: 'permission denied for table maintenance_window' }), {
        status: 403,
      }),
    )

    await expect(supabaseGet('/maintenance_window')).rejects.toMatchObject({
      message: 'No se pudo completar la solicitud a Supabase.',
      status: 403,
    })
  })

  it('throws the generic message even when the error body is not valid JSON', async () => {
    mockFetchOnce(new Response('not json', { status: 500 }))

    await expect(supabaseGet('/maintenance_window')).rejects.toBeInstanceOf(SupabaseRequestError)
  })

  it('reports a network failure (fetch rejecting) as a generic error with status 0', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(supabaseGet('/maintenance_window')).rejects.toMatchObject({
      message: 'No se pudo conectar con Supabase.',
      status: 0,
    })
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DeleteQuery, GetPagedQuery, GetQuery, PostQuery, PutQuery } from '@api/ApiService'

function mockFetchOnce(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

beforeEach(() => {
  sessionStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('ApiService', () => {
  describe('request building', () => {
    it('resolves the base URL against the endpoint path (no VITE_API_URL in test env -> localhost fallback)', async () => {
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await GetQuery('/elemental-monster-duel/cards', {})

      const [url] = fetchMock.mock.calls[0]
      expect(url).toBe('http://localhost:8080/elemental-monster-duel/cards')
    })

    it('serializes query params and drops undefined values', async () => {
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await GetQuery('/elemental-monster-duel/cards', {}, { size: 100, sort: 'id,asc', lang: undefined })

      const [url] = fetchMock.mock.calls[0]
      expect(url).toBe('http://localhost:8080/elemental-monster-duel/cards?size=100&sort=id%2Casc')
    })

    it('sends no query string when params are omitted', async () => {
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await GetQuery('/elemental-monster-duel/cards', {})

      const [url] = fetchMock.mock.calls[0]
      expect(url).toBe('http://localhost:8080/elemental-monster-duel/cards')
    })
  })

  describe('headers', () => {
    it('sets Content-Type: application/json by default', async () => {
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await GetQuery('/x', {})

      const [, options] = fetchMock.mock.calls[0]
      expect((options.headers as Record<string, string>)['Content-Type']).toBe('application/json')
    })

    it('adds an Authorization header when addToken is set and a token is stored', async () => {
      sessionStorage.setItem('access_token', 'abc123')
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await GetQuery('/x', { addToken: true })

      const [, options] = fetchMock.mock.calls[0]
      expect((options.headers as Record<string, string>)['Authorization']).toBe('Bearer abc123')
    })

    it('omits the Authorization header when addToken is set but nothing is stored', async () => {
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await GetQuery('/x', { addToken: true })

      const [, options] = fetchMock.mock.calls[0]
      expect((options.headers as Record<string, string>)['Authorization']).toBeUndefined()
    })

    it('omits the Authorization header when addToken is not set, even with a stored token', async () => {
      sessionStorage.setItem('access_token', 'abc123')
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await GetQuery('/x', {})

      const [, options] = fetchMock.mock.calls[0]
      expect((options.headers as Record<string, string>)['Authorization']).toBeUndefined()
    })
  })

  describe('credentials', () => {
    it('always uses include, so a session cookie is never silently dropped', async () => {
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await GetQuery('/x', {})

      const [, options] = fetchMock.mock.calls[0]
      expect(options.credentials).toBe('include')
    })

    it('uses include on body requests (POST/PUT) too', async () => {
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await PostQuery('/x', {}, { name: 'Fuego' })

      const [, options] = fetchMock.mock.calls[0]
      expect(options.credentials).toBe('include')
    })
  })

  describe('response handling', () => {
    it('maps a 401 to status Unauthorized, falling back when the body has no message', async () => {
      mockFetchOnce(new Response(null, { status: 401 }))

      const result = await GetQuery('/x', {})

      expect(result).toMatchObject({ code: 401, status: 'Unauthorized', message: 'Sesión inválida o expirada.' })
    })

    it('maps a 401 to status Unauthorized, using the backend message when present', async () => {
      mockFetchOnce(new Response(JSON.stringify({ message: 'Token vencido' }), { status: 401 }))

      const result = await GetQuery('/x', {})

      expect(result).toMatchObject({ code: 401, status: 'Unauthorized', message: 'Token vencido' })
    })

    it('maps a 404 to status "Not Found", falling back when the body has no message', async () => {
      mockFetchOnce(new Response(null, { status: 404 }))

      const result = await GetQuery('/x', {})

      expect(result).toMatchObject({ code: 404, status: 'Not Found', message: 'Recurso no encontrado.' })
    })

    it('maps a 404 to status "Not Found", using the backend message when present', async () => {
      mockFetchOnce(new Response(JSON.stringify({ message: 'Carta no encontrada' }), { status: 404 }))

      const result = await GetQuery('/x', {})

      expect(result).toMatchObject({ code: 404, status: 'Not Found', message: 'Carta no encontrada' })
    })

    it('maps another non-ok status to status error, using the backend message when present', async () => {
      mockFetchOnce(new Response(JSON.stringify({ message: 'card not valid' }), { status: 500 }))

      const result = await GetQuery('/x', {})

      expect(result).toMatchObject({ code: 500, status: 'error', message: 'card not valid' })
    })

    it('falls back to a default message when the error body is not valid JSON', async () => {
      mockFetchOnce(new Response('not json', { status: 500 }))

      const result = await GetQuery('/x', {})

      expect(result).toMatchObject({ code: 500, status: 'error', message: 'Request failed' })
    })

    it('maps a 204 to success with null data', async () => {
      mockFetchOnce(new Response(null, { status: 204 }))

      const result = await GetQuery('/x', {})

      expect(result).toEqual({ code: 204, status: 'success', data: null })
    })

    it('maps a 200 with an empty body to success with null data', async () => {
      mockFetchOnce(new Response('', { status: 200 }))

      const result = await GetQuery('/x', {})

      expect(result).toEqual({ code: 200, status: 'success', data: null })
    })

    it('parses a 200 JSON body into data', async () => {
      mockFetchOnce(new Response(JSON.stringify({ id: 1, name: 'Fuego' }), { status: 200 }))

      const result = await GetQuery<{ id: number; name: string }>('/x', {})

      expect(result).toEqual({ code: 200, status: 'success', data: { id: 1, name: 'Fuego' } })
    })

    it('reports a network failure (fetch rejecting) as a generic error, without throwing', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
      )

      const result = await GetQuery('/x', {})

      expect(result).toEqual({ code: 0, status: 'error', message: 'No se pudo conectar con la API.' })
    })
  })

  describe('PostQuery / PutQuery body', () => {
    it('stringifies a plain object and sets Content-Type: application/json', async () => {
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await PostQuery('/x', {}, { name: 'Fuego' })

      const [, options] = fetchMock.mock.calls[0]
      expect(options.method).toBe('POST')
      expect(options.body).toBe(JSON.stringify({ name: 'Fuego' }))
      expect((options.headers as Record<string, string>)['Content-Type']).toBe('application/json')
    })

    it('sends FormData as-is, without a Content-Type header', async () => {
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))
      const formData = new FormData()
      formData.append('file', 'contents')

      await PutQuery('/x', {}, formData)

      const [, options] = fetchMock.mock.calls[0]
      expect(options.method).toBe('PUT')
      expect(options.body).toBe(formData)
      expect((options.headers as Record<string, string>)['Content-Type']).toBeUndefined()
    })

    it('sends an undefined body when no data is given', async () => {
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await PostQuery('/x', {})

      const [, options] = fetchMock.mock.calls[0]
      expect(options.body).toBeUndefined()
    })
  })

  describe('DeleteQuery', () => {
    it('issues a DELETE request', async () => {
      const fetchMock = mockFetchOnce(new Response(null, { status: 204 }))

      await DeleteQuery('/x/1', {})

      const [, options] = fetchMock.mock.calls[0]
      expect(options.method).toBe('DELETE')
    })
  })

  describe('resolveBaseUrl domain matching', () => {
    it('uses the mapped domain base URL when the endpoint matches a configured prefix', async () => {
      vi.resetModules()
      vi.stubEnv('VITE_API_URL', 'https://custom.example.com')

      const { GetQuery: FreshGetQuery } = await import('@api/ApiService')
      const { CONTEXT_PATH } = await import('@api/ApiConst')
      const fetchMock = mockFetchOnce(new Response('{}', { status: 200 }))

      await FreshGetQuery(`${CONTEXT_PATH}/cards`, {})

      const [url] = fetchMock.mock.calls[0]
      expect(url).toBe(`https://custom.example.com${CONTEXT_PATH}/cards`)
    })
  })

  describe('GetPagedQuery', () => {
    it('flattens a successful page response down to its content', async () => {
      mockFetchOnce(new Response(JSON.stringify({ content: [{ id: 1 }, { id: 2 }] }), { status: 200 }))

      const result = await GetPagedQuery<{ id: number }>('/x', {})

      expect(result).toEqual({ code: 200, status: 'success', data: [{ id: 1 }, { id: 2 }] })
    })

    it('defaults to an empty array when content is missing', async () => {
      mockFetchOnce(new Response(JSON.stringify({}), { status: 200 }))

      const result = await GetPagedQuery('/x', {})

      expect(result).toEqual({ code: 200, status: 'success', data: [] })
    })

    it('passes a non-success Message through untouched', async () => {
      mockFetchOnce(new Response(null, { status: 404 }))

      const result = await GetPagedQuery('/x', {})

      expect(result).toMatchObject({ code: 404, status: 'Not Found' })
    })
  })
})

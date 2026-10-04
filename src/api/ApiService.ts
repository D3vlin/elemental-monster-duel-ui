import type { EndpointProperty } from './EndpointProperty'
import type { Message } from './Message'
import type { PageResponse } from './PageResponse'
import { CONTEXT_PATH } from './ApiConst'

type QueryParams = Record<string, string | number | boolean | undefined>

function getAccessToken(): string | null {
  return sessionStorage.getItem('access_token')
}

function createHeaders({ addToken }: EndpointProperty, isJson = true): HeadersInit {
  const headers: HeadersInit = {}

  if (isJson) {
    headers['Content-Type'] = 'application/json'
  }

  if (addToken) {
    const token = getAccessToken()

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

async function safeParseError(response: Response): Promise<string | undefined> {
  try {
    const errorData = (await response.json()) as { message?: string } | null
    return errorData?.message ?? undefined
  } catch {
    return undefined
  }
}

async function handleRequest<T>(request: Promise<Response>, voidContent: T | null = null): Promise<Message<T>> {
  try {
    const response = await request

    if (response.status === 401) {
      return { code: response.status, status: 'Unauthorized', message: (await safeParseError(response)) ?? 'Sesión inválida o expirada.' }
    }
    if (response.status === 404) {
      return { code: response.status, status: 'Not Found', message: (await safeParseError(response)) ?? 'Recurso no encontrado.' }
    }
    if (!response.ok) {
      return { code: response.status, status: 'error', message: (await safeParseError(response)) ?? 'Request failed' }
    }

    if (response.status === 204) {
      return { code: 204, status: 'success', data: voidContent }
    }

    const text = await response.text()
    const data = text ? (JSON.parse(text) as T) : voidContent

    return { code: response.status, status: 'success', data }
  } catch {
    return { code: 0, status: 'error', message: 'No se pudo conectar con la API.' }
  }
}

const API_BASE_MAP: Record<string, string | undefined> = {
  [CONTEXT_PATH]: import.meta.env.VITE_API_URL,
}

function resolveBaseUrl(url: string): string {
  const match = Object.keys(API_BASE_MAP).find((prefix) => url.startsWith(prefix))

  if (match && API_BASE_MAP[match]) {
    return API_BASE_MAP[match] as string
  }

  return import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
}

const httpParams = async <T>(
  method: string,
  url: string,
  endpointProperty: EndpointProperty,
  params?: QueryParams,
): Promise<Message<T>> => {
  const baseUrl = resolveBaseUrl(url)

  const query = params
    ? `?${new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ).toString()}`
    : ''

  const headers = createHeaders(endpointProperty)

  return handleRequest<T>(
    fetch(`${baseUrl}${url}${query}`, {
      method,
      headers,
      credentials: 'include',
    }),
  )
}

const httpBody = async <TResponse, TRequest = unknown>(
  method: string,
  url: string,
  endpointProperty: EndpointProperty,
  data?: TRequest,
): Promise<Message<TResponse>> => {
  const baseUrl = resolveBaseUrl(url)

  const isFormData = data instanceof FormData
  const headers = createHeaders(endpointProperty, !isFormData)

  return handleRequest<TResponse>(
    fetch(`${baseUrl}${url}`, {
      method,
      headers,
      credentials: 'include',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    }),
  )
}

export const GetQuery = <T>(url: string, endpointProperty: EndpointProperty, params?: QueryParams): Promise<Message<T>> => {
  return httpParams('GET', url, endpointProperty, params)
}

export const PostQuery = <TResponse, TRequest = unknown>(
  url: string,
  endpointProperty: EndpointProperty,
  data?: TRequest,
): Promise<Message<TResponse>> => {
  return httpBody<TResponse, TRequest>('POST', url, endpointProperty, data)
}

export const PutQuery = <TResponse, TRequest = unknown>(
  url: string,
  endpointProperty: EndpointProperty,
  data?: TRequest,
): Promise<Message<TResponse>> => {
  return httpBody<TResponse, TRequest>('PUT', url, endpointProperty, data)
}

export const DeleteQuery = <T>(url: string, endpointProperty: EndpointProperty, params?: QueryParams): Promise<Message<T>> => {
  return httpParams('DELETE', url, endpointProperty, params)
}

export const GetPagedQuery = async <T>(
  url: string,
  endpointProperty: EndpointProperty,
  params?: QueryParams,
): Promise<Message<T[]>> => {
  const response = await GetQuery<PageResponse<T>>(url, endpointProperty, params)

  if (response.status !== 'success') {
    return response
  }

  return { code: response.code, status: 'success', data: response.data?.content ?? [] }
}

import type { Message } from './Message'

export class ApiRequestError extends Error {
  readonly code: number
  readonly status: Exclude<Message<unknown>['status'], 'success'>

  constructor(message: string, code: number, status: Exclude<Message<unknown>['status'], 'success'>) {
    super(message)
    this.code = code
    this.status = status
  }
}

export async function unwrapResponse<T>(promise: Promise<Message<T>>): Promise<T | null> {
  const response = await promise

  if (response.status !== 'success') {
    throw new ApiRequestError(response.message ?? 'Request failed', response.code, response.status)
  }

  return response.data
}

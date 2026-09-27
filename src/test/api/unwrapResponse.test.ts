import { describe, expect, it } from 'vitest'
import type { Message } from '@api/Message'
import { ApiRequestError, unwrapResponse } from '@api/unwrapResponse'

describe('unwrapResponse', () => {
  it('resolves with the data of a success Message', async () => {
    const message: Message<string> = { code: 200, status: 'success', data: 'hello' }

    await expect(unwrapResponse(Promise.resolve(message))).resolves.toBe('hello')
  })

  it('throws an ApiRequestError using the backend message when present', async () => {
    const message: Message<string> = { code: 404, status: 'Not Found', message: 'Carta no encontrada' }

    await expect(unwrapResponse(Promise.resolve(message))).rejects.toMatchObject({
      code: 404,
      status: 'Not Found',
      message: 'Carta no encontrada',
    })
  })

  it('falls back to a default message when the Message carries none', async () => {
    const message: Message<string> = { code: 500, status: 'error' }

    await expect(unwrapResponse(Promise.resolve(message))).rejects.toMatchObject({
      code: 500,
      status: 'error',
      message: 'Request failed',
    })
  })

  it('throws a real ApiRequestError instance', async () => {
    const message: Message<string> = { code: 500, status: 'error' }

    await expect(unwrapResponse(Promise.resolve(message))).rejects.toBeInstanceOf(ApiRequestError)
  })
})

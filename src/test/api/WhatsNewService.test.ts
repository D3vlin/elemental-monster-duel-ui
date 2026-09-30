import { describe, expect, it, vi } from 'vitest'
import { API } from '@api/ApiConst'
import { WhatsNewService } from '@api/WhatsNewService'

const { getQueryMock } = vi.hoisted(() => ({ getQueryMock: vi.fn() }))
vi.mock('@api/ApiService', () => ({ GetQuery: getQueryMock }))

describe('WhatsNewService.getEntries', () => {
  it('requests the EMD whats-new endpoint in the given language', async () => {
    getQueryMock.mockResolvedValue({ code: 200, status: 'success', data: [] })

    await WhatsNewService.getEntries('en')

    expect(getQueryMock).toHaveBeenCalledWith(API.EMD.GET_WHATS_NEW, {}, { lang: 'en' })
  })

  it('returns whatever GetQuery resolves', async () => {
    const message = { code: 200, status: 'success' as const, data: [{ id: 1 }] }
    getQueryMock.mockResolvedValue(message)

    await expect(WhatsNewService.getEntries('es')).resolves.toEqual(message)
  })
})

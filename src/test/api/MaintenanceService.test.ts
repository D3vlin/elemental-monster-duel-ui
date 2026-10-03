import { describe, expect, it, vi } from 'vitest'
import { MaintenanceService } from '@api/MaintenanceService'

const { supabaseGetMock } = vi.hoisted(() => ({ supabaseGetMock: vi.fn() }))
vi.mock('@api/SupabaseService', () => ({ supabaseGet: supabaseGetMock }))

describe('MaintenanceService.getActiveWindow', () => {
  it('requests the active maintenance window with its translations', async () => {
    supabaseGetMock.mockResolvedValue([])

    await MaintenanceService.getActiveWindow()

    expect(supabaseGetMock).toHaveBeenCalledWith('/maintenance_window', {
      select: 'id,startsAt:starts_at,endsAt:ends_at,translations:maintenance_window_translation(title,message,note,locale(code))',
      active: 'eq.true',
    })
  })

  it('returns whatever supabaseGet resolves', async () => {
    const window = [{ id: 1, startsAt: '2026-10-01T00:00:00Z', endsAt: '2026-10-01T02:00:00Z', translations: [] }]
    supabaseGetMock.mockResolvedValue(window)

    await expect(MaintenanceService.getActiveWindow()).resolves.toEqual(window)
  })
})

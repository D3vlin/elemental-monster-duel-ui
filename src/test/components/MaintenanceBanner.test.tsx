import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MaintenanceBanner from '@components/MaintenanceBanner'
import type { MaintenanceWindow } from '@api/dto/MaintenanceWindowDto'

const { getActiveWindowMock } = vi.hoisted(() => ({ getActiveWindowMock: vi.fn() }))
vi.mock('@api/MaintenanceService', () => ({ MaintenanceService: { getActiveWindow: getActiveWindowMock } }))

function renderBanner() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MaintenanceBanner />
    </QueryClientProvider>,
  )
}

function makeWindow(overrides: Partial<MaintenanceWindow> = {}): MaintenanceWindow {
  return {
    id: 1,
    startsAt: '2026-10-01T00:00:00Z',
    endsAt: '2026-10-01T02:00:00Z',
    translations: [
      { title: 'Mantenimiento', message: 'Vamos a hacer unos ajustes.', note: 'El tiempo es estimado.', locale: { code: 'es' } },
      { title: 'Maintenance', message: "We're making some adjustments.", note: 'Times are estimated.', locale: { code: 'en' } },
    ],
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('MaintenanceBanner', () => {
  it('renders nothing when there is no active maintenance window', async () => {
    getActiveWindowMock.mockResolvedValue([])

    renderBanner()

    await waitFor(() => expect(getActiveWindowMock).toHaveBeenCalled())
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows a countdown to the start when the window has not begun yet', async () => {
    vi.setSystemTime(new Date('2026-09-30T22:00:00Z'))
    getActiveWindowMock.mockResolvedValue([makeWindow()])

    renderBanner()

    expect(await screen.findByText('Mantenimiento')).toBeInTheDocument()
    expect(screen.getByText('Vamos a hacer unos ajustes.')).toBeInTheDocument()
    expect(screen.getByText('Empieza en 2h 0m')).toBeInTheDocument()
    expect(screen.getByText('El tiempo es estimado.')).toBeInTheDocument()
  })

  it('shows a countdown to the end when the window is in progress', async () => {
    vi.setSystemTime(new Date('2026-10-01T01:00:00Z'))
    getActiveWindowMock.mockResolvedValue([makeWindow()])

    renderBanner()

    expect(await screen.findByText('Termina en 1h 0m')).toBeInTheDocument()
  })

  it('renders nothing once the window has ended', async () => {
    vi.setSystemTime(new Date('2026-10-01T03:00:00Z'))
    getActiveWindowMock.mockResolvedValue([makeWindow()])

    renderBanner()

    await waitFor(() => expect(getActiveWindowMock).toHaveBeenCalled())
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('falls back to the first translation when none match the current language', async () => {
    vi.setSystemTime(new Date('2026-09-30T22:00:00Z'))
    getActiveWindowMock.mockResolvedValue([
      makeWindow({ translations: [{ title: 'Maintenance', message: 'msg', note: null, locale: { code: 'fr' } }] }),
    ])

    renderBanner()

    expect(await screen.findByText('Maintenance')).toBeInTheDocument()
  })

  it('does not render a note when the translation has none', async () => {
    vi.setSystemTime(new Date('2026-09-30T22:00:00Z'))
    getActiveWindowMock.mockResolvedValue([
      makeWindow({
        translations: [{ title: 'Mantenimiento', message: 'msg', note: null, locale: { code: 'es' } }],
      }),
    ])

    renderBanner()

    await screen.findByText('Mantenimiento')
    expect(screen.queryByText(/estimado/i)).not.toBeInTheDocument()
  })
})

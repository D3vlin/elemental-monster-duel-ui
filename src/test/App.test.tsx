import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reportServiceUnavailable, resetServiceStatus } from '@hooks/useServiceStatus'
import App from '../App'

const { getEntriesMock, getActiveWindowMock } = vi.hoisted(() => ({
  getEntriesMock: vi.fn(),
  getActiveWindowMock: vi.fn(),
}))
vi.mock('@api/WhatsNewService', () => ({ WhatsNewService: { getEntries: getEntriesMock } }))
vi.mock('@api/MaintenanceService', () => ({ MaintenanceService: { getActiveWindow: getActiveWindowMock } }))

beforeEach(() => {
  getEntriesMock.mockResolvedValue({ code: 200, status: 'success', data: [] })
  getActiveWindowMock.mockResolvedValue([])
})

function renderAt(path: string) {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

afterEach(() => {
  resetServiceStatus()
})

describe('App', () => {
  it('renders HomePage at /', () => {
    renderAt('/')

    expect(screen.getByRole('heading', { name: /elementalmonsterduel/i })).toBeInTheDocument()
  })

  it('shows the app version on every page', () => {
    renderAt('/')

    expect(screen.getByText(`v${__APP_VERSION__}`)).toBeInTheDocument()
  })

  it('replaces the whole app with the service-unavailable page when the backend is reported down', () => {
    reportServiceUnavailable()

    renderAt('/')

    expect(screen.getByRole('heading', { name: /servicio no disponible/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /elementalmonsterduel/i })).not.toBeInTheDocument()
  })

  it('shows the boot splash when landing on Home', () => {
    renderAt('/')

    expect(screen.getByTestId('app-splash')).toBeInTheDocument()
  })

  it('does not show the boot splash when landing directly on another route', () => {
    renderAt('/bestiary')

    expect(screen.queryByTestId('app-splash')).not.toBeInTheDocument()
  })
})

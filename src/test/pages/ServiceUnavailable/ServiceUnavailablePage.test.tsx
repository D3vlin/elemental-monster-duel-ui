import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { reportServiceUnavailable, resetServiceStatus, useServiceStatus } from '@hooks/useServiceStatus'
import ServiceUnavailablePage from '@pages/ServiceUnavailable/ServiceUnavailablePage'

afterEach(() => {
  resetServiceStatus()
})

function renderPage() {
  const queryClient = new QueryClient()
  const resetQueriesSpy = vi.spyOn(queryClient, 'resetQueries')
  render(
    <QueryClientProvider client={queryClient}>
      <ServiceUnavailablePage />
    </QueryClientProvider>,
  )
  return { resetQueriesSpy }
}

describe('ServiceUnavailablePage', () => {
  it('shows the title and message', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: /servicio no disponible/i })).toBeInTheDocument()
    expect(screen.getByText(/no está disponible por el momento/i)).toBeInTheDocument()
  })

  it('retrying clears the service status and resets the query cache', () => {
    reportServiceUnavailable()
    const status = renderHook(() => useServiceStatus())
    const { resetQueriesSpy } = renderPage()

    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }))

    expect(resetQueriesSpy).toHaveBeenCalledTimes(1)
    expect(status.result.current).toBe(false)
  })
})

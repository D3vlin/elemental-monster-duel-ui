import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
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
})

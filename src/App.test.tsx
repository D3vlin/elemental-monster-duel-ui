import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('renders HomePage at /', () => {
    renderAt('/')

    expect(screen.getByRole('heading', { name: /elementalmonsterduel/i })).toBeInTheDocument()
  })
})

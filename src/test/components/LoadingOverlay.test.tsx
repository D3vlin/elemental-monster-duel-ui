import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LoadingOverlay from '../../components/LoadingOverlay'

describe('LoadingOverlay', () => {
  it('shows the given label inside a status role', () => {
    render(<LoadingOverlay label="Cargando catálogo..." />)

    expect(screen.getByRole('status')).toHaveTextContent('Cargando catálogo...')
  })

  it('shows the game logo alongside the label', () => {
    render(<LoadingOverlay label="Cargando catálogo..." />)

    expect(screen.getByText('ElementalMonsterDuel')).toBeInTheDocument()
  })
})

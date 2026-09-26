import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('shows "nuevo duelo" as disabled until the duel engine is connected', () => {
    render(<HomePage />)

    const newDuelButton = screen.getByRole('button', { name: /nuevo duelo/i })
    expect(newDuelButton).toBeDisabled()
  })

  it('shows "bestiario" as disabled until it is connected', () => {
    render(<HomePage />)

    const bestiaryButton = screen.getByRole('button', { name: /bestiario/i })
    expect(bestiaryButton).toBeDisabled()
  })

  it('does not require any prior duel or session state to render', () => {
    render(<HomePage />)

    expect(screen.getByText(/ElementalMonsterDuel/i)).toBeInTheDocument()
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import ThemeToggle from '../../components/ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('ThemeToggle', () => {
  it('starts in light mode (no system dark preference in the test env) and shows the moon', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: /cambiar a modo oscuro/i })).toHaveTextContent('🌙')
  })

  it('toggles to dark on click, updating icon, label, and the document attribute', () => {
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByRole('button', { name: /cambiar a modo claro/i })).toHaveTextContent('☀️')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('toggles back to light on a second click', () => {
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByRole('button', { name: /cambiar a modo oscuro/i })).toHaveTextContent('🌙')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import i18n from '@i18n'
import LanguageToggle from '../../components/LanguageToggle'

afterEach(async () => {
  await i18n.changeLanguage('es')
})

describe('LanguageToggle', () => {
  it('shows the language it will switch to (en, while the app is in es)', () => {
    render(<LanguageToggle />)

    expect(screen.getByRole('button', { name: /cambiar idioma/i })).toHaveTextContent('en')
  })

  it('switches i18n to English on click', async () => {
    render(<LanguageToggle />)

    fireEvent.click(screen.getByRole('button'))

    expect(i18n.language).toBe('en')
  })

  it('shows "es" once already switched to English', async () => {
    await i18n.changeLanguage('en')
    render(<LanguageToggle />)

    expect(screen.getByRole('button')).toHaveTextContent('es')
  })

  it('switches back to Spanish on a second click', async () => {
    await i18n.changeLanguage('en')
    render(<LanguageToggle />)

    fireEvent.click(screen.getByRole('button'))

    expect(i18n.language).toBe('es')
  })
})

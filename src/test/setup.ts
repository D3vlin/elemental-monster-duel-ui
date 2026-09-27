import '@testing-library/jest-dom/vitest'
import i18n from '@i18n'

window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as MediaQueryList
await i18n.changeLanguage('es')

import { useTranslation } from 'react-i18next'
import { useTheme } from '@hooks/useTheme'

export default function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
      className="fixed top-3 right-3 rounded-lg border border-(--border) bg-(--bg) px-3 py-1.5 text-sm"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

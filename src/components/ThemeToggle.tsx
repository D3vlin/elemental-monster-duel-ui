import { useTheme } from '@hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="fixed top-3 right-3 rounded-lg border border-(--border) bg-(--bg) px-3 py-1.5 text-sm"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

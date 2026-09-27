import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { t, i18n } = useTranslation()
  const nextLanguage = i18n.language === 'es' ? 'en' : 'es'

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(nextLanguage)}
      aria-label={t('language.toggle')}
      className="fixed top-3 left-3 rounded-lg border border-(--border) bg-(--bg) px-3 py-1.5 text-sm uppercase"
    >
      {nextLanguage}
    </button>
  )
}

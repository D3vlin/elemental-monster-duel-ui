import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-(--bg) p-6 text-center">
      <div>
        <h1 className="text-4xl font-semibold text-(--text-h)">ElementalMonsterDuel</h1>
        <p className="mt-2 text-(--text)">{t('app.tagline')}</p>
      </div>

      <nav className="flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          disabled
          title={t('home.newDuelTitle')}
          className="cursor-not-allowed rounded-lg border border-(--border) bg-(--accent) px-6 py-3 font-medium text-white opacity-50"
        >
          {t('home.newDuel')}
        </button>

        <button
          type="button"
          disabled
          title={t('home.bestiaryTitle')}
          className="cursor-not-allowed rounded-lg border border-(--border) bg-(--accent) px-6 py-3 font-medium text-white opacity-50"
        >
          {t('home.bestiary')}
        </button>
      </nav>
    </main>
  )
}

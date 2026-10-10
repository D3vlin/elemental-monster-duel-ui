import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { resetServiceStatus } from '@hooks/useServiceStatus'
import BodyContainer from '@components/BodyContainer'

const AUTO_RETRY_INTERVAL_MS = 30000

export default function ServiceUnavailablePage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const handleRetry = useCallback(() => {
    resetServiceStatus()
    queryClient.resetQueries()
  }, [queryClient])

  useEffect(() => {
    const intervalId = setInterval(handleRetry, AUTO_RETRY_INTERVAL_MS)
    return () => clearInterval(intervalId)
  }, [handleRetry])

  return (
    <BodyContainer className="gap-4">
      <h1 className="text-2xl font-semibold text-(--text-h)">{t('serviceUnavailable.title')}</h1>
      <p className="max-w-md text-(--text)">{t('serviceUnavailable.message')}</p>
      <button
        type="button"
        onClick={handleRetry}
        className="rounded-lg border border-(--border) bg-(--accent) px-6 py-3 font-medium text-white"
      >
        {t('serviceUnavailable.retry')}
      </button>
    </BodyContainer>
  )
}

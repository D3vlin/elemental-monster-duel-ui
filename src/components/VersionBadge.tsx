import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useApiQuery } from '@hooks/useApiQuery'
import { useWhatsNewUnseen } from '@hooks/useWhatsNewUnseen'
import { WhatsNewService } from '@api/WhatsNewService'
import { getClickOrigin, type ModalOrigin } from './Modal/modalOrigin'

interface VersionBadgeProps {
  onOpenWhatsNew: (origin: ModalOrigin) => void
}

export default function VersionBadge({ onOpenWhatsNew }: VersionBadgeProps) {
  const { t, i18n } = useTranslation()
  const { data: entries } = useApiQuery(['whats-new', i18n.language], () => WhatsNewService.getEntries(i18n.language))
  const { hasUnseen, markSeen } = useWhatsNewUnseen(entries?.[0]?.id)

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    markSeen()
    onOpenWhatsNew(getClickOrigin(event))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t('whatsNew.title')}
      className={`fixed right-3 bottom-3 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition ${
        hasUnseen
          ? 'border-(--accent-border) bg-(--accent-bg) text-(--text-h)'
          : 'border-(--border) bg-(--bg) text-(--text) opacity-60'
      }`}
    >
      v{__APP_VERSION__}
      {hasUnseen && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--accent) opacity-75" />
          <span
            role="status"
            aria-label={t('whatsNew.unseenLabel')}
            className="relative inline-flex h-2.5 w-2.5 rounded-full bg-(--accent)"
          />
        </span>
      )}
    </button>
  )
}

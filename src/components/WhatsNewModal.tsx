import { useTranslation } from 'react-i18next'
import { useApiQuery } from '@hooks/useApiQuery'
import { WhatsNewService } from '@api/WhatsNewService'
import Modal from './Modal/Modal'
import type { ModalOrigin } from './Modal/modalOrigin'
import { groupEntriesByDate } from './whatsNewGrouping'

interface WhatsNewModalProps {
  origin?: ModalOrigin | null
  onClose: () => void
}

export default function WhatsNewModal({ origin = null, onClose }: WhatsNewModalProps) {
  const { t, i18n } = useTranslation()
  const {
    data: entries,
    isLoading,
    error,
  } = useApiQuery(['whats-new', i18n.language], () => WhatsNewService.getEntries(i18n.language))

  return (
    <Modal
      origin={origin}
      onClose={onClose}
      ariaLabel={t('whatsNew.title')}
      panelClassName="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border border-(--border) bg-(--bg) p-6 shadow-lg"
    >
      {(requestClose) => (
        <>
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold text-(--text-h)">{t('whatsNew.title')}</h2>
            <button
              type="button"
              onClick={requestClose}
              aria-label={t('whatsNew.close')}
              className="rounded-full border border-(--border) px-3 py-1 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {isLoading && <p className="text-sm text-(--text)">{t('whatsNew.loading')}</p>}
            {error && <p className="text-sm text-(--text)">{t('whatsNew.empty')}</p>}
            {!isLoading && !error && entries?.length === 0 && (
              <p className="text-sm text-(--text)">{t('whatsNew.empty')}</p>
            )}
            {groupEntriesByDate(entries ?? [], i18n.language).map((group) => (
              <section key={group.date} className="border-b border-(--border) pb-4 last:border-b-0 last:pb-0">
                <p className="text-xs text-(--text)">{group.date}</p>
                <div className="mt-1 flex flex-col gap-3">
                  {group.entries.map((entry) => (
                    <div key={entry.id}>
                      <h3 className="text-base font-medium text-(--text-h)">{entry.title}</h3>
                      <p className="mt-1 text-sm text-(--text)">{entry.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </Modal>
  )
}

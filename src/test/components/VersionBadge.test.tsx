import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import VersionBadge from '../../components/VersionBadge'
import type { WhatsNewEntry } from '@api/dto/WhatsNewEntryDto'
import type { Message } from '@api/Message'

const { getEntriesMock } = vi.hoisted(() => ({ getEntriesMock: vi.fn() }))
vi.mock('@api/WhatsNewService', () => ({ WhatsNewService: { getEntries: getEntriesMock } }))

function success(data: WhatsNewEntry[]): Message<WhatsNewEntry[]> {
  return { code: 200, status: 'success', data }
}

function renderBadge(onOpenWhatsNew = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return {
    onOpenWhatsNew,
    ...render(
      <QueryClientProvider client={queryClient}>
        <VersionBadge onOpenWhatsNew={onOpenWhatsNew} />
      </QueryClientProvider>,
    ),
  }
}

beforeEach(() => {
  getEntriesMock.mockReset()
  localStorage.clear()
})

describe('VersionBadge', () => {
  it('shows the app version', () => {
    getEntriesMock.mockResolvedValue(success([]))

    renderBadge()

    expect(screen.getByRole('button')).toHaveTextContent(/^v/)
  })

  it('shows the unseen indicator when the latest entry has not been seen', async () => {
    getEntriesMock.mockResolvedValue(success([{ id: 2, publishedAt: '2026-09-27', title: 't', body: 'b' }]))

    renderBadge()

    expect(await screen.findByRole('status')).toBeInTheDocument()
  })

  it('does not show the unseen indicator once the latest entry was already seen', async () => {
    localStorage.setItem('whatsNewLastSeenId', '2')
    getEntriesMock.mockResolvedValue(success([{ id: 2, publishedAt: '2026-09-27', title: 't', body: 'b' }]))

    renderBadge()

    await waitFor(() => expect(getEntriesMock).toHaveBeenCalled())
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('marks the latest entry as seen and opens the modal on click', async () => {
    getEntriesMock.mockResolvedValue(success([{ id: 2, publishedAt: '2026-09-27', title: 't', body: 'b' }]))
    const { onOpenWhatsNew } = renderBadge()

    await screen.findByRole('status')
    fireEvent.click(screen.getByRole('button'))

    expect(onOpenWhatsNew).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem('whatsNewLastSeenId')).toBe('2')
  })
})

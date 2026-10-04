import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WhatsNewModal from '../../components/WhatsNewModal'
import { groupEntriesByDate } from '@components/whatsNewGrouping'
import type { WhatsNewEntry } from '@api/dto/WhatsNewEntryDto'
import type { Message } from '@api/Message'

const { getEntriesMock } = vi.hoisted(() => ({ getEntriesMock: vi.fn() }))
vi.mock('@api/WhatsNewService', () => ({ WhatsNewService: { getEntries: getEntriesMock } }))

function success(data: WhatsNewEntry[]): Message<WhatsNewEntry[]> {
  return { code: 200, status: 'success', data }
}

function renderModal(onClose = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return {
    onClose,
    ...render(
      <QueryClientProvider client={queryClient}>
        <WhatsNewModal onClose={onClose} />
      </QueryClientProvider>,
    ),
  }
}

beforeEach(() => {
  getEntriesMock.mockReset()
})

describe('WhatsNewModal', () => {
  it('shows a loading state while entries are being fetched', () => {
    getEntriesMock.mockReturnValue(new Promise(() => {}))

    renderModal()

    expect(screen.getByText(/cargando novedades/i)).toBeInTheDocument()
  })

  it('shows an empty state when there are no entries', async () => {
    getEntriesMock.mockResolvedValue(success([]))

    renderModal()

    expect(await screen.findByText(/todavía no hay novedades publicadas/i)).toBeInTheDocument()
  })

  it('renders each entry title and body', async () => {
    getEntriesMock.mockResolvedValue(
      success([
        { id: 2, publishedAt: '2026-09-27T00:00:00Z', title: 'Modo claro/oscuro', body: 'Ahora podés cambiar.' },
        { id: 1, publishedAt: '2026-09-25T00:00:00Z', title: '¡Bienvenido!', body: 'Empieza la aventura.' },
      ]),
    )

    renderModal()

    await waitFor(() => expect(screen.getByText('Modo claro/oscuro')).toBeInTheDocument())
    expect(screen.getByText('Ahora podés cambiar.')).toBeInTheDocument()
    expect(screen.getByText('¡Bienvenido!')).toBeInTheDocument()
  })

  it('shows the date once per day when several entries share the same day', async () => {
    getEntriesMock.mockResolvedValue(
      success([
        { id: 3, publishedAt: '2026-09-27T11:00:00Z', title: 'Novedad C', body: 'Cuerpo C' },
        { id: 2, publishedAt: '2026-09-27T10:00:00Z', title: 'Novedad B', body: 'Cuerpo B' },
        { id: 1, publishedAt: '2026-09-20T10:00:00Z', title: 'Novedad A', body: 'Cuerpo A' },
      ]),
    )

    renderModal()

    await waitFor(() => expect(screen.getByText('Novedad C')).toBeInTheDocument())
    const sameDayLabel = new Date('2026-09-27T11:00:00Z').toLocaleDateString('es')
    expect(screen.getAllByText(sameDayLabel)).toHaveLength(1)
  })

  it('closes when Escape is pressed', async () => {
    getEntriesMock.mockReturnValue(new Promise(() => {}))
    const { onClose } = renderModal()

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })

  it('closes when clicking outside the dialog content', async () => {
    getEntriesMock.mockReturnValue(new Promise(() => {}))
    const { onClose } = renderModal()

    fireEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })

  it('does not close when clicking inside the dialog content', () => {
    getEntriesMock.mockReturnValue(new Promise(() => {}))
    const { onClose } = renderModal()

    fireEvent.click(screen.getByRole('dialog'))

    expect(onClose).not.toHaveBeenCalled()
  })
})

describe('groupEntriesByDate', () => {
  function entry(id: number, publishedAt: string): WhatsNewEntry {
    return { id, publishedAt, title: `Entry ${id}`, body: 'body' }
  }

  it('groups consecutive entries that fall on the same day', () => {
    const groups = groupEntriesByDate(
      [entry(3, '2026-09-27T11:00:00Z'), entry(2, '2026-09-27T10:00:00Z'), entry(1, '2026-09-20T10:00:00Z')],
      'es',
    )

    expect(groups).toHaveLength(2)
    expect(groups[0].entries.map((e) => e.id)).toEqual([3, 2])
    expect(groups[1].entries.map((e) => e.id)).toEqual([1])
  })

  it('does not group entries from different days, even if adjacent', () => {
    const groups = groupEntriesByDate([entry(2, '2026-09-27T10:00:00Z'), entry(1, '2026-09-26T10:00:00Z')], 'es')

    expect(groups).toHaveLength(2)
  })

  it('returns an empty list for an empty input', () => {
    expect(groupEntriesByDate([], 'es')).toEqual([])
  })
})

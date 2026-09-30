import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WhatsNewModal from '../../components/WhatsNewModal'
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

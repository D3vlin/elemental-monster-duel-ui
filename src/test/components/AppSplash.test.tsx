import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AppSplash from '@components/AppSplash'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('AppSplash', () => {
  it('shows the game logo right away', () => {
    render(<AppSplash />)

    expect(screen.getByTestId('app-splash')).toHaveTextContent('ElementalMonsterDuel')
  })

  it('starts fading out after the visible duration, then unmounts after the fade', () => {
    render(<AppSplash />)

    act(() => vi.advanceTimersByTime(1200))
    expect(screen.getByTestId('app-splash')).toHaveStyle({ opacity: '0' })

    act(() => vi.advanceTimersByTime(300))
    expect(screen.queryByTestId('app-splash')).not.toBeInTheDocument()
  })

  it('does not touch state after unmounting early', () => {
    const { unmount } = render(<AppSplash />)

    unmount()

    expect(() => act(() => vi.advanceTimersByTime(2000))).not.toThrow()
  })
})

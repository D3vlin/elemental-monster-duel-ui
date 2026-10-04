import { act, fireEvent, render, screen } from '@testing-library/react'
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

  it('is reachable by keyboard and exposes a label to skip it', () => {
    render(<AppSplash />)

    const splash = screen.getByTestId('app-splash')
    expect(splash).toHaveAttribute('role', 'button')
    expect(splash).toHaveAttribute('tabIndex', '0')
    expect(splash).toHaveAccessibleName()
  })

  it('unmounts immediately on click, without waiting for the fade', () => {
    render(<AppSplash />)

    fireEvent.click(screen.getByTestId('app-splash'))

    expect(screen.queryByTestId('app-splash')).not.toBeInTheDocument()
  })

  it('unmounts immediately on Enter', () => {
    render(<AppSplash />)

    fireEvent.keyDown(screen.getByTestId('app-splash'), { key: 'Enter' })

    expect(screen.queryByTestId('app-splash')).not.toBeInTheDocument()
  })

  it('unmounts immediately on Space', () => {
    render(<AppSplash />)

    fireEvent.keyDown(screen.getByTestId('app-splash'), { key: ' ' })

    expect(screen.queryByTestId('app-splash')).not.toBeInTheDocument()
  })

  it('ignores other keys', () => {
    render(<AppSplash />)

    fireEvent.keyDown(screen.getByTestId('app-splash'), { key: 'Tab' })

    expect(screen.getByTestId('app-splash')).toBeInTheDocument()
  })

  it('does not throw if the automatic fade fires right after the user already skipped it', () => {
    render(<AppSplash />)

    fireEvent.click(screen.getByTestId('app-splash'))

    expect(() => act(() => vi.advanceTimersByTime(2000))).not.toThrow()
  })
})

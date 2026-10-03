import { describe, expect, it } from 'vitest'
import { formatRemaining } from '@components/formatRemaining'

describe('formatRemaining', () => {
  it('shows days and hours when a day or more remains', () => {
    expect(formatRemaining(2 * 24 * 60 * 60_000 + 3 * 60 * 60_000)).toBe('2d 3h')
  })

  it('shows hours and minutes when less than a day remains', () => {
    expect(formatRemaining(3 * 60 * 60_000 + 15 * 60_000)).toBe('3h 15m')
  })

  it('shows only minutes when less than an hour remains', () => {
    expect(formatRemaining(15 * 60_000)).toBe('15m')
  })

  it('shows "< 1m" when less than a minute remains', () => {
    expect(formatRemaining(30_000)).toBe('< 1m')
  })

  it('shows "0m" once the deadline has passed', () => {
    expect(formatRemaining(0)).toBe('0m')
    expect(formatRemaining(-1_000)).toBe('0m')
  })
})

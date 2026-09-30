export const CONTEXT_PATH = '/elemental-monster-duel'

const EMD = {
  GET_CARDS: CONTEXT_PATH + '/cards',
  GET_WHATS_NEW: CONTEXT_PATH + '/whats-new',
} as const

export const API = {
  EMD,
} as const

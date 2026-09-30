import { useState } from 'react'

const STORAGE_KEY = 'whatsNewLastSeenId'

function readLastSeenId(): number | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? Number(raw) : null
}

export function useWhatsNewUnseen(latestEntryId: number | undefined) {
  const [lastSeenId, setLastSeenId] = useState<number | null>(readLastSeenId)

  const hasUnseen = latestEntryId !== undefined && latestEntryId !== lastSeenId

  function markSeen() {
    if (latestEntryId === undefined) return
    localStorage.setItem(STORAGE_KEY, String(latestEntryId))
    setLastSeenId(latestEntryId)
  }

  return { hasUnseen, markSeen }
}

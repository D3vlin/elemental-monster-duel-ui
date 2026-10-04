import type { WhatsNewEntry } from '@api/dto/WhatsNewEntryDto'

export interface EntryGroup {
  date: string
  entries: WhatsNewEntry[]
}

export function groupEntriesByDate(entries: WhatsNewEntry[], locale: string): EntryGroup[] {
  const groups: EntryGroup[] = []

  for (const entry of entries) {
    const date = new Date(entry.publishedAt).toLocaleDateString(locale)
    const lastGroup = groups[groups.length - 1]

    if (lastGroup?.date === date) {
      lastGroup.entries.push(entry)
    } else {
      groups.push({ date, entries: [entry] })
    }
  }

  return groups
}

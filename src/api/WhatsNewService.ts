import type { WhatsNewEntry } from './dto/WhatsNewEntryDto'
import { GetQuery } from './ApiService'
import { API } from './ApiConst'

const getEntries = (lang: string) => GetQuery<WhatsNewEntry[]>(API.EMD.GET_WHATS_NEW, {}, { lang })

export const WhatsNewService = {
  getEntries,
}

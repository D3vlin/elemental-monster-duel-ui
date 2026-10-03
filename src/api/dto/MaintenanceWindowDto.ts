export interface MaintenanceWindowTranslation {
  title: string
  message: string
  note: string | null
  locale: { code: string }
}

export interface MaintenanceWindow {
  id: number
  startsAt: string
  endsAt: string
  translations: MaintenanceWindowTranslation[]
}

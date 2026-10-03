import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
import HomePage from '@pages/Home/HomePage'
import ServiceUnavailablePage from '@pages/ServiceUnavailable/ServiceUnavailablePage'
import { useServiceStatus } from '@hooks/useServiceStatus'
import VersionBadge from './components/VersionBadge'
import ThemeToggle from './components/ThemeToggle'
import LanguageToggle from './components/LanguageToggle'
import WhatsNewModal from './components/WhatsNewModal'
import MaintenanceBanner from './components/MaintenanceBanner'
import AppSplash from './components/AppSplash'
import type { ModalOrigin } from './components/Modal/modalOrigin'

function App() {
  const isServiceUnavailable = useServiceStatus()
  const [whatsNewOrigin, setWhatsNewOrigin] = useState<ModalOrigin | null>(null)
  const location = useLocation()
  const [showSplash] = useState(() => location.pathname === ROUTES.HOME)

  if (isServiceUnavailable) {
    return <ServiceUnavailablePage />
  }

  return (
    <>
      {showSplash && <AppSplash />}
      <MaintenanceBanner />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
      </Routes>
      <LanguageToggle />
      <ThemeToggle />
      <VersionBadge onOpenWhatsNew={setWhatsNewOrigin} />
      {whatsNewOrigin && <WhatsNewModal origin={whatsNewOrigin} onClose={() => setWhatsNewOrigin(null)} />}
    </>
  )
}

export default App

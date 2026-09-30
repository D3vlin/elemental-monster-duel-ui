import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
import HomePage from '@pages/Home/HomePage'
import ServiceUnavailablePage from '@pages/ServiceUnavailable/ServiceUnavailablePage'
import { useServiceStatus } from '@hooks/useServiceStatus'
import VersionBadge from './components/VersionBadge'
import ThemeToggle from './components/ThemeToggle'
import LanguageToggle from './components/LanguageToggle'
import WhatsNewModal from './components/WhatsNewModal'
import type { ModalOrigin } from './components/Modal/modalOrigin'

function App() {
  const isServiceUnavailable = useServiceStatus()
  const [whatsNewOrigin, setWhatsNewOrigin] = useState<ModalOrigin | null>(null)

  if (isServiceUnavailable) {
    return <ServiceUnavailablePage />
  }

  return (
    <>
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

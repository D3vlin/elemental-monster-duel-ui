import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
import HomePage from '@pages/Home/HomePage'
import ServiceUnavailablePage from '@pages/ServiceUnavailable/ServiceUnavailablePage'
import { useServiceStatus } from '@hooks/useServiceStatus'
import VersionBadge from './components/VersionBadge'
import ThemeToggle from './components/ThemeToggle'
import LanguageToggle from './components/LanguageToggle'

function App() {
  const isServiceUnavailable = useServiceStatus()

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
      <VersionBadge />
    </>
  )
}

export default App

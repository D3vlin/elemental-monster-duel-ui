import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
import HomePage from '@pages/Home/HomePage'
import VersionBadge from './components/VersionBadge'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
      </Routes>
      <ThemeToggle />
      <VersionBadge />
    </>
  )
}

export default App

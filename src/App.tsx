import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
import HomePage from '@pages/Home/HomePage'
import VersionBadge from './components/VersionBadge'

function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
      </Routes>
      <VersionBadge />
    </>
  )
}

export default App

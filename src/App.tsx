import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '@constants/routes'
import HomePage from '@pages/Home/HomePage'

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
    </Routes>
  )
}

export default App

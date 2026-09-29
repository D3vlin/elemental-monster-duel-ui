import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiRequestError } from '@api/unwrapResponse'
import { reportServiceUnavailable } from '@hooks/useServiceStatus'
import '@i18n'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiRequestError && error.code === 503) {
        reportServiceUnavailable()
      }
    },
  }),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)

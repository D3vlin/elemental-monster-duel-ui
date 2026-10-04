import { QueryCache, QueryClient } from '@tanstack/react-query'
import { ApiRequestError, isServiceDownStatus } from '@api/unwrapResponse'
import { reportServiceUnavailable } from '@hooks/useServiceStatus'

function isServiceDownError(error: unknown): boolean {
  return error instanceof ApiRequestError && isServiceDownStatus(error.code)
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => isServiceDownError(error) && failureCount < 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (isServiceDownError(error)) {
        reportServiceUnavailable()
      }
    },
  }),
})

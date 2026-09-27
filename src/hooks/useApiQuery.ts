import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'
import type { Message } from '@api/Message'
import { unwrapResponse } from '@api/unwrapResponse'

export function useApiQuery<TData>(
  queryKey: QueryKey,
  service: () => Promise<Message<TData>>,
  options?: Omit<UseQueryOptions<TData | null, Error, TData>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<TData | null, Error>({
    queryKey,
    queryFn: () => unwrapResponse(service()),
    ...options,
  })
}

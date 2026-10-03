import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'

// Hermano de useApiQuery, para datos que se leen directo de Supabase en vez
// de pasar por la api en Render. Nombres distintos en cada call site
// (useApiQuery vs useSupabaseQuery) a propósito — se ve de un vistazo por
// qué canal sale cada dato, sin tener que abrir el service.
export function useSupabaseQuery<TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<TData, Error>({
    queryKey,
    queryFn,
    ...options,
  })
}

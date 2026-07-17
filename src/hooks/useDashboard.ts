import { useQuery } from '@tanstack/react-query'
import { fetchDashboardSummary } from '../api/dashboard'
import { queryKeys } from './queryKeys'

export function useDashboard(storeId?: string) {
  return useQuery({
    queryKey: queryKeys.dashboard(storeId),
    queryFn: () => fetchDashboardSummary(storeId),
  })
}

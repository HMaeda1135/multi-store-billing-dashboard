import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../api/users'
import { queryKeys } from './queryKeys'

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: fetchUsers,
  })
}

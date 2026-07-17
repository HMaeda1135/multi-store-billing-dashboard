import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchStores, fetchStoreById, createStore, updateStore } from '../api/stores'
import { queryKeys } from './queryKeys'
import type { Store, StoreFormData } from '../types'

export function useStores() {
  return useQuery({
    queryKey: queryKeys.stores,
    queryFn: fetchStores,
    staleTime: 0,
  })
}

export function useStore(id: string) {
  return useQuery({
    queryKey: queryKeys.store(id),
    queryFn: () => fetchStoreById(id),
    enabled: !!id,
  })
}

export function useCreateStore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createStore,
    onSuccess: (created) => {
      queryClient.setQueryData<Store[]>(queryKeys.stores, (old) =>
        old ? [...old, created] : [created],
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.stores })
    },
  })
}

export function useUpdateStore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StoreFormData }) => updateStore(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Store[]>(queryKeys.stores, (old) =>
        old?.map((s) => (s.id === updated.id ? updated : s)) ?? [updated],
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.stores })
    },
  })
}

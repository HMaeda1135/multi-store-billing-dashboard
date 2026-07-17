import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchVendors, fetchVendorById, createVendor, updateVendor } from '../api/vendors'
import { queryKeys } from './queryKeys'
import type { Vendor, VendorFormData } from '../types'

export function useVendors() {
  return useQuery({
    queryKey: queryKeys.vendors,
    queryFn: fetchVendors,
    staleTime: 0,
  })
}

export function useVendor(id: string) {
  return useQuery({
    queryKey: queryKeys.vendor(id),
    queryFn: () => fetchVendorById(id),
    enabled: !!id,
  })
}

export function useCreateVendor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createVendor,
    onSuccess: (created) => {
      queryClient.setQueryData<Vendor[]>(queryKeys.vendors, (old) =>
        old ? [...old, created] : [created],
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors })
    },
  })
}

export function useUpdateVendor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VendorFormData }) => updateVendor(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Vendor[]>(queryKeys.vendors, (old) =>
        old?.map((v) => (v.id === updated.id ? updated : v)) ?? [updated],
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors })
    },
  })
}

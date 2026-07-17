import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import {
  fetchTransactions,
  fetchTransactionById,
  createTransaction,
  updateTransaction,
} from '../api/transactions'
import { queryKeys } from './queryKeys'
import type { TransactionFilters, TransactionFormData } from '../types'

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: queryKeys.transactions(filters as Record<string, string | undefined>),
    queryFn: () => fetchTransactions(filters),
    placeholderData: keepPreviousData,
  })
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => fetchTransactionById(id),
    enabled: !!id,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data, createdBy }: { data: TransactionFormData; createdBy: string }) =>
      createTransaction(data, createdBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransactionFormData }) =>
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

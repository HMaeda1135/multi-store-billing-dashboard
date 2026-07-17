export const queryKeys = {
  users: ['users'] as const,
  stores: ['stores'] as const,
  store: (id: string) => ['stores', id] as const,
  vendors: ['vendors'] as const,
  vendor: (id: string) => ['vendors', id] as const,
  transactions: (filters?: Record<string, string | undefined>) =>
    ['transactions', filters] as const,
  transaction: (id: string) => ['transactions', id] as const,
  dashboard: (storeId?: string) => ['dashboard', storeId] as const,
}

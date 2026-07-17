import { db, simulateDelay, generateId, nowISO } from '../mock/storage'
import type { Transaction, TransactionFilters, TransactionFormData } from '../types'

function matchesFilters(txn: Transaction, filters: TransactionFilters): boolean {
  if (filters.storeId && txn.storeId !== filters.storeId) return false
  if (filters.month && !txn.transactionDate.startsWith(filters.month)) return false
  if (filters.transactionType && txn.transactionType !== filters.transactionType) return false
  if (filters.status && txn.status !== filters.status) return false
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase()
    const store = db.stores.find((s) => s.id === txn.storeId)
    const vendor = db.vendors.find((v) => v.id === txn.vendorId)
    const searchable = [
      store?.name,
      vendor?.name,
      txn.memo,
      txn.createdBy,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    if (!searchable.includes(kw)) return false
  }
  return true
}

export async function fetchTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
  let result = [...db.transactions]
  if (filters) {
    result = result.filter((txn) => matchesFilters(txn, filters))
  }
  result.sort((a, b) => b.transactionDate.localeCompare(a.transactionDate))
  return simulateDelay(result)
}

export async function fetchTransactionById(id: string): Promise<Transaction | undefined> {
  const txn = db.transactions.find((t) => t.id === id)
  return simulateDelay(txn)
}

export async function createTransaction(
  data: TransactionFormData,
  createdBy: string,
): Promise<Transaction> {
  const txn: Transaction = {
    id: generateId('txn'),
    ...data,
    createdBy,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }
  db.transactions.push(txn)
  return simulateDelay(txn)
}

export async function updateTransaction(
  id: string,
  data: TransactionFormData,
): Promise<Transaction> {
  const index = db.transactions.findIndex((t) => t.id === id)
  if (index === -1) throw new Error('取引が見つかりません')
  const updated: Transaction = {
    ...db.transactions[index],
    ...data,
    updatedAt: nowISO(),
  }
  db.transactions[index] = updated
  return simulateDelay(updated)
}

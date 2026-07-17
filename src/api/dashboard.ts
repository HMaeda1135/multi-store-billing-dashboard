import { db, simulateDelay } from '../mock/storage'
import { getCurrentMonth, getMonthFromDate } from '../lib/format'
import type { DashboardSummary, Transaction } from '../types'

function filterByMonth(transactions: Transaction[], month: string): Transaction[] {
  return transactions.filter((t) => getMonthFromDate(t.transactionDate) === month)
}

function getLastSixMonths(): string[] {
  const months: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return months
}

export async function fetchDashboardSummary(storeId?: string): Promise<DashboardSummary> {
  let transactions = [...db.transactions]
  if (storeId) {
    transactions = transactions.filter((t) => t.storeId === storeId)
  }

  const currentMonth = getCurrentMonth()
  const thisMonthTxns = filterByMonth(transactions, currentMonth)

  const purchaseTotal = thisMonthTxns
    .filter((t) => t.transactionType === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0)

  const invoiceTotal = thisMonthTxns
    .filter((t) => t.transactionType === 'invoice')
    .reduce((sum, t) => sum + t.amount, 0)

  const unconfirmedCount = thisMonthTxns.filter(
    (t) => t.status === 'draft' || t.status === 'submitted',
  ).length

  const activeStores = storeId
    ? db.stores.filter((s) => s.id === storeId)
    : db.stores.filter((s) => s.isActive)

  const storeBreakdown = activeStores.map((store) => {
    const storeTxns = filterByMonth(
      transactions.filter((t) => t.storeId === store.id),
      currentMonth,
    )
    return {
      storeId: store.id,
      storeName: store.name,
      purchaseTotal: storeTxns
        .filter((t) => t.transactionType === 'purchase')
        .reduce((sum, t) => sum + t.amount, 0),
      invoiceTotal: storeTxns
        .filter((t) => t.transactionType === 'invoice')
        .reduce((sum, t) => sum + t.amount, 0),
    }
  })

  const monthlyTrend = getLastSixMonths().map((month) => {
    const monthTxns = filterByMonth(transactions, month)
    return {
      month,
      purchaseTotal: monthTxns
        .filter((t) => t.transactionType === 'purchase')
        .reduce((sum, t) => sum + t.amount, 0),
      invoiceTotal: monthTxns
        .filter((t) => t.transactionType === 'invoice')
        .reduce((sum, t) => sum + t.amount, 0),
    }
  })

  const recentTransactions = [...transactions]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  return simulateDelay({
    purchaseTotal,
    invoiceTotal,
    unconfirmedCount,
    storeBreakdown,
    monthlyTrend,
    recentTransactions,
  })
}

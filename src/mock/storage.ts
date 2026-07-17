import type { Store, Vendor, Transaction } from '../types'
import { initialStores, initialVendors, initialTransactions } from './data'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

class MockDatabase {
  stores: Store[] = clone(initialStores)
  vendors: Vendor[] = clone(initialVendors)
  transactions: Transaction[] = clone(initialTransactions)

  reset() {
    this.stores = clone(initialStores)
    this.vendors = clone(initialVendors)
    this.transactions = clone(initialTransactions)
  }
}

export const db = new MockDatabase()

export async function simulateDelay<T>(data: T): Promise<T> {
  await delay()
  return data
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function nowISO(): string {
  return new Date().toISOString()
}

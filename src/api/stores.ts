import { db, simulateDelay, generateId, nowISO } from '../mock/storage'
import type { Store, StoreFormData } from '../types'

export async function fetchStores(): Promise<Store[]> {
  return simulateDelay([...db.stores])
}

export async function fetchStoreById(id: string): Promise<Store | undefined> {
  const store = db.stores.find((s) => s.id === id)
  return simulateDelay(store)
}

export async function createStore(data: StoreFormData): Promise<Store> {
  const store: Store = {
    id: generateId('store'),
    ...data,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }
  db.stores.push(store)
  return simulateDelay(store)
}

export async function updateStore(id: string, data: StoreFormData): Promise<Store> {
  const index = db.stores.findIndex((s) => s.id === id)
  if (index === -1) throw new Error('店舗が見つかりません')
  const updated: Store = {
    ...db.stores[index],
    ...data,
    updatedAt: nowISO(),
  }
  db.stores[index] = updated
  return simulateDelay(updated)
}

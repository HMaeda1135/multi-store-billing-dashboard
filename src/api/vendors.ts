import { db, simulateDelay, generateId, nowISO } from '../mock/storage'
import type { Vendor, VendorFormData } from '../types'

export async function fetchVendors(): Promise<Vendor[]> {
  return simulateDelay([...db.vendors])
}

export async function fetchVendorById(id: string): Promise<Vendor | undefined> {
  const vendor = db.vendors.find((v) => v.id === id)
  return simulateDelay(vendor)
}

export async function createVendor(data: VendorFormData): Promise<Vendor> {
  const vendor: Vendor = {
    id: generateId('vendor'),
    ...data,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }
  db.vendors.push(vendor)
  return simulateDelay(vendor)
}

export async function updateVendor(id: string, data: VendorFormData): Promise<Vendor> {
  const index = db.vendors.findIndex((v) => v.id === id)
  if (index === -1) throw new Error('取引先が見つかりません')
  const updated: Vendor = {
    ...db.vendors[index],
    ...data,
    updatedAt: nowISO(),
  }
  db.vendors[index] = updated
  return simulateDelay(updated)
}

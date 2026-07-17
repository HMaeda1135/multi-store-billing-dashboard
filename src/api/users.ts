import { mockUsers } from '../mock/data'
import { simulateDelay } from '../mock/storage'
import type { User } from '../types'

export async function fetchUsers(): Promise<User[]> {
  return simulateDelay([...mockUsers])
}

export async function fetchUserById(id: string): Promise<User | undefined> {
  const user = mockUsers.find((u) => u.id === id)
  return simulateDelay(user)
}

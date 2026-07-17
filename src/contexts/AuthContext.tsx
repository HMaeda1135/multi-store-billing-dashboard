import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../types'

const AUTH_STORAGE_KEY = 'billing-dashboard-user'

type AuthContextValue = {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isAdmin: boolean
  isStoreStaff: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser)

  const login = useCallback((selectedUser: User) => {
    setUser(selectedUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(selectedUser))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isStoreStaff: user?.role === 'store_staff',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'branch-manager' | 'head-office' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  branches?: string[] // For branch managers
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      setToken: (token) => set({ token }),
    }),
    {
      name: 'mikanaos-auth',
    }
  )
)

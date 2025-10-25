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
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'mikanaos-auth',
    }
  )
)

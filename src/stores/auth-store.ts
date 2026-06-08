// stores/auth-store.ts — 替代 app.globalData userInfo/isLoggedIn/isAdmin
import { create } from 'zustand'

export interface UserInfo {
  id: string
  email: string
  nickname: string
  isAdmin: boolean
  coins: number
}

interface AuthStore {
  user: UserInfo | null
  isLoggedIn: boolean
  isAdmin: boolean
  setUser: (user: UserInfo | null) => void
  logout: () => void
  getCoins: () => number
  setCoins: (coins: number) => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isAdmin: false,
  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user,
      isAdmin: user?.isAdmin ?? false,
    }),
  logout: () => set({ user: null, isLoggedIn: false, isAdmin: false }),
  getCoins: () => get().user?.coins ?? 1000,
  setCoins: (coins) => set((s) => ({ user: s.user ? { ...s.user, coins } : null })),
}))

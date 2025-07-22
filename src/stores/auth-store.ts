import { create } from 'zustand'
import { User, AuthState } from '@/types/auth'

interface AuthStore extends AuthState {
  signIn: (user: User) => void
  signOut: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: Partial<User>) => void
  initializeFromStorage: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  signIn: (user: User) => {
    set({ user, isAuthenticated: true, isLoading: false })
    
    // Stocker dans localStorage pour persistance
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('authToken', `token_${user.id}_${Date.now()}`)
      localStorage.setItem('currentUserId', user.id)
      localStorage.setItem('userEmail', user.email)
      localStorage.setItem('userName', `${user.firstName} ${user.lastName}`)
    }
  },

  signOut: () => {
    set({ user: null, isAuthenticated: false, isLoading: false })
    
    // Nettoyer localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUserId')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
    }
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user
    if (currentUser) {
      set({ user: { ...currentUser, ...userData } })
    }
  },

  // Fonction d'initialisation intégrée dans le store
  initializeFromStorage: () => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const userId = localStorage.getItem('currentUserId')
      const userEmail = localStorage.getItem('userEmail')
      const userName = localStorage.getItem('userName')

      if (isLoggedIn === 'true' && userId && userEmail && userName) {
        const [firstName, lastName] = userName.split(' ')
        
        // Utiliser set de manière sécurisée
        set({
          user: {
            id: userId,
            email: userEmail,
            firstName,
            lastName,
            role: 'Member',
            status: 'active'
          },
          isAuthenticated: true,
          isLoading: false
        })
      }
    }
  }
}))

// Initialisation automatique côté client
if (typeof window !== 'undefined') {
  // Initialiser une seule fois quand le module se charge
  const initOnce = () => {
    const store = useAuthStore.getState()
    if (!store.isAuthenticated) {
      store.initializeFromStorage()
    }
  }
  
  // Lancer l'initialisation après que le DOM soit prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOnce)
  } else {
    initOnce()
  }
}

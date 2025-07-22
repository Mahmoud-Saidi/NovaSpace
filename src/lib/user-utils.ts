// Utilitaire pour simuler différents utilisateurs
export const simulateUser = (userId: string, userName: string) => {
  localStorage.setItem('currentUserId', userId)
  localStorage.setItem('currentUserName', userName)
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('authToken', `token_${userId}`)
  
  // Recharger la page pour appliquer les changements
  window.location.reload()
}

// Obtenir l'utilisateur actuel
export const getCurrentUser = () => {
  return {
    id: localStorage.getItem('currentUserId') || '1',
    name: localStorage.getItem('currentUserName') || 'Utilisateur 1'
  }
}

// Simuler différents utilisateurs
export const DEMO_USERS = [
  { id: '1', name: 'Alice Martin' },
  { id: '2', name: 'Bob Dupont' },
  { id: '3', name: 'Claire Bernard' },
  { id: '4', name: 'David Moreau' },
  { id: '5', name: 'Emma Leroy' }
]

// Se déconnecter
export const logout = () => {
  localStorage.removeItem('currentUserId')
  localStorage.removeItem('currentUserName')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('authToken')
  window.location.href = '/sign-in'
}

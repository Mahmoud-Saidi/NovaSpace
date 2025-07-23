// Système de gestion des utilisateurs avec localStorage

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'Admin' | 'Manager' | 'Member'
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'Admin' | 'Manager' | 'Member'
  status: 'active' | 'inactive'
  avatar?: string
  department?: string
}

// Clé pour le localStorage
const USERS_STORAGE_KEY = 'collabspace_users'

// Fonction pour obtenir tous les utilisateurs depuis localStorage
export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  
  try {
    const usersData = localStorage.getItem(USERS_STORAGE_KEY)
    return usersData ? JSON.parse(usersData) : []
  } catch (error) {
    console.error('Erreur lors de la lecture des utilisateurs:', error)
    return []
  }
}

// Fonction pour sauvegarder les utilisateurs dans localStorage
function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des utilisateurs:', error)
  }
}

// Fonction pour générer un ID unique
function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Fonction pour créer un nouvel utilisateur
export async function createUser(userData: CreateUserData): Promise<User> {
  if (typeof window === 'undefined') {
    throw new Error('Cette fonction ne peut être utilisée que côté client')
  }

  const users = getUsers()
  
  // Vérifier si l'email existe déjà
  const existingUser = users.find(user => user.email === userData.email)
  if (existingUser) {
    throw new Error('Un utilisateur avec cet email existe déjà')
  }

  // Créer le nouvel utilisateur
  const newUser: User = {
    id: generateId(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password, // En production, il faut hasher le mot de passe
    role: userData.role,
    status: userData.status,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  // Ajouter l'utilisateur à la liste
  users.push(newUser)
  saveUsers(users)

  console.log('Utilisateur créé avec succès:', newUser)
  return newUser
}

// Alias pour addUser (rétrocompatibilité)
export const addUser = createUser

// Fonction pour obtenir un utilisateur par email
export function getUserByEmail(email: string): User | undefined {
  if (typeof window === 'undefined') return undefined
  
  const users = getUsers()
  return users.find(user => user.email === email)
}

// Fonction pour obtenir un utilisateur par ID
export function getUserById(id: string): User | undefined {
  if (typeof window === 'undefined') return undefined
  
  const users = getUsers()
  return users.find(user => user.id === id)
}

// Fonction pour mettre à jour un utilisateur
export function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
  if (typeof window === 'undefined') return null
  
  const users = getUsers()
  const userIndex = users.findIndex(user => user.id === id)
  
  if (userIndex === -1) {
    return null
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date()
  }

  saveUsers(users)
  return users[userIndex]
}

// Fonction pour supprimer un utilisateur
export function deleteUser(id: string): boolean {
  if (typeof window === 'undefined') return false
  
  const users = getUsers()
  const filteredUsers = users.filter(user => user.id !== id)
  
  if (filteredUsers.length === users.length) {
    return false // Utilisateur non trouvé
  }

  saveUsers(filteredUsers)
  return true
}

// Fonction pour initialiser des utilisateurs de test
export function initializeUsersDatabase(): void {
  if (typeof window === 'undefined') return
  
  const users = getUsers()
  
  // Si aucun utilisateur n'existe, créer des utilisateurs de test
  if (users.length === 0) {
    const testUsers: User[] = [
      {
        id: 'admin-001',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@collabspace.com',
        password: 'admin123',
        role: 'Admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user-001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'Member',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user-002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'Member',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    saveUsers(testUsers)
    console.log('Base d\'utilisateurs initialisée avec des utilisateurs de test')
  }
}

// Fonction pour vider la base d'utilisateurs (utile pour les tests)
export function clearUsersDatabase(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(USERS_STORAGE_KEY)
  console.log('Base d\'utilisateurs vidée')
}

// Export du type User pour utilisation dans d'autres fichiers
export type { User, CreateUserData }

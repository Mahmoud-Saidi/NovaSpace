// Utilitaires pour la gestion des données de test et reset

export interface TestUser {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar: string
  department: string
  role: 'Admin' | 'Manager' | 'Member'
  status: 'active' | 'inactive'
  createdAt: string
}

export interface TestTeam {
  id: number
  name: string
  description: string
  ownerId: string
  members: string[]
  avatar: string
  department: string
  role: string
  status: string
  visibility: string
  projects: number
  createdAt: string
}

export interface TestProject {
  id: number
  name: string
  description: string
  dueDate: string
  assignedTeam: string
  assignedTeamName: string
  ownerId: string
  status: string
  progress: number
  members: number
  createdAt: string
}

// Base d'utilisateurs de test
export const TEST_USERS: TestUser[] = [
  {
    id: 'user_001',
    firstName: 'Alice',
    lastName: 'Martin',
    email: 'alice.martin@company.com',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Martin&background=4f46e5&color=fff&size=128',
    department: 'Développement',
    role: 'Admin',
    status: 'active',
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'user_002',
    firstName: 'Bob',
    lastName: 'Dupont',
    email: 'bob.dupont@company.com',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Dupont&background=e11d48&color=fff&size=128',
    department: 'Design',
    role: 'Manager',
    status: 'active',
    createdAt: '2025-01-02T00:00:00.000Z'
  },
  {
    id: 'user_003',
    firstName: 'Claire',
    lastName: 'Bernard',
    email: 'claire.bernard@company.com',
    avatar: 'https://ui-avatars.com/api/?name=Claire+Bernard&background=10b981&color=fff&size=128',
    department: 'Marketing',
    role: 'Member',
    status: 'active',
    createdAt: '2025-01-03T00:00:00.000Z'
  },
  {
    id: 'user_004',
    firstName: 'David',
    lastName: 'Leroy',
    email: 'david.leroy@company.com',
    avatar: 'https://ui-avatars.com/api/?name=David+Leroy&background=f59e0b&color=fff&size=128',
    department: 'Développement',
    role: 'Member',
    status: 'active',
    createdAt: '2025-01-04T00:00:00.000Z'
  },
  {
    id: 'user_005',
    firstName: 'Emma',
    lastName: 'Rousseau',
    email: 'emma.rousseau@company.com',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Rousseau&background=8b5cf6&color=fff&size=128',
    department: 'Design',
    role: 'Member',
    status: 'active',
    createdAt: '2025-01-05T00:00:00.000Z'
  }
]

// Fonctions utilitaires
export const resetAllData = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear()
    console.log('🚫 RESET TOTAL - Toutes les données supprimées')
  }
}

export const initializeUsersDatabase = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('usersDatabase', JSON.stringify(TEST_USERS))
    console.log('👥 Base utilisateurs initialisée avec', TEST_USERS.length, 'utilisateurs')
  }
}

export const loginAsUser = (userId: string) => {
  if (typeof window !== 'undefined') {
    const user = TEST_USERS.find(u => u.id === userId)
    if (user) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('authToken', `token_${userId}_${Date.now()}`)
      localStorage.setItem('currentUserId', userId)
      localStorage.setItem('userEmail', user.email)
      localStorage.setItem('userName', `${user.firstName} ${user.lastName}`)
      console.log('🔐 Connexion simulée pour:', user.firstName, user.lastName)
      return user
    }
  }
  return null
}

export const createTestTeamForUser = (userId: string, teamName: string = 'Mon Équipe') => {
  if (typeof window !== 'undefined') {
    const user = TEST_USERS.find(u => u.id === userId)
    if (user) {
      const team: TestTeam = {
        id: Date.now(),
        name: teamName,
        description: `Équipe créée par ${user.firstName} ${user.lastName}`,
        ownerId: userId,
        members: [userId],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName)}&background=4f46e5&color=fff&size=128`,
        department: user.department,
        role: 'Admin',
        status: 'active',
        visibility: 'private',
        projects: 0,
        createdAt: new Date().toISOString()
      }
      
      const existingTeams = localStorage.getItem('userTeams')
      const teams = existingTeams ? JSON.parse(existingTeams) : []
      teams.push(team)
      localStorage.setItem('userTeams', JSON.stringify(teams))
      
      console.log('👥 Équipe créée:', teamName, 'pour', user.firstName)
      return team
    }
  }
  return null
}

export const createTestProjectForUser = (userId: string, teamId: number, projectName: string = 'Mon Projet') => {
  if (typeof window !== 'undefined') {
    const user = TEST_USERS.find(u => u.id === userId)
    const teams = JSON.parse(localStorage.getItem('userTeams') || '[]')
    const team = teams.find((t: TestTeam) => t.id === teamId)
    
    if (user && team) {
      const project: TestProject = {
        id: Date.now() + 1,
        name: projectName,
        description: `Projet créé par ${user.firstName} ${user.lastName}`,
        dueDate: '2025-12-31',
        assignedTeam: teamId.toString(),
        assignedTeamName: team.name,
        ownerId: userId,
        status: 'En cours',
        progress: Math.floor(Math.random() * 80) + 10, // Entre 10 et 90%
        members: 1,
        createdAt: new Date().toISOString()
      }
      
      const existingProjects = localStorage.getItem('userProjects')
      const projects = existingProjects ? JSON.parse(existingProjects) : []
      projects.push(project)
      localStorage.setItem('userProjects', JSON.stringify(projects))
      
      console.log('📋 Projet créé:', projectName, 'pour', user.firstName)
      return project
    }
  }
  return null
}

export const setupTestEnvironment = () => {
  console.log('🚀 Configuration de l\'environnement de test...')
  
  // Reset complet
  resetAllData()
  
  // Initialiser la base d'utilisateurs
  initializeUsersDatabase()
  
  // Connecter Alice
  const alice = loginAsUser('user_001')
  if (alice) {
    // Créer une équipe pour Alice
    const aliceTeam = createTestTeamForUser('user_001', 'Équipe Développement')
    if (aliceTeam) {
      // Créer un projet pour Alice
      createTestProjectForUser('user_001', aliceTeam.id, 'Site Web E-commerce')
    }
  }
  
  console.log('✅ Environnement de test prêt !')
  console.log('👤 Utilisateur connecté: Alice Martin (alice.martin@company.com)')
  console.log('📋 1 projet et 1 équipe créés')
  console.log('')
  console.log('🔄 Autres utilisateurs disponibles:')
  TEST_USERS.forEach(user => {
    if (user.id !== 'user_001') {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`)
    }
  })
  
  return {
    currentUser: alice,
    message: 'Environnement configuré avec succès'
  }
}

export const switchUser = (email: string) => {
  const user = TEST_USERS.find(u => u.email === email)
  if (user) {
    return loginAsUser(user.id)
  }
  console.error('❌ Utilisateur non trouvé:', email)
  return null
}

export const showDataSummary = () => {
  if (typeof window !== 'undefined') {
    const projects = JSON.parse(localStorage.getItem('userProjects') || '[]')
    const teams = JSON.parse(localStorage.getItem('userTeams') || '[]')
    const currentUserId = localStorage.getItem('currentUserId')
    const userName = localStorage.getItem('userName')
    
    console.log('📊 RÉSUMÉ DES DONNÉES:')
    console.log('👤 Utilisateur connecté:', userName || 'Aucun')
    console.log('📋 Projets totaux:', projects.length)
    console.log('👥 Équipes totales:', teams.length)
    
    if (currentUserId) {
      const userProjects = projects.filter((p: TestProject) => p.ownerId === currentUserId)
      const userTeams = teams.filter((t: TestTeam) => t.ownerId === currentUserId || t.members.includes(currentUserId))
      console.log('📋 Mes projets:', userProjects.length)
      console.log('👥 Mes équipes:', userTeams.length)
    }
    
    return {
      totalProjects: projects.length,
      totalTeams: teams.length,
      currentUser: userName,
      currentUserId
    }
  }
}

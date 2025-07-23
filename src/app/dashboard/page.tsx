'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

// Interfaces
interface Task {
  id: number
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignedMembers: string[]
  dueDate: string
  createdAt: string
  completedAt?: string
}

interface Team {
  id: number
  name: string
  department: string
  members: string[]
  ownerId: string
  assignedUsers?: string[]
}

interface Project {
  id: number
  name: string
  description: string
  status: string
  progress: number
  tasks?: Task[]
  assignedTeam: string
  ownerId: string
  assignedUsers: string[]
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string>('') // ID de l'utilisateur connecté
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState<Project[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([]) // Toutes les tâches extraites des projets
  
  // Fonction pour extraire toutes les tâches de tous les projets
  const extractAllTasks = (projects: Project[]): Task[] => {
    const tasks: Task[] = []
    projects.forEach(project => {
      if (project.tasks && Array.isArray(project.tasks)) {
        tasks.push(...project.tasks)
      }
    })
    return tasks
  }
  
  // Vérification de l'authentification
  useEffect(() => {
    const checkAuth = () => {
      // Ici vous pouvez vérifier le token/session
      // Pour l'instant, on simule une vérification simple
      const token = localStorage.getItem('authToken')
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const userId = localStorage.getItem('currentUserId') || '1' // Par défaut utilisateur 1
      
      if (!token && !isLoggedIn) {
        router.push('/sign-in')
        return
      }
      
      setCurrentUserId(userId)
      setIsAuthenticated(true)
      setIsLoading(false)
    }
    
    checkAuth()
  }, [router])

  // Charger les données des équipes
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      // Charger les équipes filtrées pour l'utilisateur
      const savedTeams = localStorage.getItem('userTeams')
      if (savedTeams) {
        const allTeams = JSON.parse(savedTeams) as Team[]
        const currentUser = localStorage.getItem('userName') || ''
        const userTeams = allTeams.filter((team: Team) => 
          team.ownerId === currentUserId || 
          (team.assignedUsers && team.assignedUsers.includes(currentUserId)) ||
          (team.members && Array.isArray(team.members) && team.members.includes(currentUser))
        )
        setTeams(userTeams)
      }
    }
  }, [isAuthenticated, currentUserId])

  // Charger les projets après que les équipes soient chargées
  useEffect(() => {
    if (isAuthenticated && currentUserId && teams.length >= 0) {
      const savedProjects = localStorage.getItem('userProjects')
      if (savedProjects) {
        const allProjects = JSON.parse(savedProjects) as Project[]
        const currentUser = localStorage.getItem('userName') || ''
        
        // Obtenir les IDs des équipes auxquelles l'utilisateur appartient
        const userTeamIds = teams.map((team: Team) => team.id.toString())
        
        // Filtrer les projets: ceux créés par l'utilisateur, où l'utilisateur est assigné, ou assignés à ses équipes
        const userProjects = allProjects.filter((project: Project) => 
          project.ownerId === currentUserId || 
          (project.assignedUsers && project.assignedUsers.includes(currentUserId)) ||
          (project.assignedTeam && userTeamIds.includes(project.assignedTeam))
        )
        setProjects(userProjects)
        
        // Extraire toutes les tâches des projets
        const tasks = extractAllTasks(userProjects)
        setAllTasks(tasks)
      }
    }
  }, [isAuthenticated, currentUserId, teams])

  // Écouter les changements dans localStorage pour synchronisation temps réel
  useEffect(() => {
    const handleStorageChange = () => {
      if (currentUserId) {
        // Charger les équipes d'abord
        const savedTeams = localStorage.getItem('userTeams')
        let currentTeams: Team[] = []
        if (savedTeams) {
          const allTeams = JSON.parse(savedTeams) as Team[]
          const currentUser = localStorage.getItem('userName') || ''
          currentTeams = allTeams.filter((team: Team) => 
            team.ownerId === currentUserId || 
            (team.assignedUsers && team.assignedUsers.includes(currentUserId)) ||
            (team.members && Array.isArray(team.members) && team.members.includes(currentUser))
          )
          setTeams(currentTeams)
        }
        
        // Charger les projets filtrés pour l'utilisateur (avec équipes)
        const savedProjects = localStorage.getItem('userProjects')
        if (savedProjects) {
          const allProjects = JSON.parse(savedProjects) as Project[]
          const userTeamIds = currentTeams.map((team: Team) => team.id.toString())
          
          const userProjects = allProjects.filter((project: Project) => 
            project.ownerId === currentUserId || 
            (project.assignedUsers && project.assignedUsers.includes(currentUserId)) ||
            (project.assignedTeam && userTeamIds.includes(project.assignedTeam))
          )
          setProjects(userProjects)
          
          // Extraire toutes les tâches des projets
          const tasks = extractAllTasks(userProjects)
          setAllTasks(tasks)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Aussi écouter les changements locaux (même onglet)
    const interval = setInterval(() => {
      handleStorageChange()
    }, 1000) // Vérifier toutes les secondes

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [currentUserId])

  // Affichage de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  // Si pas authentifié, on ne rend rien (redirection en cours)
  if (!isAuthenticated) {
    return null
  }

  // Calculer les statistiques dynamiques incluant les tâches
  const activeProjects = projects.filter(p => p.status === 'En cours').length
  const totalProjects = projects.length
  const completedProjects = projects.filter(p => p.status === 'Terminé').length
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
  const totalTeamMembers = teams.reduce((total, team) => total + (Array.isArray(team.members) ? team.members.length : 0), 0)
  const averageProgress = totalProjects > 0 ? Math.round(projects.reduce((total, p) => total + p.progress, 0) / totalProjects) : 0
  
  // Statistiques des tâches
  const totalTasks = allTasks.length
  const completedTasks = allTasks.filter(t => t.status === 'done').length
  const inProgressTasks = allTasks.filter(t => t.status === 'in-progress').length
  const todoTasks = allTasks.filter(t => t.status === 'todo').length
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  const stats = [
    { id: 1, name: 'Projets actifs', value: activeProjects.toString(), change: `+${activeProjects}`, changeType: activeProjects > 0 ? 'increase' : 'neutral' },
    { id: 2, name: 'Tâches terminées', value: completedTasks.toString(), change: `${taskCompletionRate}%`, changeType: taskCompletionRate > 50 ? 'increase' : 'neutral' },
    { id: 3, name: 'Collaborateurs', value: totalTeamMembers.toString(), change: `+${totalTeamMembers}`, changeType: totalTeamMembers > 0 ? 'increase' : 'neutral' },
    { id: 4, name: 'Équipes actives', value: teams.length.toString(), change: `+${teams.length}`, changeType: teams.length > 0 ? 'increase' : 'neutral' },
  ]
  
  const activities: Array<{
    id: number;
    user: string;
    action: string;
    project: string;
    time: string;
  }> = []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            {/* Dashboard Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                        <h1 className="text-4xl font-bold mb-8">
        Bienvenue sur SAIDIDSpace Dashboard
      </h1>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Bienvenue sur votre espace personnel SAIDIDSpace
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <Button variant="outline">Exporter</Button>
                  <Button>Nouveau projet</Button>
                </div>
              </div>
            </motion.div>
            
            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                      <div className="flex items-baseline text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className={`flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                        <span className="sr-only">{stat.changeType === 'increase' ? 'Augmentation' : 'Diminution'}</span>
                      </div>
                    </dd>
                  </div>
                </div>
              ))}
            </motion.div>
            
            {/* Tabs Navigation */}
            <motion.div variants={itemVariants} className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-8">
                {['overview', 'tasks'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab === 'overview' ? 'Vue d\'ensemble' : 'Tâches'}
                  </button>
                ))}
              </nav>
            </motion.div>
            
            {/* Main Content Area */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <motion.div 
                  variants={itemVariants} 
                  className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Projets récents</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                      Aperçu de vos derniers projets créés
                    </p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    {projects.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun projet</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Commencez par créer votre premier projet.
                        </p>
                        <div className="mt-4">
                          <a 
                            href="/projects" 
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Créer un projet
                          </a>
                        </div>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {projects.slice(0, 3).map((project) => (
                          <li key={project.id} className="py-4">
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                                    📋
                                  </span>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {project.name}
                                  </p>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    project.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {project.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {project.description}
                                </p>
                                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <span>Progrès: {project.progress}%</span>
                                  {project.assignedTeamName && project.assignedTeamName !== 'Aucune équipe' && (
                                    <span className="ml-4">👥 {project.assignedTeamName}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                    <a href="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      Voir tous les projets
                    </a>
                  </div>
                </motion.div>

                {/* Teams Section */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Équipes récentes</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    {teams.length > 0 ? (
                      teams.slice(0, 4).map((team) => (
                        <div key={team.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg mb-3 last:mb-0">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {team.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {team.name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {team.members.length} membres • {team.department}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Aucune équipe créée
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                    <a href="/teams" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      Voir toutes les équipes
                    </a>
                  </div>
                </motion.div>
              </div>
            )}
            
            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <motion.div 
                variants={itemVariants}
                className="space-y-6"
              >
                {/* Task Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-300">À faire</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{todoTasks}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                        <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-300">En cours</p>
                        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{inProgressTasks}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600 dark:text-green-300">Terminées</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">{completedTasks}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks by Priority */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Tasks by Project */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tâches par projet</h3>
                    </div>
                    <div className="p-6">
                      {projects.length === 0 ? (
                        <div className="text-center py-8">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun projet</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Créez des projets avec des tâches pour les voir ici.
                          </p>
                          <div className="mt-4">
                            <a 
                              href="/projects" 
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              Créer un projet
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {projects.slice(0, 3).map((project) => {
                            const projectTasks = project.tasks || []
                            return (
                              <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                {/* Project Header */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                      project.status === 'Terminé' ? 'bg-green-500' : 
                                      project.status === 'En cours' ? 'bg-blue-500' : 'bg-gray-400'
                                    }`}></div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {project.name}
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      ({projectTasks.length} tâche{projectTasks.length !== 1 ? 's' : ''})
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${project.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      {project.progress}%
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Project Tasks */}
                                {projectTasks.length === 0 ? (
                                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                                    Aucune tâche dans ce projet
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {projectTasks.slice(0, 3).map((task) => (
                                      <div key={task.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                        <div className={`w-2 h-2 rounded-full ${
                                          task.status === 'done' ? 'bg-green-500' : 
                                          task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                                        }`}></div>
                                        <div className="flex-1 min-w-0">
                                          <p className={`text-xs font-medium text-gray-900 dark:text-white ${
                                            task.status === 'done' ? 'line-through' : ''
                                          }`}>
                                            {task.title}
                                          </p>
                                          <div className="flex items-center space-x-2 mt-1">
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                                              task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                              'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                            }`}>
                                              {task.priority === 'high' ? '🔴' : 
                                               task.priority === 'medium' ? '🟡' : '🟢'}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                              {task.dueDate}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                              {task.assignedMembers.length} assigné{task.assignedMembers.length !== 1 ? 's' : ''}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    {projectTasks.length > 3 && (
                                      <div className="text-center pt-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          +{projectTasks.length - 3} tâche{projectTasks.length - 3 !== 1 ? 's' : ''} de plus
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                          {projects.length > 3 && (
                            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                +{projects.length - 3} projet{projects.length - 3 !== 1 ? 's' : ''} de plus
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                      <a href="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Gérer tous les projets
                      </a>
                    </div>
                  </div>

                  {/* Project Performance Overview */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vue d'ensemble des projets</h3>
                    </div>
                    <div className="p-6">
                      {totalTasks > 0 ? (
                        <div className="space-y-6">
                          {/* Global Progress */}
                          <div className="relative">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <span>Progression globale des tâches</span>
                              <span>{taskCompletionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${taskCompletionRate}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Project Summary */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Résumé par projet</h4>
                            {projects.slice(0, 4).map((project) => {
                              const projectTasks = project.tasks || []
                              const projectCompletedTasks = projectTasks.filter(t => t.status === 'done').length
                              const projectTaskCompletion = projectTasks.length > 0 ? Math.round((projectCompletedTasks / projectTasks.length) * 100) : 0
                              
                              return (
                                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <div className={`w-2 h-2 rounded-full ${
                                        project.status === 'Terminé' ? 'bg-green-500' : 
                                        project.status === 'En cours' ? 'bg-blue-500' : 'bg-gray-400'
                                      }`}></div>
                                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {project.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                      <span>{projectTasks.length} tâche{projectTasks.length !== 1 ? 's' : ''}</span>
                                      <span>{projectCompletedTasks} terminée{projectCompletedTasks !== 1 ? 's' : ''}</span>
                                      <span>{projectTaskCompletion}% complété</span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="w-12 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                      <div
                                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${projectTaskCompletion}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                          
                          {/* Task Statistics */}
                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">{todoTasks}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">À faire</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-600">{inProgressTasks}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">En cours</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Terminées</div>
                            </div>
                          </div>

                          {/* Priority Distribution */}
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Répartition par priorité</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                  Haute
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {allTasks.filter(t => t.priority === 'high').length}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                                  Moyenne
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {allTasks.filter(t => t.priority === 'medium').length}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  Basse
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {allTasks.filter(t => t.priority === 'low').length}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 00-2 2H9z" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Aucune donnée de projet disponible
                          </p>
                          <div className="mt-4">
                            <a 
                              href="/projects" 
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              Créer un projet
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

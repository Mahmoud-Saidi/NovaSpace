"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { TestTeam } from '@/lib/test-utils'

interface Project {
  id: number
  name: string
  description: string
  dueDate: string
  assignedTeam: string
  assignedTeamName: string
  status: string
  progress: number
  members: number
  createdAt: string
  ownerId: string  // Propriétaire du projet
  assignedUsers: string[] // IDs des utilisateurs assignés à ce projet
  tasks: Task[] // Nouvelles tâches du projet
}

interface Task {
  id: number
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignedMembers: string[] // Noms des membres assignés
  dueDate: string
  createdAt: string
  completedAt?: string
}

interface Team {
  id: string  // Changé de number à string pour correspondre aux équipes créées
  name: string
  description: string
  ownerId: string  // Propriétaire de l'équipe
  members: string[]  // Liste des IDs des membres
  assignedUsers: string[] // IDs des utilisateurs assignés à cette équipe
}

export default function ProjectsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [projects, setProjects] = useState<Project[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'calendar' | 'kanban'>('grid')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    dueDate: '',
    assignedTeam: ''
  })
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignedMembers: [] as string[],
    dueDate: ''
  })

  // Charger les projets et équipes de l'utilisateur connecté uniquement
  useEffect(() => {
    if (currentUserId) {
      // Charger les équipes depuis localStorage (filtrées pour l'utilisateur)
      const savedTeams = localStorage.getItem('userTeams')
      if (savedTeams) {
        try {
          const allTeams = JSON.parse(savedTeams)
          // Filtrer les équipes: celles créées par l'utilisateur, où l'utilisateur est assigné, ou où l'utilisateur est membre
          const currentUser = localStorage.getItem('userName') || ''
          const userTeams = allTeams.filter((team: TestTeam) => 
            team.ownerId === currentUserId || 
            (team.members && Array.isArray(team.members) && team.members.includes(currentUser))
          )
          console.log('Équipes trouvées pour l\'utilisateur:', userTeams)
          setTeams(userTeams)
        } catch (error) {
          console.error('Erreur lors du parsing des équipes:', error)
          setTeams([])
        }
      } else {
        console.log('Aucune équipe sauvegardée dans localStorage')
        setTeams([])
      }
    }
  }, [currentUserId])

  // Charger les projets après que les équipes soient chargées
  useEffect(() => {
    if (currentUserId && teams.length >= 0) { // >= 0 pour permettre les tableaux vides
      const savedProjects = localStorage.getItem('userProjects')
      if (savedProjects) {
        try {
          const allProjects: Project[] = JSON.parse(savedProjects)
          const currentUser = localStorage.getItem('userName') || ''
          
          // Obtenir les IDs des équipes auxquelles l'utilisateur appartient
          const userTeamIds = teams.map(team => team.id.toString())
          
          // Filtrer les projets: ceux créés par l'utilisateur, où l'utilisateur est assigné, ou assignés à ses équipes
          const userProjects = allProjects.filter(project => 
            project.ownerId === currentUserId || 
            (project.assignedUsers && project.assignedUsers.includes(currentUserId)) ||
            (project.assignedTeam && userTeamIds.includes(project.assignedTeam))
          )
          console.log('Projets trouvés pour l\'utilisateur:', userProjects)
          setProjects(userProjects)
        } catch (error) {
          console.error('Erreur lors du parsing des projets:', error)
          setProjects([])
        }
      } else {
        console.log('Aucun projet sauvegardé dans localStorage')
        setProjects([])
      }
    }
  }, [currentUserId, teams])

  // Sauvegarder les projets dans localStorage quand ils changent
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('userProjects', JSON.stringify(projects))
    }
  }, [projects]) // Supprimer la condition isAuthenticated
  
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

  // Calculer la progression basée sur les tâches
  const calculateProgress = (tasks: Task[]): number => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter(task => task.status === 'done').length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  // Mettre à jour la progression d'un projet
  const updateProjectProgress = (projectId: number) => {
    const savedProjects = localStorage.getItem('userProjects')
    if (savedProjects) {
      const allProjects: Project[] = JSON.parse(savedProjects)
      const updatedProjects = allProjects.map(project => {
        if (project.id === projectId) {
          const progress = calculateProgress(project.tasks || [])
          const status = progress === 100 ? 'Terminé' : progress > 0 ? 'En cours' : 'En attente'
          return { ...project, progress, status }
        }
        return project
      })
      localStorage.setItem('userProjects', JSON.stringify(updatedProjects))
      
      // Mettre à jour l'affichage local
      const currentUser = localStorage.getItem('userName') || ''
      const userTeamIds = teams.map(team => team.id.toString())
      const userProjects = updatedProjects.filter(project => 
        project.ownerId === currentUserId || 
        (project.assignedUsers && project.assignedUsers.includes(currentUserId)) ||
        (project.assignedTeam && userTeamIds.includes(project.assignedTeam))
      )
      setProjects(userProjects)
    }
  }

  // Gérer les tâches
  const handleCreateTask = (e: any) => {
    e.preventDefault()
    if (!selectedProject) return

    // Validation : vérifier qu'il y a des membres d'équipe disponibles
    const availableMembers = getTeamMembers()
    if (availableMembers.length === 0) {
      alert('⚠️ Aucun membre d\'équipe disponible. Veuillez d\'abord ajouter des membres à l\'équipe assignée à ce projet.')
      return
    }

    // Validation : vérifier qu'au moins un utilisateur est assigné
    if (!newTask.assignedMembers || newTask.assignedMembers.length === 0) {
      alert('⚠️ Vous devez assigner au moins un utilisateur à cette tâche.')
      return
    }

    // Validation des champs obligatoires
    if (!newTask.title.trim()) {
      alert('⚠️ Le titre de la tâche est obligatoire.')
      return
    }

    if (!newTask.dueDate) {
      alert('⚠️ La date d\'échéance est obligatoire.')
      return
    }

    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      assignedMembers: newTask.assignedMembers,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString()
    }

    const savedProjects = localStorage.getItem('userProjects')
    if (savedProjects) {
      const allProjects: Project[] = JSON.parse(savedProjects)
      const updatedProjects = allProjects.map(project => {
        if (project.id === selectedProject.id) {
          const updatedTasks = [...(project.tasks || []), task]
          const progress = calculateProgress(updatedTasks)
          const status = progress === 100 ? 'Terminé' : progress > 0 ? 'En cours' : 'En attente'
          return { ...project, tasks: updatedTasks, progress, status }
        }
        return project
      })
      localStorage.setItem('userProjects', JSON.stringify(updatedProjects))
      
      // Mettre à jour l'état local
      const updatedProject = updatedProjects.find(p => p.id === selectedProject.id)
      if (updatedProject) {
        setSelectedProject(updatedProject)
      }
      updateProjectProgress(selectedProject.id)
    }

    // Message de confirmation
    alert(`✅ Tâche "${task.title}" créée avec succès et assignée à : ${task.assignedMembers.join(', ')}`)

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignedMembers: [],
      dueDate: ''
    })
    setShowTaskForm(false)
  }

  const handleTaskStatusChange = (taskId: number, newStatus: 'todo' | 'in-progress' | 'done') => {
    if (!selectedProject) return

    const savedProjects = localStorage.getItem('userProjects')
    if (savedProjects) {
      const allProjects: Project[] = JSON.parse(savedProjects)
      const updatedProjects = allProjects.map(project => {
        if (project.id === selectedProject.id) {
          const updatedTasks = (project.tasks || []).map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                status: newStatus,
                completedAt: newStatus === 'done' ? new Date().toISOString() : undefined
              }
            }
            return task
          })
          const progress = calculateProgress(updatedTasks)
          const status = progress === 100 ? 'Terminé' : progress > 0 ? 'En cours' : 'En attente'
          return { ...project, tasks: updatedTasks, progress, status }
        }
        return project
      })
      localStorage.setItem('userProjects', JSON.stringify(updatedProjects))
      
      // Mettre à jour l'état local
      const updatedProject = updatedProjects.find(p => p.id === selectedProject.id)
      if (updatedProject) {
        setSelectedProject(updatedProject)
      }
      updateProjectProgress(selectedProject.id)
    }
  }

  const handleDeleteTask = (taskId: number) => {
    if (!selectedProject) return

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      const savedProjects = localStorage.getItem('userProjects')
      if (savedProjects) {
        const allProjects: Project[] = JSON.parse(savedProjects)
        const updatedProjects = allProjects.map(project => {
          if (project.id === selectedProject.id) {
            const updatedTasks = (project.tasks || []).filter(task => task.id !== taskId)
            const progress = calculateProgress(updatedTasks)
            const status = progress === 100 ? 'Terminé' : progress > 0 ? 'En cours' : 'En attente'
            return { ...project, tasks: updatedTasks, progress, status }
          }
          return project
        })
        localStorage.setItem('userProjects', JSON.stringify(updatedProjects))
        
        // Mettre à jour l'état local
        const updatedProject = updatedProjects.find(p => p.id === selectedProject.id)
        if (updatedProject) {
          setSelectedProject(updatedProject)
        }
        updateProjectProgress(selectedProject.id)
      }
    }
  }

  // Fonction pour supprimer les projets associés à une équipe supprimée
  const syncProjectsWithTeams = () => {
    const savedTeams = localStorage.getItem('userTeams')
    const currentTeams = savedTeams ? JSON.parse(savedTeams) : []
    const teamIds = currentTeams.map((team: TestTeam) => team.id.toString())
    
    // Supprimer les projets dont l'équipe assignée n'existe plus
    const updatedProjects = projects.filter(project => {
      // Garder les projets sans équipe assignée ou avec une équipe qui existe encore
      return !project.assignedTeam || teamIds.includes(project.assignedTeam)
    })
    
    // Mettre à jour si des changements ont été détectés
    const hasChanges = JSON.stringify(updatedProjects) !== JSON.stringify(projects)
    if (hasChanges) {
      setProjects(updatedProjects)
      localStorage.setItem('userProjects', JSON.stringify(updatedProjects))
    }
  }

  // Synchroniser les projets quand les équipes changent
  useEffect(() => {
    syncProjectsWithTeams()
  }, [teams, projects])

  // Affichage de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 lg:ml-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  // Si pas authentifié, on ne rend rien (redirection en cours)
  if (!isAuthenticated) {
    return null
  }

  const handleCreateProject = (e: any) => {
    e.preventDefault()
    
    // Validation : vérifier qu'une équipe est sélectionnée
    if (!newProject.assignedTeam) {
      alert('Veuillez sélectionner une équipe pour ce projet.')
      return
    }
    
    // Validation : vérifier qu'il y a au moins une équipe disponible
    if (teams.length === 0) {
      alert('Vous devez d\'abord créer une équipe avant de pouvoir créer un projet.')
      return
    }
    
    const project: Project = {
      id: Date.now(), // Utiliser timestamp pour un ID unique
      ...newProject,
      ownerId: currentUserId, // Associer le projet à l'utilisateur connecté
      assignedUsers: [currentUserId], // Assigner automatiquement le créateur
      status: 'En attente',
      progress: 0,
      members: 1,
      tasks: [], // Initialiser avec un tableau vide de tâches
      assignedTeamName: newProject.assignedTeam ? teams.find(t => t.id.toString() === newProject.assignedTeam)?.name || 'Aucune équipe' : 'Aucune équipe',
      createdAt: new Date().toISOString()
    }
    
    // Charger tous les projets existants
    const savedProjects = localStorage.getItem('userProjects')
    const allProjects: Project[] = savedProjects ? JSON.parse(savedProjects) : []
    
    // Ajouter le nouveau projet à tous les projets
    allProjects.push(project)
    localStorage.setItem('userProjects', JSON.stringify(allProjects))
    
    // Mettre à jour l'affichage avec les projets filtrés pour cet utilisateur (inclut les équipes)
    const currentUser = localStorage.getItem('userName') || ''
    const userTeamIds = teams.map(team => team.id.toString())
    
    const userProjects = allProjects.filter(project => 
      project.ownerId === currentUserId || 
      (project.assignedUsers && project.assignedUsers.includes(currentUserId)) ||
      (project.assignedTeam && userTeamIds.includes(project.assignedTeam))
    )
    setProjects(userProjects)
    
    setNewProject({ name: '', description: '', dueDate: '', assignedTeam: '' })
    setShowCreateForm(false)
    alert('Projet créé avec succès !')
  }

  const handleViewDetails = (projectId: number) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      // S'assurer que le projet a un tableau de tâches
      const projectWithTasks = {
        ...project,
        tasks: project.tasks || []
      }
      setSelectedProject(projectWithTasks)
      setShowProjectModal(true)
    }
  }

  const handleDeleteProject = (projectId: number) => {
    const project = projects.find(p => p.id === projectId)
    if (project && window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?`)) {
      const updatedProjects = projects.filter(p => p.id !== projectId)
      setProjects(updatedProjects)
      localStorage.setItem('userProjects', JSON.stringify(updatedProjects))
    }
  }

  // Fonctions utilitaires pour l'affichage
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'done': return 'Terminé'
      case 'in-progress': return 'En cours'
      case 'todo': return 'À faire'
      default: return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute'
      case 'medium': return 'Moyenne'
      case 'low': return 'Basse'
      default: return priority
    }
  }

  // Obtenir les membres de l'équipe assignée pour le projet sélectionné
  const getTeamMembers = (): string[] => {
    if (!selectedProject) return []
    const team = teams.find(t => t.id.toString() === selectedProject.assignedTeam)
    return team ? team.members || [] : []
  }

  return (
    <div className="min-h-screen bg-gray-100 lg:ml-64">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Link href="/">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      ← Retour à l'accueil
                    </button>
                  </Link>
                </div>
                <h1 className="text-3xl font-bold leading-tight text-gray-900">Projets</h1>
                <p className="text-gray-600 mt-1">Gérez vos projets et suivez leur progression</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Vue Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📊 Grille
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'kanban' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📋 Kanban
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'calendar' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📅 Calendrier
                  </button>
                </div>
                
                {teams.length === 0 && (
                  <span className="text-sm text-amber-600">
                    ⚠️ Créez d'abord une équipe (Équipes trouvées: {teams.length})
                  </span>
                )}
                {teams.length > 0 && (
                  <span className="text-sm text-green-600">
                    ✓ {teams.length} équipe(s) disponible(s)
                  </span>
                )}
                <button
                  onClick={() => teams.length > 0 ? setShowCreateForm(true) : alert('Vous devez d\'abord créer une équipe avant de pouvoir créer un projet.')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    teams.length > 0 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                  disabled={teams.length === 0}
                >
                  + Nouveau projet
                </button>
              </div>
            </div>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Create Project Form */}
            {showCreateForm && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Créer un nouveau projet</h3>
                  <form onSubmit={handleCreateProject}>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Nom du projet"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newProject.name}
                        onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <textarea
                        placeholder="Description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newProject.dueDate}
                        onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="team-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Équipe assignée *
                      </label>
                      <select
                        id="team-select"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newProject.assignedTeam}
                        onChange={(e) => setNewProject({...newProject, assignedTeam: e.target.value})}
                        required
                      >
                        <option value="">Sélectionner une équipe</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id.toString()}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                      {teams.length === 0 && (
                        <p className="text-sm text-amber-600 mt-1">
                          ⚠️ Vous devez d'abord créer une équipe pour pouvoir créer un projet.
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-md transition-colors ${
                          newProject.assignedTeam && teams.length > 0
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                        disabled={!newProject.assignedTeam || teams.length === 0}
                      >
                        Créer
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Projects Grid */}
            <div className="mt-8">
              {projects.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun projet pour le moment</h3>
                  <p className="mt-2 text-gray-600 max-w-sm mx-auto">
                    {teams.length === 0 
                      ? "Vous devez d'abord créer une équipe avant de pouvoir créer un projet."
                      : "Commencez par créer votre premier projet pour organiser votre travail et collaborer en équipe."
                    }
                  </p>
                  <div className="mt-6 flex gap-3 justify-center">
                    {teams.length === 0 ? (
                      <Link 
                        href="/teams"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Créer une équipe d'abord
                      </Link>
                    ) : (
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Créer mon premier projet
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{project.description}</p>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progression</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-between text-sm text-gray-500">
                          <span>{project.members} membre(s)</span>
                          <span>Échéance: {project.dueDate}</span>
                        </div>

                        {project.assignedTeamName && project.assignedTeamName !== 'Aucune équipe' && (
                          <div className="mt-2 flex items-center text-sm text-gray-600">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              👥 {project.assignedTeamName}
                            </span>
                          </div>
                        )}

                        <div className="mt-4 flex gap-2">
                          <button 
                            onClick={() => handleViewDetails(project.id)}
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-sm"
                          >
                            🎯 Gérer le projet
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 text-sm"
                            title="Supprimer le projet"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Link href="/dashboard" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <h4 className="font-medium text-gray-900">Retour au Dashboard</h4>
                    <p className="text-sm text-gray-600">Vue d'ensemble de tous vos projets</p>
                  </Link>
                  <Link href="/teams" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <h4 className="font-medium text-gray-900">Gérer les équipes</h4>
                    <p className="text-sm text-gray-600">Inviter et organiser vos collaborateurs</p>
                  </Link>
                  <Link href="/settings" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <h4 className="font-medium text-gray-900">Paramètres</h4>
                    <p className="text-sm text-gray-600">Configurer vos préférences</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Advanced Project Management Modal */}
        {showProjectModal && selectedProject && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-4 mx-auto p-0 w-[95%] max-w-6xl">
              <div className="bg-white rounded-lg shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                      <p className="text-indigo-100 mt-1">{selectedProject.description}</p>
                    </div>
                    <button
                      onClick={() => setShowProjectModal(false)}
                      className="text-white hover:text-gray-300 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-600">Progression</div>
                      <div className="text-2xl font-bold text-indigo-600">{selectedProject.progress}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${selectedProject.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-600">Tâches totales</div>
                      <div className="text-2xl font-bold text-gray-900">{selectedProject.tasks?.length || 0}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-600">Terminées</div>
                      <div className="text-2xl font-bold text-green-600">
                        {selectedProject.tasks?.filter(t => t.status === 'done').length || 0}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-600">Échéance</div>
                      <div className="text-lg font-semibold text-gray-900">{selectedProject.dueDate}</div>
                    </div>
                  </div>
                </div>

                {/* Task Management */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Gestion des tâches</h3>
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      + Nouvelle tâche
                    </button>
                  </div>

                  {/* Kanban Board */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* To Do Column */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                        📝 À faire
                        <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
                          {selectedProject.tasks?.filter(t => t.status === 'todo').length || 0}
                        </span>
                      </h4>
                      <div className="space-y-3">
                        {selectedProject.tasks?.filter(t => t.status === 'todo').map(task => (
                          <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-400">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900">{task.title}</h5>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                  title="Démarrer"
                                >
                                  ▶️
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                  title="Supprimer"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            <div className="flex justify-between items-center text-xs">
                              <span className={`px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                                {getPriorityLabel(task.priority)}
                              </span>
                              <span className="text-gray-500">📅 {task.dueDate}</span>
                            </div>
                            {task.assignedMembers.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {task.assignedMembers.map((member, idx) => (
                                  <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    👤 {member}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-700 mb-4 flex items-center">
                        🚀 En cours
                        <span className="ml-2 bg-blue-200 text-blue-600 px-2 py-1 rounded-full text-sm">
                          {selectedProject.tasks?.filter(t => t.status === 'in-progress').length || 0}
                        </span>
                      </h4>
                      <div className="space-y-3">
                        {selectedProject.tasks?.filter(t => t.status === 'in-progress').map(task => (
                          <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900">{task.title}</h5>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleTaskStatusChange(task.id, 'todo')}
                                  className="text-gray-600 hover:text-gray-800 text-sm"
                                  title="Remettre en attente"
                                >
                                  ⏸️
                                </button>
                                <button
                                  onClick={() => handleTaskStatusChange(task.id, 'done')}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                  title="Terminer"
                                >
                                  ✅
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                  title="Supprimer"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            <div className="flex justify-between items-center text-xs">
                              <span className={`px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                                {getPriorityLabel(task.priority)}
                              </span>
                              <span className="text-gray-500">📅 {task.dueDate}</span>
                            </div>
                            {task.assignedMembers.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {task.assignedMembers.map((member, idx) => (
                                  <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    👤 {member}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Done Column */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-700 mb-4 flex items-center">
                        ✅ Terminé
                        <span className="ml-2 bg-green-200 text-green-600 px-2 py-1 rounded-full text-sm">
                          {selectedProject.tasks?.filter(t => t.status === 'done').length || 0}
                        </span>
                      </h4>
                      <div className="space-y-3">
                        {selectedProject.tasks?.filter(t => t.status === 'done').map(task => (
                          <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-400 opacity-75">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900 line-through">{task.title}</h5>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                  title="Remettre en cours"
                                >
                                  🔄
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                  title="Supprimer"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            <div className="flex justify-between items-center text-xs">
                              <span className={`px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                                {getPriorityLabel(task.priority)}
                              </span>
                              <span className="text-gray-500">✅ {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Terminé'}</span>
                            </div>
                            {task.assignedMembers.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {task.assignedMembers.map((member, idx) => (
                                  <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    👤 {member}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Creation Form */}
        {showTaskForm && selectedProject && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Créer une nouvelle tâche</h3>
              <form onSubmit={handleCreateTask}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Titre de la tâche"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    placeholder="Description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  >
                    <option value="low">🟢 Basse</option>
                    <option value="medium">🟡 Moyenne</option>
                    <option value="high">🔴 Haute</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'échéance</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigner à <span className="text-red-500">*</span>
                  </label>
                  {getTeamMembers().length === 0 ? (
                    <div className="w-full px-3 py-2 border border-red-300 bg-red-50 rounded-md">
                      <p className="text-red-600 text-sm">
                        ⚠️ Aucun membre d'équipe disponible pour ce projet.
                      </p>
                      <p className="text-red-500 text-xs mt-1">
                        Veuillez d'abord ajouter des membres à l'équipe assignée à ce projet.
                      </p>
                    </div>
                  ) : (
                    <>
                      <select
                        multiple
                        className={`w-full px-3 py-2 border rounded-md ${
                          newTask.assignedMembers.length === 0 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        value={newTask.assignedMembers}
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value)
                          setNewTask({...newTask, assignedMembers: selectedOptions})
                        }}
                        required
                      >
                        {getTeamMembers().map((member, idx) => (
                          <option key={idx} value={member}>
                            {member}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Maintenez Ctrl/Cmd pour sélectionner plusieurs membres
                      </p>
                      {newTask.assignedMembers.length === 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          ⚠️ Vous devez assigner au moins un utilisateur à cette tâche
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={
                      getTeamMembers().length === 0 || 
                      newTask.assignedMembers.length === 0 || 
                      !newTask.title.trim() || 
                      !newTask.dueDate
                    }
                    className={`px-4 py-2 rounded-md transition-colors ${
                      getTeamMembers().length === 0 || 
                      newTask.assignedMembers.length === 0 || 
                      !newTask.title.trim() || 
                      !newTask.dueDate
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {getTeamMembers().length === 0 ? 'Aucun membre disponible' : 'Créer la tâche'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskForm(false)
                      setNewTask({
                        title: '',
                        description: '',
                        priority: 'medium',
                        assignedMembers: [],
                        dueDate: ''
                      })
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

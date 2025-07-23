"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Invitation, createInvitation, getInvitationsForUser, respondToInvitation, initializeUsersDatabase, getUsers } from '@/lib/users'
import UserSelector from '@/components/user-selector'

interface Team {
  id: number
  name: string
  description: string
  ownerId: string
  members: string[]
  assignedUsers: string[] // Nouveaux: IDs des utilisateurs assignés à cette équipe
  avatar: string
  department: string
  role: string
  status: string
  visibility: string
  projects: number
  createdAt: string
}

export default function TeamsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string>('') // ID de l'utilisateur connecté
  const [activeTab, setActiveTab] = useState('my-teams')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    visibility: 'private'
  })
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [teams, setTeams] = useState([])
  const [invitations] = useState([])
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false)
  const [selectedTeamDetails, setSelectedTeamDetails] = useState(null)
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [availableUsers, setAvailableUsers] = useState([])

  // Charger les équipes depuis localStorage au montage du composant
  useEffect(() => {
    if (currentUserId) {
      const savedTeams = localStorage.getItem('userTeams')
      if (savedTeams) {
        const allTeams = JSON.parse(savedTeams)
        // Filtrer les équipes: celles créées par l'utilisateur, où l'utilisateur est assigné, ou où l'utilisateur est membre
        const currentUser = localStorage.getItem('userName') || ''
        const userTeams = allTeams.filter(team => 
          team.ownerId === currentUserId || 
          (team.assignedUsers && team.assignedUsers.includes(currentUserId)) ||
          (team.members && Array.isArray(team.members) && team.members.includes(currentUser))
        )
        setTeams(userTeams)
      }
    }
    loadAvailableUsers()
  }, [currentUserId]) // Dépendre de currentUserId

  // Fonction pour charger les utilisateurs disponibles depuis le système
  const loadAvailableUsers = () => {
    try {
      // Charger les vrais utilisateurs enregistrés dans le système
      const allUsers = getUsers()
      
      // Convertir au format attendu et filtrer les utilisateurs actifs
      const users = allUsers
        .filter(user => user.status === 'active') // Ne montrer que les utilisateurs actifs
        .map(user => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }))
      
      console.log('Utilisateurs chargés:', users)
      setAvailableUsers(users)
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
      // Fallback en cas d'erreur - aucun utilisateur disponible
      setAvailableUsers([])
    }
  }

  // Sauvegarder les équipes dans localStorage quand elles changent
  useEffect(() => {
    // Ne pas sauvegarder automatiquement car on gère maintenant toutes les équipes
    // La sauvegarde est faite dans les fonctions spécifiques
  }, [teams])
  
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

  const handleCreateTeam = () => {
    if (newTeam.name.trim()) {
      const newTeamItem = {
        id: Date.now(),
        name: newTeam.name.trim(),
        description: newTeam.description.trim() || 'Aucune description',
        ownerId: currentUserId, // Utiliser l'ID de l'utilisateur connecté
        members: [],
        assignedUsers: [currentUserId], // Assigner automatiquement le créateur
        avatar: '',
        department: '',
        role: '',
        status: 'active',
        visibility: newTeam.visibility,
        projects: 0,
        createdAt: new Date().toISOString()
      }

      // Charger toutes les équipes existantes
      const savedTeams = localStorage.getItem('userTeams')
      const allTeams = savedTeams ? JSON.parse(savedTeams) : []
      
      // Ajouter la nouvelle équipe à toutes les équipes
      const updatedAllTeams = [...allTeams, newTeamItem]
      localStorage.setItem('userTeams', JSON.stringify(updatedAllTeams))
      
      // Mettre à jour l'affichage avec les équipes filtrées pour cet utilisateur
      const currentUser = localStorage.getItem('userName') || ''
      const userTeams = updatedAllTeams.filter(team => 
        team.ownerId === currentUserId || 
        (team.assignedUsers && team.assignedUsers.includes(currentUserId)) ||
        (team.members && Array.isArray(team.members) && team.members.includes(currentUser))
      )
      setTeams(userTeams)
      
      setNewTeam({ name: '', description: '', visibility: 'private' })
      setShowCreateModal(false)
      alert('Équipe créée avec succès !')
    }
  }

  const handleInviteMember = (e: any) => {
    e.preventDefault()
    console.log('Invitation:', { email: inviteEmail, role: inviteRole, teamId: selectedTeam })
    setShowInviteModal(false)
    setInviteEmail('')
    setSelectedTeam(null)
    alert('Invitation envoyée !')
  }

  const handleDeleteTeam = (teamId: number) => {
    const team = teams.find(t => t.id === teamId)
    
    // Compter les projets assignés à cette équipe
    const savedProjects = localStorage.getItem('userProjects')
    let assignedProjectsCount = 0
    if (savedProjects) {
      const projects = JSON.parse(savedProjects)
      assignedProjectsCount = projects.filter(project => 
        project.assignedTeam === teamId.toString()
      ).length
    }
    
    const confirmMessage = assignedProjectsCount > 0 
      ? `Êtes-vous sûr de vouloir supprimer l'équipe "${team.name}" ?\n\nCette action supprimera automatiquement ${assignedProjectsCount} projet(s) assigné(s) à cette équipe.`
      : `Êtes-vous sûr de vouloir supprimer l'équipe "${team.name}" ?`
    
    if (team && window.confirm(confirmMessage)) {
      // Charger toutes les équipes
      const savedTeams = localStorage.getItem('userTeams')
      const allTeams = savedTeams ? JSON.parse(savedTeams) : []
      
      // Supprimer l'équipe de toutes les équipes
      const updatedAllTeams = allTeams.filter(t => t.id !== teamId)
      localStorage.setItem('userTeams', JSON.stringify(updatedAllTeams))
      
      // Mettre à jour l'affichage avec les équipes filtrées pour cet utilisateur
      const currentUser = localStorage.getItem('userName') || ''
      const userTeams = updatedAllTeams.filter(team => 
        team.ownerId === currentUserId || 
        (team.assignedUsers && team.assignedUsers.includes(currentUserId)) ||
        (team.members && Array.isArray(team.members) && team.members.includes(currentUser))
      )
      setTeams(userTeams)
      
      // Synchroniser avec les projets - supprimer les projets assignés
      deleteProjectsWithDeletedTeam(teamId)
      
      const deletedMessage = assignedProjectsCount > 0 
        ? `Équipe supprimée avec succès. ${assignedProjectsCount} projet(s) associé(s) ont également été supprimés.`
        : 'Équipe supprimée avec succès.'
      alert(deletedMessage)
    }
  }

  // Fonction pour supprimer les projets quand une équipe est supprimée
  const deleteProjectsWithDeletedTeam = (deletedTeamId: number) => {
    const savedProjects = localStorage.getItem('userProjects')
    if (savedProjects) {
      const projects = JSON.parse(savedProjects)
      const updatedProjects = projects.filter(project => 
        project.assignedTeam !== deletedTeamId.toString()
      )
      localStorage.setItem('userProjects', JSON.stringify(updatedProjects))
    }
  }

  const handleInvitationResponse = (invitationId: number, response: 'accept' | 'decline') => {
    console.log(`Invitation ${invitationId} ${response}`)
    alert(`Invitation ${response === 'accept' ? 'acceptée' : 'refusée'} !`)
  }

  const handleAddMember = () => {
    if (selectedUser && selectedTeamDetails) {
      const memberName = `${selectedUser.firstName} ${selectedUser.lastName}`
      
      // Vérifier si le membre n'est pas déjà dans l'équipe
      if (!selectedTeamDetails.members.includes(memberName)) {
        const updatedTeamDetails = {
          ...selectedTeamDetails,
          members: [...selectedTeamDetails.members, memberName]
        }
        
        // Charger toutes les équipes
        const savedTeams = localStorage.getItem('userTeams')
        const allTeams = savedTeams ? JSON.parse(savedTeams) : []
        
        // Mettre à jour l'équipe dans toutes les équipes
        const updatedAllTeams = allTeams.map(team => 
          team.id === selectedTeamDetails.id 
            ? { ...team, members: updatedTeamDetails.members }
            : team
        )
        localStorage.setItem('userTeams', JSON.stringify(updatedAllTeams))
        
        // Mettre à jour l'affichage avec les équipes filtrées pour cet utilisateur
        const currentUser = localStorage.getItem('userName') || ''
        const userTeams = updatedAllTeams.filter(team => 
          team.ownerId === currentUserId || 
          (team.assignedUsers && team.assignedUsers.includes(currentUserId)) ||
          (team.members && Array.isArray(team.members) && team.members.includes(currentUser))
        )
        setTeams(userTeams)
        setSelectedTeamDetails(updatedTeamDetails)
        
        // Reset du formulaire
        setSelectedUser(null)
        setShowAddMemberForm(false)
        alert(`${memberName} a été ajouté à l'équipe !`)
      } else {
        alert('Ce membre fait déjà partie de l\'équipe.')
      }
    }
  }

  const handleRemoveMember = (memberName: string) => {
    if (selectedTeamDetails && window.confirm(`Êtes-vous sûr de vouloir retirer ${memberName} de l'équipe ?`)) {
      const updatedTeamDetails = {
        ...selectedTeamDetails,
        members: selectedTeamDetails.members.filter(member => member !== memberName)
      }
      
      // Charger toutes les équipes
      const savedTeams = localStorage.getItem('userTeams')
      const allTeams = savedTeams ? JSON.parse(savedTeams) : []
      
      // Mettre à jour l'équipe dans toutes les équipes
      const updatedAllTeams = allTeams.map(team => 
        team.id === selectedTeamDetails.id 
          ? { ...team, members: updatedTeamDetails.members }
          : team
      )
      localStorage.setItem('userTeams', JSON.stringify(updatedAllTeams))
      
      // Mettre à jour l'affichage avec les équipes filtrées pour cet utilisateur
      const currentUser = localStorage.getItem('userName') || ''
      const userTeams = updatedAllTeams.filter(team => 
        team.ownerId === currentUserId || 
        (team.assignedUsers && team.assignedUsers.includes(currentUserId)) ||
        (team.members && Array.isArray(team.members) && team.members.includes(currentUser))
      )
      setTeams(userTeams)
      setSelectedTeamDetails(updatedTeamDetails)
      alert(`${memberName} a été retiré de l'équipe.`)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800'
      case 'Lead': return 'bg-purple-100 text-purple-800'
      case 'Member': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-100 lg:ml-64">
      <div className="py-10">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Link href="/">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    ← Retour à l'accueil
                  </button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Équipes</h1>
              <p className="text-gray-600 mt-1">Gérez vos équipes et collaborations</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              + Créer une équipe
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('my-teams')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-teams'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mes équipes ({teams.length})
              </button>
              <button
                onClick={() => setActiveTab('discover')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'discover'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Découvrir
              </button>
            </nav>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'my-teams' && (
            <div>
              {teams.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune équipe pour le moment</h3>
                  <p className="mt-2 text-gray-600 max-w-sm mx-auto">
                    Commencez par créer votre première équipe pour collaborer avec d'autres membres.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Créer ma première équipe
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map((team) => (
                    <div key={team.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <span className="text-indigo-600 font-bold text-lg">{team.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(team.role)}`}>
                              {team.role}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                              {team.status === 'active' ? 'Actif' : 'Inactif'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{team.description}</p>

                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <span>{Array.isArray(team.members) ? team.members.length : 0} membres</span>
                        <span>{team.projects} projets</span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const teamDetails = {
                              ...team,
                              members: Array.isArray(team.members) ? team.members : []
                            }
                            setSelectedTeamDetails(teamDetails)
                            setShowTeamDetailsModal(true)
                          }}
                          className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Voir l'équipe
                        </button>
                        <button
                          onClick={() => {
                            const teamDetails = {
                              ...team,
                              members: Array.isArray(team.members) ? team.members : []
                            }
                            setSelectedTeamDetails(teamDetails)
                            setShowAddMemberForm(true)
                            setShowTeamDetailsModal(true)
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                          title="Ajouter un membre"
                        >
                          + Membre
                        </button>
                        {(team.role === 'Admin' || team.role === 'Lead') && (
                          <button
                            onClick={() => {
                              setSelectedTeam(team.id)
                              setShowInviteModal(true)
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            title="Inviter un membre"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                          </button>
                        )}
                        {team.role === 'Admin' && (
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            title="Supprimer l'équipe"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'discover' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Découvrir des équipes</h2>
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Rechercher des équipes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Trouvez et rejoignez des équipes publiques qui correspondent à vos intérêts.
                </p>
                <div className="mt-6">
                  <input
                    type="text"
                    placeholder="Rechercher par nom d'équipe, compétences..."
                    className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                    Rechercher
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Team Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total équipes</p>
                  <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total membres</p>
                  <p className="text-2xl font-bold text-gray-900">{teams.reduce((sum, team) => sum + (Array.isArray(team.members) ? team.members.length : 0), 0)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Projets actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{teams.reduce((sum, team) => sum + (team.projects || 0), 0)}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Créer une nouvelle équipe</h2>
            <form onSubmit={handleCreateTeam}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'équipe</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibilité</label>
                <select
                  value={newTeam.visibility}
                  onChange={(e) => setNewTeam({ ...newTeam, visibility: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="private">Privée</option>
                  <option value="public">Publique</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Créer l'équipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inviter un membre</h2>
            <form onSubmit={handleInviteMember}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="member">Membre</option>
                  <option value="lead">Lead</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Envoyer l'invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Details Modal */}
      {showTeamDetailsModal && selectedTeamDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Détails de l'équipe</h2>
              <button
                onClick={() => {
                  setShowTeamDetailsModal(false)
                  setShowAddMemberForm(false)
                  setSelectedUser(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Team Header */}
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <span className="text-indigo-600 font-bold text-xl">{selectedTeamDetails.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{selectedTeamDetails.name}</h3>
                <p className="text-gray-600">{selectedTeamDetails.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {selectedTeamDetails.visibility === 'private' ? 'Privée' : 'Publique'}
                  </span>
                </div>
              </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-gray-900">{Array.isArray(selectedTeamDetails.members) ? selectedTeamDetails.members.length : 0}</p>
                <p className="text-sm text-gray-600">Membres</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedTeamDetails.projects || 0}</p>
                <p className="text-sm text-gray-600">Projets</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-gray-900">{new Date(selectedTeamDetails.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Créée le</p>
              </div>
            </div>

            {/* Members Section */}
            <div className="mb-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Membres de l'équipe</h4>
              </div>

              {/* Add Member Form */}
              {showAddMemberForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3">Ajouter un nouveau membre</h5>
                  <div className="space-y-3">
                    <select
                      value={selectedUser ? selectedUser.id : ''}
                      onChange={(e) => {
                        const user = availableUsers.find(u => u.id === e.target.value)
                        setSelectedUser(user || null)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    >
                      <option value="">Sélectionner un utilisateur...</option>
                      {availableUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} - {user.email}
                        </option>
                      ))}
                    </select>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddMember}
                        disabled={!selectedUser}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Ajouter membre
                      </button>
                      <button
                        onClick={() => {
                          setShowAddMemberForm(false)
                          setSelectedUser(null)
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {Array.isArray(selectedTeamDetails.members) && selectedTeamDetails.members.length > 0 ? (
                <div className="space-y-2">
                  {selectedTeamDetails.members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <span className="text-indigo-600 font-semibold text-sm">{member.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-gray-900">{member}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveMember(member)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Retirer
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="mt-2">Aucun membre pour le moment</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowTeamDetailsModal(false)
                  setShowAddMemberForm(false)
                  setSelectedUser(null)
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

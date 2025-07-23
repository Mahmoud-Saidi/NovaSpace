// Stats component
import React, { useState, useEffect } from 'react'

interface StatsProps {
  isAuthenticated?: boolean
}

export function Stats({ isAuthenticated = false }: StatsProps) {
  const [realStats, setRealStats] = useState({
    activeUsers: 0,
    activeProjects: 0,
    totalTasks: 0,
    totalTeams: 0
  })

  useEffect(() => {
    if (isAuthenticated) {
      // Calculer les vraies statistiques depuis localStorage
      const calculateRealStats = () => {
        // Compter les utilisateurs uniques depuis les équipes
        const savedTeams = localStorage.getItem('userTeams')
        const savedProjects = localStorage.getItem('userProjects')
        
        let activeUsers = new Set()
        let activeProjects = 0
        let totalTasks = 0
        let totalTeams = 0
        
        if (savedTeams) {
          const teams = JSON.parse(savedTeams)
          totalTeams = teams.length
          teams.forEach((team: { members?: string[] }) => {
            if (team.members && Array.isArray(team.members)) {
              team.members.forEach(member => activeUsers.add(member))
            }
          })
        }
        
        if (savedProjects) {
          const projects = JSON.parse(savedProjects)
          activeProjects = projects.filter((p: { status?: string }) => p.status === 'En cours').length
          projects.forEach((project: { tasks?: any[] }) => {
            if (project.tasks && Array.isArray(project.tasks)) {
              totalTasks += project.tasks.length
            }
          })
        }
        
        setRealStats({
          activeUsers: activeUsers.size,
          activeProjects,
          totalTasks,
          totalTeams
        })
      }
      
      calculateRealStats()
      
      // Mettre à jour en temps réel
      const interval = setInterval(calculateRealStats, 2000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  if (isAuthenticated) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Vos statistiques en temps réel</h2>
          <p className="text-gray-600 dark:text-gray-400">Suivez l'activité de votre espace de travail</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{realStats.activeUsers}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Collaborateurs actifs</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{realStats.activeProjects}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Projets en cours</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{realStats.totalTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tâches créées</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{realStats.totalTeams}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Équipes actives</div>
          </div>
        </div>
      </section>
    )
  }

  // Statistiques pour les utilisateurs non connectés (valeurs réalistes mais fixes)
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Statistiques de la plateforme</h2>
        <p className="text-gray-600 dark:text-gray-400">Des milliers d'utilisateurs nous font confiance</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2,847</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Utilisateurs actifs</div>
        </div>
        <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">156</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Projets en cours</div>
        </div>
        <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">4,923</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tâches terminées</div>
        </div>
        <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">89</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Équipes collaboratives</div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  resetAllData, 
  initializeUsersDatabase, 
  setupTestEnvironment, 
  switchUser, 
  showDataSummary,
  TEST_USERS 
} from '@/lib/test-utils'

export default function TestPage() {
  const [output, setOutput] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const logToOutput = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const colors = {
      info: '#333',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b'
    }
    setOutput(prev => prev + `<p style="color: ${colors[type]}; margin: 5px 0;">${message}</p>`)
  }

  const handleResetAll = () => {
    if (confirm('⚠️ Supprimer toutes les données ?')) {
      resetAllData()
      setOutput('')
      logToOutput('🚫 RESET TOTAL - Toutes les données supprimées', 'error')
    }
  }

  const handleInitUsers = () => {
    initializeUsersDatabase()
    logToOutput('👥 Base utilisateurs initialisée avec ' + TEST_USERS.length + ' utilisateurs', 'success')
  }

  const handleSetupTest = () => {
    const result = setupTestEnvironment()
    setOutput('')
    logToOutput('🚀 Environnement de test configuré', 'success')
    logToOutput('👤 Connecté en tant que: Alice Martin', 'info')
    logToOutput('📋 1 projet et 1 équipe créés automatiquement', 'info')
    logToOutput('', 'info')
    logToOutput('🔄 Autres utilisateurs disponibles:', 'info')
    TEST_USERS.forEach(user => {
      if (user.id !== 'user_001') {
        logToOutput(`   • ${user.firstName} ${user.lastName} (${user.email})`, 'info')
      }
    })
  }

  const handleSwitchUser = (email: string) => {
    const user = switchUser(email)
    if (user) {
      logToOutput(`🔐 Connexion réussie: ${user.firstName} ${user.lastName}`, 'success')
      logToOutput('Rechargez les pages /projects et /teams pour voir vos données', 'info')
    } else {
      logToOutput('❌ Échec de la connexion', 'error')
    }
  }

  const handleShowData = () => {
    const summary = showDataSummary()
    if (summary) {
      setOutput('')
      logToOutput('📊 RÉSUMÉ DES DONNÉES:', 'info')
      logToOutput(`👤 Utilisateur connecté: ${summary.currentUser || 'Aucun'}`, 'info')
      logToOutput(`📋 Projets totaux: ${summary.totalProjects}`, 'info')
      logToOutput(`👥 Équipes totales: ${summary.totalTeams}`, 'info')
    }
  }

  if (!isClient) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 lg:ml-64">
      <div className="py-10">
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                ← Retour à l'accueil
              </button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🧪 Page de Test</h1>
          <p className="text-gray-600 mb-8">
            Utilitaires pour tester le système d'utilisateurs, projets et équipes
          </p>
        </header>

        <main className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* Actions de base */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Actions de base</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={handleResetAll}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                🚫 Reset Total
              </button>
              <button
                onClick={handleInitUsers}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                👥 Init Utilisateurs
              </button>
              <button
                onClick={handleSetupTest}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                🚀 Setup Test Complet
              </button>
              <button
                onClick={handleShowData}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                📊 Afficher Données
              </button>
            </div>
          </div>

          {/* Changement d'utilisateur */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Changer d'utilisateur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEST_USERS.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleSwitchUser(user.email)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-left"
                >
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-sm opacity-80">{user.department} • {user.role}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Navigation rapide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/projects"
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="font-medium">📋 Projets</div>
                <div className="text-sm text-gray-600">Voir mes projets</div>
              </a>
              <a
                href="/teams"
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="font-medium">👥 Équipes</div>
                <div className="text-sm text-gray-600">Gérer mes équipes</div>
              </a>
              <a
                href="/dashboard"
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="font-medium">📊 Dashboard</div>
                <div className="text-sm text-gray-600">Vue d'ensemble</div>
              </a>
            </div>
          </div>

          {/* Sortie */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Journal</h2>
            <div 
              className="bg-gray-50 p-4 rounded border min-h-32 max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: output || '<p style="color: #666;">Aucun message</p>' }}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

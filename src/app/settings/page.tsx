"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [userSettings, setUserSettings] = useState({
    name: '',
    email: '',
    language: 'fr',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      desktop: false
    }
  })

  const [activeTab, setActiveTab] = useState('profile')
  const [saveMessage, setSaveMessage] = useState('')
  
  // Vérification de l'authentification
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const userEmail = localStorage.getItem('userEmail')
      const userName = localStorage.getItem('userName')
      
      if (!token && !isLoggedIn) {
        router.push('/sign-in')
        return
      }
      
      // Pré-remplir les informations utilisateur depuis localStorage
      setUserSettings(prev => ({
        ...prev,
        email: userEmail || 'user@example.com',
        name: userName || 'Utilisateur'
      }))
      
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

  const handleSave = (section: string) => {
    // Sauvegarder les modifications dans localStorage
    if (section === 'profile') {
      localStorage.setItem('userName', userSettings.name)
      localStorage.setItem('userEmail', userSettings.email)
    }
    
    setSaveMessage(`Paramètres ${section} sauvegardés !`)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const tabs = [
    { id: 'profile', name: 'Profil', icon: '👤' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Sécurité', icon: '🛡️' }
  ]

  return (
    <div className="min-h-screen bg-gray-100 lg:ml-64">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  ← Retour à l'accueil
                </button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Paramètres</h1>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {saveMessage && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {saveMessage}
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="flex">
                {/* Sidebar Navigation */}
                <div className="w-64 bg-gray-50 border-r border-gray-200">
                  <nav className="mt-5 px-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full mb-1 ${
                          activeTab === tab.id
                            ? 'bg-indigo-100 text-indigo-900'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <span className="mr-3">{tab.icon}</span>
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du profil</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                          <input
                            type="text"
                            value={userSettings.name}
                            onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            value={userSettings.email}
                            onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Langue</label>
                          <select
                            value={userSettings.language}
                            onChange={(e) => setUserSettings({...userSettings, language: e.target.value})}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Thème</label>
                          <select
                            value={userSettings.theme}
                            onChange={(e) => setUserSettings({...userSettings, theme: e.target.value})}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="light">Clair</option>
                            <option value="dark">Sombre</option>
                            <option value="auto">Automatique</option>
                          </select>
                        </div>
                        <button
                          onClick={() => handleSave('profil')}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Préférences de notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Notifications par email</h4>
                            <p className="text-sm text-gray-500">Recevoir des emails pour les mises à jour</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={userSettings.notifications.email}
                            onChange={(e) => setUserSettings({
                              ...userSettings,
                              notifications: {...userSettings.notifications, email: e.target.checked}
                            })}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Notifications push</h4>
                            <p className="text-sm text-gray-500">Recevoir des notifications push</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={userSettings.notifications.push}
                            onChange={(e) => setUserSettings({
                              ...userSettings,
                              notifications: {...userSettings.notifications, push: e.target.checked}
                            })}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Notifications desktop</h4>
                            <p className="text-sm text-gray-500">Afficher des notifications sur votre bureau</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={userSettings.notifications.desktop}
                            onChange={(e) => setUserSettings({
                              ...userSettings,
                              notifications: {...userSettings.notifications, desktop: e.target.checked}
                            })}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <button
                          onClick={() => handleSave('notifications')}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres de sécurité</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Changer le mot de passe</h4>
                          <div className="space-y-3">
                            <input
                              type="password"
                              placeholder="Mot de passe actuel"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <input
                              type="password"
                              placeholder="Nouveau mot de passe"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <input
                              type="password"
                              placeholder="Confirmer le nouveau mot de passe"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Authentification à deux facteurs</h4>
                          <p className="text-sm text-gray-500 mb-2">Sécurisez votre compte avec l'authentification à deux facteurs</p>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                            Activer 2FA
                          </button>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Sessions actives</h4>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-600">Session actuelle - Chrome sur Linux</p>
                            <p className="text-xs text-gray-500">Dernière activité: maintenant</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSave('sécurité')}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Link href="/dashboard" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <h4 className="font-medium text-gray-900">Dashboard</h4>
                    <p className="text-sm text-gray-600">Vue d'ensemble</p>
                  </Link>
                  <Link href="/projects" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <h4 className="font-medium text-gray-900">Projets</h4>
                    <p className="text-sm text-gray-600">Gérer vos projets</p>
                  </Link>
                  <Link href="/teams" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <h4 className="font-medium text-gray-900">Équipes</h4>
                    <p className="text-sm text-gray-600">Collaborer</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState('dashboard')

  const demos = {
    dashboard: {
      title: 'Dashboard principal',
      description: 'Vue d\'ensemble de tous vos projets et métriques',
      image: '📊',
      features: ['Graphiques en temps réel', 'Statistiques d\'équipe', 'Notifications importantes']
    },
    projects: {
      title: 'Gestion de projets',
      description: 'Créez, organisez et suivez vos projets',
      image: '📋',
      features: ['Création de projets', 'Suivi du progrès', 'Gestion des échéances']
    },
    teams: {
      title: 'Collaboration d\'équipe',
      description: 'Invitez et gérez vos équipes efficacement',
      image: '👥',
      features: ['Invitations membres', 'Rôles et permissions', 'Chat intégré']
    },
    analytics: {
      title: 'Analytics avancés',
      description: 'Analysez les performances de vos projets',
      image: '📈',
      features: ['Rapports détaillés', 'Métriques personnalisées', 'Export de données']
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 lg:ml-64">
      <div className="py-10">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Démo Interactive</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explorez SAIDIDSpace et découvrez comment il peut transformer votre façon de travailler
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-16">
          {/* Demo Navigation */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choisissez une fonctionnalité à explorer</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(demos).map(([key, demo]) => (
                <button
                  key={key}
                  onClick={() => setActiveDemo(key)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activeDemo === key
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{demo.image}</div>
                  <h3 className="font-medium text-gray-900">{demo.title}</h3>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Display */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {demos[activeDemo].title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {demos[activeDemo].description}
                  </p>
                </div>
                <div className="text-6xl text-gray-300">
                  {demos[activeDemo].image}
                </div>
              </div>
            </div>

            {/* Demo Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Features List */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Fonctionnalités principales</h3>
                  <ul className="space-y-3">
                    {demos[activeDemo].features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-3">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Comment ça marche ?</h4>
                    <p className="text-gray-600 text-sm">
                      Cette fonctionnalité vous permet de {demos[activeDemo].description.toLowerCase()}. 
                      Avec une interface intuitive et des outils puissants, vous pouvez améliorer 
                      significativement votre productivité.
                    </p>
                  </div>
                </div>

                {/* Mock Interface */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="bg-white rounded shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Interface {demos[activeDemo].title}</h4>
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    {activeDemo === 'dashboard' && (
                      <div className="space-y-3">
                        <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="h-12 bg-blue-200 rounded"></div>
                          <div className="h-12 bg-green-200 rounded"></div>
                          <div className="h-12 bg-purple-200 rounded"></div>
                        </div>
                      </div>
                    )}
                    
                    {activeDemo === 'projects' && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-6 bg-indigo-200 rounded w-20"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-16 bg-gray-100 rounded border-l-4 border-green-400"></div>
                          <div className="h-16 bg-gray-100 rounded border-l-4 border-yellow-400"></div>
                          <div className="h-16 bg-gray-100 rounded border-l-4 border-blue-400"></div>
                        </div>
                      </div>
                    )}
                    
                    {activeDemo === 'teams' && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-200 rounded-full"></div>
                          <div className="space-y-1">
                            <div className="h-3 bg-gray-300 rounded w-20"></div>
                            <div className="h-2 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-200 rounded-full"></div>
                          <div className="space-y-1">
                            <div className="h-3 bg-gray-300 rounded w-24"></div>
                            <div className="h-2 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-200 rounded-full"></div>
                          <div className="space-y-1">
                            <div className="h-3 bg-gray-300 rounded w-18"></div>
                            <div className="h-2 bg-gray-200 rounded w-14"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeDemo === 'analytics' && (
                      <div className="space-y-3">
                        <div className="h-24 bg-gradient-to-r from-indigo-200 to-purple-200 rounded"></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-16 bg-green-100 rounded p-2">
                            <div className="h-2 bg-green-300 rounded mb-1"></div>
                            <div className="h-6 bg-green-200 rounded"></div>
                          </div>
                          <div className="h-16 bg-blue-100 rounded p-2">
                            <div className="h-2 bg-blue-300 rounded mb-1"></div>
                            <div className="h-6 bg-blue-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-indigo-600 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Convaincu ? Commencez maintenant !
            </h2>
            <p className="text-indigo-100 mb-6 text-lg">
              Créez votre compte gratuit et découvrez toutes ces fonctionnalités
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/register" 
                className="bg-white text-indigo-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Créer un compte gratuit
              </Link>
              <Link 
                href="/pricing" 
                className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Continuer votre exploration</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link href="/features" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900">Toutes les fonctionnalités</h4>
                  <p className="text-sm text-gray-600">Liste complète des capacités</p>
                </Link>
                <Link href="/pricing" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900">Plans et tarifs</h4>
                  <p className="text-sm text-gray-600">Choisir votre abonnement</p>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

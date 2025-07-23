"use client"

import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-100 lg:ml-64">
      <div className="py-10">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Guides, tutoriels et références pour utiliser SAIDIDSpace
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-16">
          <div className="mb-12">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher dans la documentation..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🚀</span>
                <h2 className="text-xl font-bold text-gray-900">Démarrage rapide</h2>
              </div>
              
              <div className="space-y-3">
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Installation et configuration
                  </h3>
                  <p className="text-sm text-gray-600">Premiers pas avec CollabSpace</p>
                </div>
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Créer votre premier projet
                  </h3>
                  <p className="text-sm text-gray-600">Guide étape par étape</p>
                </div>
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Inviter des membres
                  </h3>
                  <p className="text-sm text-gray-600">Constituer votre équipe</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">📋</span>
                <h2 className="text-xl font-bold text-gray-900">Gestion de projets</h2>
              </div>
              
              <div className="space-y-3">
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Organiser vos projets
                  </h3>
                  <p className="text-sm text-gray-600">Meilleures pratiques</p>
                </div>
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Suivi des tâches
                  </h3>
                  <p className="text-sm text-gray-600">Gérer les échéances et priorités</p>
                </div>
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Rapports et analytics
                  </h3>
                  <p className="text-sm text-gray-600">Analyser les performances</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">👥</span>
                <h2 className="text-xl font-bold text-gray-900">Collaboration</h2>
              </div>
              
              <div className="space-y-3">
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Travail en équipe
                  </h3>
                  <p className="text-sm text-gray-600">Collaboration efficace</p>
                </div>
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Partage de fichiers
                  </h3>
                  <p className="text-sm text-gray-600">Gérer les documents</p>
                </div>
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Communication
                  </h3>
                  <p className="text-sm text-gray-600">Chat et notifications</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🔗</span>
                <h2 className="text-xl font-bold text-gray-900">API & Intégrations</h2>
              </div>
              
              <div className="space-y-3">
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Documentation API
                  </h3>
                  <p className="text-sm text-gray-600">Guide développeur complet</p>
                </div>
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Webhooks
                  </h3>
                  <p className="text-sm text-gray-600">Automatiser les workflows</p>
                </div>
                <div className="border-l-4 border-indigo-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Intégrations tierces
                  </h3>
                  <p className="text-sm text-gray-600">Connecter vos outils</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-indigo-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Besoin d'aide supplémentaire ?
            </h2>
            <p className="text-gray-600 mb-6">
              Notre équipe support est là pour vous aider
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700">
                Contacter le support
              </button>
              <Link 
                href="/features" 
                className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-indigo-50"
              >
                Voir les fonctionnalités
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Liens utiles</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Link href="/features" className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 text-center">
                  <h4 className="font-medium text-gray-900">Fonctionnalités</h4>
                </Link>
                <Link href="/pricing" className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 text-center">
                  <h4 className="font-medium text-gray-900">Tarifs</h4>
                </Link>
                <Link href="/get-started" className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 text-center">
                  <h4 className="font-medium text-gray-900">Commencer</h4>
                </Link>
                <Link href="/register" className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 text-center">
                  <h4 className="font-medium text-gray-900">S'inscrire</h4>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

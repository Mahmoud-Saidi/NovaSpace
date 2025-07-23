"use client"

import Link from 'next/link'

export default function FeaturesPage() {
  const features = [
    {
      title: 'Gestion de Projets',
      description: 'Organisez et suivez vos projets avec des outils intuitifs',
      icon: '📋',
      details: [
        'Création et gestion de projets',
        'Suivi des tâches et du progrès',
        'Gestion des échéances et priorités',
        'Rapports de performance détaillés',
        'Templates de projets prédéfinis'
      ]
    },
    {
      title: 'Collaboration en Équipe',
      description: 'Travaillez ensemble efficacement',
      icon: '👥',
      details: [
        'Invitations et gestion des membres',
        'Chat en temps réel intégré',
        'Partage de fichiers sécurisé',
        'Notifications collaboratives',
        'Rôles et permissions avancés'
      ]
    },
    {
      title: 'Tableau de Bord',
      description: 'Vue d\'ensemble complète de votre activité',
      icon: '📊',
      details: [
        'Métriques en temps réel',
        'Graphiques interactifs',
        'Statistiques d\'équipe',
        'Analyses prédictives',
        'Widgets personnalisables'
      ]
    },
    {
      title: 'Sécurité Avancée',
      description: 'Protection maximale de vos données',
      icon: '🔒',
      details: [
        'Authentification à deux facteurs',
        'Chiffrement des données',
        'Gestion des permissions granulaire',
        'Audit des accès et logs',
        'Sauvegarde automatique'
      ]
    },
    {
      title: 'Intégrations',
      description: 'Connectez vos outils favoris',
      icon: '🔗',
      details: [
        'APIs REST complètes',
        'Webhooks personnalisables',
        'Intégrations tierces (Slack, GitHub)',
        'Synchronisation automatique',
        'Plugins personnalisés'
      ]
    },
    {
      title: 'Mobile Ready',
      description: 'Accès depuis n\'importe où',
      icon: '📱',
      details: [
        'Interface responsive',
        'Application mobile native',
        'Synchronisation offline',
        'Notifications push',
        'Mode sombre adaptatif'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 lg:ml-64">
      <div className="py-10">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                ← Retour à l'accueil
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Fonctionnalités</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez toutes les fonctionnalités qui font de CollabSpace 
              la plateforme idéale pour vos projets collaboratifs
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-16">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 mt-2">{feature.description}</p>
                </div>
                
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-indigo-600 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-indigo-100 mb-6 text-lg">
              Rejoignez des milliers d'équipes qui utilisent déjà CollabSpace
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/register" 
                className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Créer un compte
              </Link>
              <Link 
                href="/demo" 
                className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
              >
                Voir la démo
              </Link>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-16 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Comparaison des plans</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fonctionnalité</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Gratuit</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pro</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Projets</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">3</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Illimités</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Illimités</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Membres d'équipe</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">5</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">50</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Illimités</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Stockage</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">1 GB</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">100 GB</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">1 TB</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Support</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Email</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Chat + Email</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Téléphone + Chat + Email</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">API</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">❌</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">✅</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Intégrations</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Basiques</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Avancées</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Complètes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pourquoi choisir CollabSpace ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-900">Rapide</h3>
                <p className="text-sm text-gray-600">Interface ultra-réactive</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-semibold text-gray-900">Sécurisé</h3>
                <p className="text-sm text-gray-600">Données protégées</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-gray-900">Intuitif</h3>
                <p className="text-sm text-gray-600">Facile à utiliser</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-semibold text-gray-900">Évolutif</h3>
                <p className="text-sm text-gray-600">Grandit avec vous</p>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Découvrir plus</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link href="/pricing" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900">Voir les tarifs</h4>
                  <p className="text-sm text-gray-600">Plans et prix détaillés</p>
                </Link>
                <Link href="/get-started" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900">Commencer</h4>
                  <p className="text-sm text-gray-600">Guide pour débuter</p>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

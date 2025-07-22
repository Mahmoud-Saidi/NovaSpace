"use client"

import Link from 'next/link'

export default function PricingPage() {
  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      period: '/mois',
      description: 'Parfait pour commencer',
      features: [
        '3 projets',
        '5 membres d\'équipe',
        '1 GB de stockage',
        'Support par email',
        'Fonctionnalités de base',
        'Tableaux de bord simples'
      ],
      cta: 'Commencer gratuitement',
      highlighted: false,
      popular: false
    },
    {
      name: 'Pro',
      price: '19€',
      period: '/mois',
      description: 'Pour les équipes en croissance',
      features: [
        'Projets illimités',
        '50 membres d\'équipe',
        '100 GB de stockage',
        'Support chat + email',
        'Fonctionnalités avancées',
        'Intégrations tierces',
        'Rapports détaillés',
        'API complète',
        'Analytics avancés'
      ],
      cta: 'Essayer 14 jours gratuits',
      highlighted: true,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '49€',
      period: '/mois',
      description: 'Pour les grandes organisations',
      features: [
        'Tout du plan Pro',
        'Membres illimités',
        '1 TB de stockage',
        'Support téléphone + chat + email',
        'SSO et sécurité avancée',
        'Intégrations personnalisées',
        'Support dédié',
        'Formation personnalisée',
        'SLA garanti'
      ],
      cta: 'Contacter les ventes',
      highlighted: false,
      popular: false
    }
  ]

  const faq = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et la facturation est ajustée au prorata.'
    },
    {
      question: 'Y a-t-il une période d\'engagement ?',
      answer: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment sans frais cachés.'
    },
    {
      question: 'Acceptez-vous les cartes de crédit ?',
      answer: 'Oui, nous acceptons toutes les principales cartes de crédit : Visa, MasterCard, American Express, ainsi que PayPal.'
    },
    {
      question: 'Offrez-vous des réductions pour les associations ?',
      answer: 'Oui, nous offrons des réductions spéciales pour les associations, les organisations à but non lucratif et les établissements d\'enseignement.'
    },
    {
      question: 'Que se passe-t-il avec mes données si j\'annule ?',
      answer: 'Vos données restent accessibles pendant 30 jours après l\'annulation. Vous pouvez les exporter à tout moment.'
    },
    {
      question: 'Y a-t-il des frais de configuration ?',
      answer: 'Non, il n\'y a aucun frais de configuration ou d\'installation. Vous payez uniquement votre abonnement mensuel.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 lg:ml-64">
      <div className="py-10">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tarifs</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. 
              Commencez gratuitement, évoluez selon vos besoins.
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-16">
          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-lg overflow-hidden relative ${
                  plan.highlighted ? 'ring-2 ring-indigo-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-indigo-500 text-white text-center py-2 text-sm font-medium">
                    Le plus populaire
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                  
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    className={`w-full mt-8 py-3 px-4 rounded-md font-medium transition-colors ${
                      plan.highlighted 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-16 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Comparaison détaillée</h2>
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
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Personnalisées</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">SLA</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">99.5%</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">99.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>
            <div className="space-y-6">
              {faq.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-indigo-600 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à commencer votre essai gratuit ?
            </h2>
            <p className="text-indigo-100 mb-6 text-lg">
              Aucune carte de crédit requise. Accès complet pendant 14 jours.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/register" 
                className="bg-white text-indigo-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Commencer maintenant
              </Link>
              <Link 
                href="/demo" 
                className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
              >
                Voir la démo
              </Link>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Besoin d'aide ?</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link href="/features" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900">Voir les fonctionnalités</h4>
                  <p className="text-sm text-gray-600">Toutes les fonctionnalités détaillées</p>
                </Link>
                <Link href="/demo" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900">Démo en ligne</h4>
                  <p className="text-sm text-gray-600">Testez avant de vous engager</p>
                </Link>
                <a href="mailto:contact@collabspace.com" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900">Nous contacter</h4>
                  <p className="text-sm text-gray-600">Questions personnalisées</p>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

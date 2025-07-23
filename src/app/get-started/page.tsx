"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userType, setUserType] = useState('')

  const steps = [
    {
      id: 1,
      title: 'Bienvenue sur CollabSpace',
      subtitle: 'Commençons votre parcours de collaboration'
    },
    {
      id: 2,
      title: 'Quel est votre profil ?',
      subtitle: 'Personnalisons votre expérience'
    },
    {
      id: 3,
      title: 'Créez votre premier projet',
      subtitle: 'Lancez-vous dès maintenant'
    },
    {
      id: 4,
      title: 'Félicitations !',
      subtitle: 'Vous êtes prêt à collaborer'
    }
  ]

  const userTypes = [
    {
      id: 'manager',
      title: 'Chef de projet',
      description: 'Je gère des équipes et des projets',
      icon: '👨‍💼',
      features: ['Tableaux de bord avancés', 'Gestion d\'équipes', 'Rapports détaillés']
    },
    {
      id: 'developer',
      title: 'Développeur',
      description: 'Je code et collabore sur des projets tech',
      icon: '👨‍💻',
      features: ['Intégrations Git', 'Suivi de bugs', 'Code reviews']
    },
    {
      id: 'designer',
      title: 'Designer',
      description: 'Je crée et conçois des interfaces',
      icon: '🎨',
      features: ['Partage de maquettes', 'Feedback visuel', 'Versioning design']
    },
    {
      id: 'freelance',
      title: 'Freelance',
      description: 'Je travaille en indépendant',
      icon: '🚀',
      features: ['Gestion clients', 'Facturation simple', 'Portfolios projets']
    }
  ]

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 lg:ml-64">
      <div className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Home Button */}
          <div className="flex justify-start mb-6">
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              ← Retour à l'accueil
            </Link>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Étape {currentStep} sur 4</span>
              <span className="text-sm text-gray-600">{Math.round((currentStep / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="text-center">
                <div className="text-6xl mb-6">🎉</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {steps[0].title}
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {steps[0].subtitle}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4">
                    <div className="text-3xl mb-2">📋</div>
                    <h3 className="font-semibold text-gray-900">Organisez</h3>
                    <p className="text-sm text-gray-600">Vos projets et tâches</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-3xl mb-2">👥</div>
                    <h3 className="font-semibold text-gray-900">Collaborez</h3>
                    <p className="text-sm text-gray-600">Avec vos équipes</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-3xl mb-2">🚀</div>
                    <h3 className="font-semibold text-gray-900">Réussissez</h3>
                    <p className="text-sm text-gray-600">Vos objectifs</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: User Type Selection */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {steps[1].title}
                  </h1>
                  <p className="text-xl text-gray-600">
                    {steps[1].subtitle}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setUserType(type.id)}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                        userType === type.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{type.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
                        <p className="text-gray-600">{type.description}</p>
                      </div>
                      <ul className="space-y-1">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-700">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Create Project */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {steps[2].title}
                  </h1>
                  <p className="text-xl text-gray-600">
                    {steps[2].subtitle}
                  </p>
                </div>
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du projet
                      </label>
                      <input
                        type="text"
                        placeholder="Mon premier projet"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Décrivez votre projet..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de projet
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option>Développement web</option>
                        <option>Application mobile</option>
                        <option>Design UI/UX</option>
                        <option>Marketing</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && (
              <div className="text-center">
                <div className="text-6xl mb-6">🎊</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {steps[3].title}
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {steps[3].subtitle}
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochaines étapes :</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/projects" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
                      <div className="text-2xl mb-2">📋</div>
                      <h4 className="font-medium text-gray-900">Gérer vos projets</h4>
                      <p className="text-sm text-gray-600">Organisez vos tâches</p>
                    </Link>
                    <Link href="/teams" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
                      <div className="text-2xl mb-2">👥</div>
                      <h4 className="font-medium text-gray-900">Inviter votre équipe</h4>
                      <p className="text-sm text-gray-600">Collaborez ensemble</p>
                    </Link>
                    <Link href="/dashboard" className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
                      <div className="text-2xl mb-2">📊</div>
                      <h4 className="font-medium text-gray-900">Voir le dashboard</h4>
                      <p className="text-sm text-gray-600">Suivez votre activité</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-md font-medium ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Précédent
              </button>

              <div className="flex space-x-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`w-3 h-3 rounded-full ${
                      step.id === currentStep
                        ? 'bg-indigo-600'
                        : step.id < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  disabled={currentStep === 2 && !userType}
                  className={`px-6 py-2 rounded-md font-medium ${
                    currentStep === 2 && !userType
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Suivant
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700"
                >
                  Commencer
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

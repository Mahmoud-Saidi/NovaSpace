"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUserByEmail, createUser, initializeUsersDatabase } from '@/lib/users'

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  
  // États pour la connexion
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  // États pour l'inscription
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Gestion des changements pour la connexion
  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSignInData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Gestion des changements pour l'inscription
  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignUpData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validation pour la connexion
  const validateSignIn = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!signInData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(signInData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    if (!signInData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (signInData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validation pour l'inscription
  const validateSignUp = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!signUpData.firstName) {
      newErrors.firstName = 'Le prénom est requis'
    }
    
    if (!signUpData.lastName) {
      newErrors.lastName = 'Le nom est requis'
    }
    
    if (!signUpData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    if (!signUpData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (signUpData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    if (!signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmez votre mot de passe'
    } else if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Soumission de la connexion
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateSignIn()) return
    
    setIsLoading(true)
    
    try {
      initializeUsersDatabase()
      const user = getUserByEmail(signInData.email)
      
      if (!user) {
        setErrors({ submit: 'Utilisateur non trouvé. Veuillez vous inscrire.' })
        return
      }

      // Enregistrer l'état de connexion
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('authToken', `token_${user.id}_${Date.now()}`)
      localStorage.setItem('currentUserId', user.id)
      localStorage.setItem('userEmail', user.email)
      localStorage.setItem('userName', `${user.firstName} ${user.lastName}`)
      
      router.push('/')
      
    } catch (error) {
      setErrors({ submit: 'Erreur de connexion. Veuillez réessayer.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Soumission de l'inscription
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateSignUp()) return
    
    setIsLoading(true)
    
    try {
      const newUser = await createUser({
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        email: signUpData.email,
        password: signUpData.password,
        role: 'Member',
        status: 'active'
      })

      // Connexion automatique après inscription
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('authToken', `token_${newUser.id}_${Date.now()}`)
      localStorage.setItem('currentUserId', newUser.id)
      localStorage.setItem('userEmail', newUser.email)
      localStorage.setItem('userName', `${newUser.firstName} ${newUser.lastName}`)
      
      router.push('/')
      
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Erreur lors de l\'inscription' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Home Button */}
        <div className="flex justify-center">
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            ← Retour à l'accueil
          </Link>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'signin' ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="text-gray-600 mt-2">
            {activeTab === 'signin' 
              ? 'Accédez à votre espace SAIDIDSpace' 
              : 'Rejoignez SAIDIDSpace dès aujourd\'hui'
            }
          </p>
        </div>

        {/* Onglets */}
        <div className="flex rounded-lg bg-gray-200 p-1">
          <button
            onClick={() => {
              setActiveTab('signin')
              setErrors({})
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'signin'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => {
              setActiveTab('signup')
              setErrors({})
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'signup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            S'inscrire
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          {errors.submit && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {activeTab === 'signin' ? (
            // Formulaire de connexion
            <form onSubmit={handleSignInSubmit} className="space-y-6">
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="signin-email"
                  name="email"
                  value={signInData.email}
                  onChange={handleSignInChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="signin-password"
                    name="password"
                    value={signInData.password}
                    onChange={handleSignInChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={signInData.rememberMe}
                  onChange={handleSignInChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          ) : (
            // Formulaire d'inscription
            <form onSubmit={handleSignUpSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={signUpData.firstName}
                    onChange={handleSignUpChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={signUpData.lastName}
                    onChange={handleSignUpChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Votre nom"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={signUpData.confirmPassword}
                  onChange={handleSignUpChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // Vérifier l'état de connexion
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn')
      const email = localStorage.getItem('userEmail')
      
      setIsLoggedIn(!!loggedIn)
      setUserEmail(email || '')
    }
    
    checkAuth()
    
    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    // Supprimer SEULEMENT les données d'authentification
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('currentUserId')
    localStorage.removeItem('userName')
    
    // NE PAS supprimer les projets et équipes - ils doivent persister !
    // localStorage.removeItem('userProjects') // ❌ SUPPRIMÉ
    // localStorage.removeItem('userTeams')    // ❌ SUPPRIMÉ
    
    // Mettre à jour l'état local
    setIsLoggedIn(false)
    setUserEmail('')
    
    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('userLoggedOut'))
    
    // Rediriger vers la page d'accueil
    router.push('/')
  }
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">SAIDIDSpace</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            {pathname !== '/' && (
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                🏠 Accueil
              </Link>
            )}
            <Link href="/features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600">
                  Connecté: {userEmail}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" asChild>
                  <Link href="/sign-in">Connexion / Inscription</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

"use client"

import { useState, useEffect } from 'react'
import { Navbar } from '../components/navbar'
import { Sidebar } from '../components/sidebar'
import { Features } from '../components/features'
import { Stats } from '../components/stats'
import { CTA } from '../components/cta'
import { Footer } from '../components/footer'
import { Button } from '../components/ui/button'

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Vérification de l'authentification
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      
      if (token || isLoggedIn) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }
    
    checkAuth()
    
    // Écouter les changements d'authentification avec un intervalle plus fréquent
    const handleStorageChange = () => {
      checkAuth()
    }
    
    // Écouter l'événement personnalisé de déconnexion
    const handleLogout = () => {
      setIsAuthenticated(false)
      setIsLoading(false)
    }
    
    // Écouter les changements de storage pour les autres onglets
    window.addEventListener('storage', handleStorageChange)
    
    // Écouter l'événement de déconnexion
    window.addEventListener('userLoggedOut', handleLogout)
    
    // Vérifier les changements locaux plus fréquemment
    const interval = setInterval(() => {
      checkAuth()
    }, 500) // Vérifier toutes les 500ms pour une réactivité rapide
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userLoggedOut', handleLogout)
      clearInterval(interval)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 px-4 md:px-12 py-8 md:py-16">
          {/* Hero Section */}
          <section className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                <span className="block">NovaSpace</span>
                <span className="block bg-gradient-to-r from-[#F596D3] to-[#61DAFB] text-transparent bg-clip-text">L'expérience web moderne</span>
                <span className="block text-primary">pour explorer, créer et innover</span>
              </h1>
              <p className="text-lg text-muted-foreground md:w-10/12">
                {isAuthenticated 
                  ? "Bienvenue dans votre espace de travail collaboratif. Gérez vos projets, équipes et tâches en toute simplicité."
                  : "Découvrez une interface élégante, rapide et responsive, conçue pour tous vos besoins numériques."
                }
              </p>
              <div className="flex gap-4">
                {!isAuthenticated && (
                  <>
                    <Button size="lg" className="bg-gradient-to-r from-[#F596D3] to-[#61DAFB] text-white hover:from-[#F596D3]/90 hover:to-[#61DAFB]/90 font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                      <a href="/sign-in">🚀 Commencer l'aventure</a>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <a href="/demo">Voir la démo</a>
                    </Button>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <Button size="lg" className="bg-gradient-to-r from-[#F596D3] to-[#61DAFB] text-white hover:from-[#F596D3]/90 hover:to-[#61DAFB]/90 font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                      <a href="/dashboard">📊 Tableau de bord</a>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <a href="/projects">🚀 Mes projets</a>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="w-72 h-72 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl flex items-center justify-center shadow-xl">
                {/* Illustration placeholder */}
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="20" width="80" height="80" rx="20" fill="#F596D3" fillOpacity="0.2"/>
                  <rect x="35" y="35" width="50" height="50" rx="10" fill="#61DAFB" fillOpacity="0.3"/>
                </svg>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-16">
            <Features />
          </section>

          {/* Stats Section */}
          <section className="mb-16">
            <Stats isAuthenticated={isAuthenticated} />
          </section>

          {/* CTA Section - Only show when not authenticated */}
          {!isAuthenticated && (
            <section className="mb-16">
              <CTA />
            </section>
          )}
        </main>
        <Footer />
    </div>
  )
}

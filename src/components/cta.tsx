import React from "react"

export function CTA() {
  return (
    <section className="py-16 text-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl my-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Rejoignez plus de 2,800+ utilisateurs !</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Des équipes du monde entier utilisent NovaSpace pour collaborer, gérer leurs projets et booster leur productivité.
        </p>
        
        {/* Stats inline */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-sm opacity-90">Utilisateurs actifs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm opacity-90">Projets réussis</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">4,923</div>
            <div className="text-sm opacity-90">Tâches terminées</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm opacity-90">Satisfaction client</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="/sign-in" 
            className="inline-flex items-center px-8 py-3 bg-white text-primary rounded-lg hover:bg-white/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            🚀 Commencer l'aventure
          </a>
          <a 
            href="/demo" 
            className="inline-flex items-center px-8 py-3 border-2 border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 font-semibold"
          >
            📺 Voir la démo
          </a>
        </div>
        
        <p className="text-sm opacity-75 mt-4">
          ✨ Gratuit pour toujours • Pas de carte de crédit requise • Configuration en 2 minutes
        </p>
      </div>
    </section>
  )
}

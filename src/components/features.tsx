// Features component
import React from 'react'

export function Features() {
  const features = [
    {
      icon: "🚀",
      title: "Gestion de projets avancée",
      description: "Organisez vos projets avec des tableaux Kanban intuitifs, des tâches assignables et un suivi du progrès en temps réel.",
      stats: "95% plus efficace"
    },
    {
      icon: "👥",
      title: "Collaboration d'équipe",
      description: "Travaillez ensemble avec des équipes de toutes tailles, des permissions granulaires et des notifications intelligentes.",
      stats: "Jusqu'à 50 membres"
    },
    {
      icon: "📊",
      title: "Tableau de bord analytique",
      description: "Suivez les performances de vos projets avec des métriques détaillées et des rapports automatisés.",
      stats: "20+ métriques"
    },
    {
      icon: "⚡",
      title: "Automatisation intelligente",
      description: "Automatisez les tâches répétitives et concentrez-vous sur ce qui compte vraiment pour votre équipe.",
      stats: "70% de temps économisé"
    },
    {
      icon: "🔒",
      title: "Sécurité enterprise",
      description: "Vos données sont protégées avec un chiffrement de niveau bancaire et des sauvegardes automatiques.",
      stats: "99.9% uptime"
    },
    {
      icon: "🔗",
      title: "Intégrations puissantes",
      description: "Connectez-vous avec plus de 100 outils populaires : Slack, GitHub, Google Drive, et bien plus.",
      stats: "100+ intégrations"
    }
  ]

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Fonctionnalités qui transforment votre productivité
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Découvrez les outils puissants qui ont aidé plus de 2,800 équipes à atteindre leurs objectifs plus rapidement.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {feature.description}
            </p>
            <div className="flex items-center text-sm">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                {feature.stats}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional stats section */}
      <div className="mt-16 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="p-4">
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Disponibilité garantie</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Support client</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-primary mb-2">156</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Projets actifs</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-primary mb-2">2min</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Configuration</div>
          </div>
        </div>
      </div>
    </section>
  )
}

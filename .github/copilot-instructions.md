<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# CollabSpace - Instructions de développement

## Technologies principales
- **Next.js 14** avec App Router et TypeScript
- **shadcn/ui** pour les composants UI
- **Tailwind CSS** pour le styling
- **Prisma** avec PostgreSQL pour la base de données
- **NextAuth.js** pour l'authentification
- **Docker** pour le développement et déploiement
- **Zustand** pour la gestion d'état
- **Socket.io** pour le temps réel

## Architecture du projet
```
src/
├── app/                    # App Router (Next.js 13+)
├── components/             # Composants React
│   ├── ui/                # shadcn/ui components
│   └── custom/            # Composants personnalisés
├── lib/                   # Utilitaires et configurations
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript types
└── utils/                 # Fonctions utilitaires
```

## Conventions de codage
- Utiliser TypeScript strict
- Composants en PascalCase
- Fichiers et dossiers en kebab-case
- Utiliser les Server Components par défaut
- Client Components avec "use client" uniquement si nécessaire
- Préférer les named exports

## shadcn/ui
- Tous les composants UI sont dans `components/ui/`
- Utiliser `cn()` pour la fusion des classes CSS
- Respecter le design system défini dans `globals.css`

## Base de données
- Utiliser Prisma Client pour les interactions
- Modèles définis dans `prisma/schema.prisma`
- Migrations automatiques avec `prisma migrate dev`

## Authentification
- NextAuth.js configuré avec plusieurs providers
- Sessions gérées côté serveur
- Middleware pour protection des routes

## État global
- Zustand pour l'état global léger
- React Query pour le cache des données serveur
- Contextes React pour l'état partagé simple

## Styling
- Tailwind CSS avec configuration personnalisée
- Variables CSS pour les thèmes (dark/light)
- Composants responsives par défaut
- Animations avec Framer Motion

## Performance
- Images optimisées avec next/image
- Lazy loading automatique
- Bundle splitting intelligent
- Cache strategies avec Redis

## Déploiement
- Docker pour développement local
- Vercel pour production
- Variables d'environnement sécurisées
- CI/CD avec GitHub Actions (à configurer)

# SAIDIDSpace - Plateforme de Collaboration Moderne

Une plateforme moderne de gestion de projets collaboratifs construite avec Next.js 14, shadcn/ui, et Docker.

![SAIDIDSpace](https://via.placeholder.com/800x400/0066CC/FFFFFF?text=SAIDIDSpace)

## ✨ Fonctionnalités

### 🎯 Gestion de projets
- **Dashboard interactif** avec analytics en temps réel
- **Gestion d'équipes** et attribution de rôles
- **Suivi de tâches** avec statuts et priorités
- **Timeline** et calendrier de projet

### 💬 Collaboration
- **Chat en temps réel** avec Socket.io
- **Commentaires** sur les tâches
- **Notifications** push intelligentes
- **Partage de fichiers** intégré

### 🔐 Authentification
- **NextAuth.js** avec plusieurs providers
- **Rôles et permissions** granulaires
- **Sessions sécurisées** avec Redis
- **Authentification à deux facteurs** (2FA)

### 📊 Analytics
- **Métriques de performance** d'équipe
- **Rapports de progression** automatiques
- **Tableaux de bord** personnalisables
- **Exports** en PDF/Excel

## 🛠 Technologies

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **shadcn/ui** - Composants UI modernes
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Animations fluides

### Backend
- **Next.js API Routes** - API REST intégrée
- **Prisma** - ORM moderne pour TypeScript
- **PostgreSQL** - Base de données relationnelle
- **Redis** - Cache et sessions
- **Socket.io** - Communication temps réel

### DevOps
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration locale
- **Vercel** - Déploiement cloud
- **GitHub Actions** - CI/CD (à configurer)

## 🚀 Démarrage rapide

### Prérequis
- Docker et Docker Compose
- Node.js 18+ (pour développement local)
- Git

### Installation avec Docker (Recommandé)

1. **Cloner le projet**
```bash
git clone <your-repo-url>
cd saididspace
```

2. **Configuration de l'environnement**
```bash
cp .env.example .env.local
# Éditer .env.local avec vos valeurs
# Note: L'application tourne maintenant sur le port 3999
```

3. **Lancer avec Docker Compose**
```bash
# Développement
npm run docker:dev

# Ou directement
docker-compose up --build
```

4. **Accéder à l'application**
- Application: http://localhost:3999
- pgAdmin: http://localhost:5050
- Redis: localhost:6379

### Installation locale (Alternative)

1. **Installer les dépendances**
```bash
npm install
```

2. **Démarrer PostgreSQL et Redis**
```bash
docker-compose up postgres redis -d
```

3. **Configuration de la base de données**
```bash
npx prisma generate
npx prisma db push
```

4. **Lancer en développement**
```bash
npm run dev          # Démarre sur le port 3999
# ou
npm run start:3999   # Script avec vérification du port
# ou
./start-3999.sh      # Script interactif
```

**🌐 L'application sera accessible sur: http://localhost:3999**

## 📁 Structure du projet

```
saididspace/
├── src/                      # Code source
│   ├── app/                  # App Router (Next.js 14)
│   │   ├── (auth)/          # Routes d'authentification
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── projects/        # Gestion des projets
│   │   └── api/             # API Routes
│   ├── components/          # Composants React
│   │   ├── ui/              # shadcn/ui components
│   │   ├── forms/           # Formulaires
│   │   ├── layouts/         # Layouts
│   │   └── features/        # Composants métier
│   ├── lib/                 # Configurations et utilitaires
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand stores
│   ├── types/               # Types TypeScript
│   └── utils/               # Fonctions utilitaires
├── prisma/                  # Schéma de base de données
├── public/                  # Assets statiques
├── docker-compose.yml       # Configuration Docker
├── Dockerfile              # Image Docker
└── README.md               # Documentation
```

## 🔧 Commandes disponibles

```bash
# Développement
npm run dev              # Démarrer en mode développement
npm run build           # Build de production
npm run start           # Démarrer en production
npm run lint            # Linter le code

# Base de données
npm run db:generate     # Générer le client Prisma
npm run db:push         # Pousser le schéma vers la DB
npm run db:migrate      # Créer une migration
npm run db:studio       # Interface Prisma Studio

# Docker
npm run docker:dev      # Lancer avec Docker (dev)
npm run docker:prod     # Lancer avec Docker (prod)

# Utilitaires
npm run type-check      # Vérification TypeScript
```

## 🌐 Déploiement

### Vercel (Recommandé)

1. **Connecter à Vercel**
```bash
npx vercel
```

2. **Configurer les variables d'environnement**
- `DATABASE_URL` - URL PostgreSQL
- `NEXTAUTH_SECRET` - Clé secrète
- `NEXTAUTH_URL` - URL de production

3. **Déployer**
```bash
npx vercel --prod
```

### Docker Production

```bash
# Build et lancement
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🔒 Sécurité

- **Authentification sécurisée** avec NextAuth.js
- **Validation des données** avec Zod
- **Protection CSRF** automatique
- **Variables d'environnement** sécurisées
- **Headers de sécurité** configurés

## 📈 Monitoring

- **Logs structurés** avec Winston
- **Métriques** avec Prometheus (à configurer)
- **Alertes** automatiques
- **Health checks** Docker

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation**: [docs.saididspace.com](https://docs.saididspace.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/saididspace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/saididspace/discussions)

---

**Fait avec ❤️ par l'équipe SAIDIDSpace**

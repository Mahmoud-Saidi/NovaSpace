# 🚀 Guide de Déploiement Vercel - CollabSpace

## 🎉 État du déploiement

✅ **READY FOR PRODUCTION** - L'application se compile avec succès sur Vercel !

**Dernière mise à jour** : 22 Juillet 2025 - 23:40
- ✅ Build réussi sur Vercel
- ✅ TypeScript configuré correctement
- ✅ Erreurs de typage corrigées (Team interface, assignedTeamName)
- ✅ Configuration Vercel optimisée
- ✅ Propriétés inexistantes supprimées

## Prérequis
- Compte Vercel (gratuit)
- Repository GitHub/GitLab/Bitbucket
- Base de données PostgreSQL (recommandé: Neon, Supabase, ou Railway)

## 📋 Étapes de déploiement

### 1. Préparation du code
```bash
# Tester le build en local
npm run build

# Vérifier TypeScript
npm run type-check
```

### 2. Variables d'environnement Vercel

**⚡ Déploiement rapide (localStorage)** :
Pour un déploiement immédiat avec localStorage, vous n'avez besoin d'AUCUNE variable d'environnement ! L'application fonctionnera parfaitement.

**🔐 Déploiement avec authentification (optionnel)** :
```env
# Authentication (OPTIONNEL pour localStorage)
NEXTAUTH_SECRET=your-secret-key-32-characters-min
NEXTAUTH_URL=https://your-app.vercel.app
```

**🗄️ Déploiement avec base de données (avancé)** :
```env
# Base de données (pour migration future)
DATABASE_URL=postgresql://username:password@host:5432/database

# Authentication (OBLIGATOIRE si DB)
NEXTAUTH_SECRET=your-secret-key-32-characters-min
NEXTAUTH_URL=https://your-app.vercel.app

# OAuth (OPTIONNEL)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (OPTIONNEL)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com

# Analytics (OPTIONNEL)
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
```

### 3. Déploiement automatique

1. **Connecter le repository** :
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez "New Project"
   - Importez votre repository GitHub

2. **Configuration automatique** :
   - Vercel détectera automatiquement Next.js
   - Framework Preset: `Next.js`
   - Build Command: `npm run build` (par défaut)
   - Output Directory: `.next` (par défaut)
   - Install Command: `npm install` (par défaut)
   - Node.js Version: `18.x` (recommandé)

3. **Variables d'environnement** :
   - Ajoutez toutes les variables listées ci-dessus
   - Attention à `DATABASE_URL` et `NEXTAUTH_SECRET`

4. **Déployer** :
   - Cliquez "Deploy"
   - Le déploiement prend 2-3 minutes

### 4. Configuration base de données

Si vous n'avez pas de base de données, utilisez **Neon** (gratuit) :

1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez une nouvelle base de données
3. Copiez l'URL de connection
4. Ajoutez-la comme `DATABASE_URL` dans Vercel

### 5. Post-déploiement

Une fois déployé :
```bash
# Générer le client Prisma (si nécessaire)
npx prisma generate

# Pousser le schéma vers la base
npx prisma db push
```

## 🔧 Configuration avancée

### Domaine personnalisé
1. Dans Vercel > Settings > Domains
2. Ajoutez votre domaine
3. Configurez les enregistrements DNS

### Monitoring
- Vercel Analytics (gratuit)
- Vercel Speed Insights
- Error tracking automatique

## 🚨 Points d'attention

### Données localStorage
⚠️ **IMPORTANT** : Votre application utilise actuellement `localStorage` pour les données.

**Pour un déploiement rapide (démo)** :
- ✅ Fonctionne parfaitement sur Vercel
- Les données sont stockées localement dans le navigateur
- Chaque utilisateur a ses propres données
- Idéal pour tester l'application

**Pour la production complète** :
1. **Migration vers base de données** :
   - Équipes → Table `teams`
   - Projets → Table `projects` 
   - Tâches → Table `tasks`

2. **API Routes** :
   - Créer des endpoints `/api/teams`
   - Créer des endpoints `/api/projects`
   - Créer des endpoints `/api/tasks`

**Note** : L'application fonctionne parfaitement avec localStorage sur Vercel pour une démo ou un MVP.

### Performance
- Les images sont optimisées automatiquement
- Le code est minifié
- Cache CDN global

## 🎯 Checklist de déploiement

### 🚀 Déploiement rapide (localStorage)
- [x] Code testé localement (`npm run build`)
- [x] TypeScript compilé sans erreur
- [x] Repository connecté à Vercel
- [ ] Déployé sur Vercel
- [ ] URL fonctionnelle testée

### 🔧 Déploiement avancé (optionnel)
- [ ] Variables d'environnement configurées
- [ ] Base de données PostgreSQL ready
- [ ] Domaine personnalisé configuré
- [ ] Monitoring activé

## 🆘 Dépannage

### ❌ Erreur: --legacy-openssl-provider is not allowed in NODE_OPTIONS
**Solution** : Supprimez `NODE_OPTIONS` du package.json pour Vercel
```json
// ✅ Correct pour Vercel
"build": "next build",
"start": "next start",

// ❌ Incorrect (cause l'erreur)
"build": "NODE_OPTIONS='--legacy-openssl-provider' next build"
```

### ❌ Erreur: Function Runtimes must have a valid version
**Solution** : Simplifiez `vercel.json` ou supprimez-le complètement
```json
// ✅ Configuration minimale qui fonctionne
{
  "framework": "nextjs"
}
```

### Erreur de build
```bash
# Localement, tester :
npm install
npm run build
```

### Erreur de base de données
```bash
# Vérifier la connection
npx prisma db push
```

### Variables d'environnement manquantes
- Vérifiez dans Vercel > Settings > Environment Variables
- Redéployez après modification

### ❌ Build failed - Next.js version incompatible
**Solution** : Vérifiez que votre version Next.js est compatible
```bash
# Mettre à jour Next.js si nécessaire
npm install next@latest
```

### ❌ TypeScript Error: Property 'X' does not exist on type 'Y'
**Solution** : Vérifiez les interfaces TypeScript
```typescript
// Assurez-vous que les propriétés existent dans l'interface
interface Project {
  assignedTeam: string    // ✅ Existe
  // assignedTeamName: string  // ❌ N'existe pas
}
```

### ❌ JSX tag requires the module path 'react/jsx-runtime'
**Solution** : Vérifiez la configuration TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "react"
  }
}
```

## 📞 Support
- Documentation Vercel : [vercel.com/docs](https://vercel.com/docs)
- Support : [vercel.com/support](https://vercel.com/support)

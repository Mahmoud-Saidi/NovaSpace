# 🚨 Guide de Résolution Rapide - Vercel

## Erreurs Communes et Solutions

### 1. ❌ `--legacy-openssl-provider is not allowed in NODE_OPTIONS`

**Cause** : Vercel n'autorise pas cette option dans NODE_OPTIONS

**Solution** : 
```bash
# Dans package.json, changez :
"build": "NODE_OPTIONS='--legacy-openssl-provider' next build"

# Vers :
"build": "next build"
```

### 2. ❌ `Function Runtimes must have a valid version`

**Cause** : Configuration incorrecte dans vercel.json

**Solution** : Simplifiez ou supprimez vercel.json
```json
{
  "framework": "nextjs"
}
```

### 3. ❌ Build failed - Module not found

**Cause** : Dépendances manquantes ou chemins incorrects

**Solution** :
```bash
# Testez localement d'abord
npm install
npm run build

# Vérifiez les imports dans votre code
```

### 4. ❌ Environment variables not working

**Cause** : Variables mal configurées dans Vercel

**Solution** :
1. Allez dans Vercel Dashboard > Settings > Environment Variables
2. Ajoutez vos variables une par une
3. Redéployez après chaque modification

### 5. ✅ Configuration qui fonctionne

**package.json** :
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

**vercel.json** (optionnel) :
```json
{
  "framework": "nextjs"
}
```

### 6. 🔄 Processus de test

1. **Test local** :
   ```bash
   npm run build
   npm start
   ```

2. **Variables minimales pour localStorage** :
   ```env
   NEXTAUTH_SECRET=your-32-character-secret-key
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

3. **Deploy** :
   - Push vers GitHub
   - Vercel redéploie automatiquement

## 🎯 Résolution Express

Si tout échoue :

1. **Supprimez vercel.json** complètement
2. **Simplifiez package.json** (enlevez NODE_OPTIONS)
3. **Testez en local** avec `npm run build`
4. **Redéployez** sur Vercel

L'application localStorage fonctionne parfaitement sur Vercel sans configuration spéciale !

#!/bin/bash

# Script de déploiement pour Vercel
echo "🚀 Préparation du déploiement Vercel..."

# Vérifier que les dépendances sont installées
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances..."
  npm install
fi

# Vérifier la configuration TypeScript
echo "🔍 Vérification TypeScript..."
npm run type-check

# Build de test local
echo "🏗️ Test de build local..."
npm run build

echo "✅ Application prête pour le déploiement Vercel !"
echo ""
echo "📋 Étapes suivantes :"
echo "1. Connectez votre dépôt GitHub à Vercel"
echo "2. Configurez les variables d'environnement"
echo "3. Déployez avec 'vercel --prod'"
echo ""
echo "🔗 Variables d'environnement nécessaires :"
echo "   - DATABASE_URL (PostgreSQL)"
echo "   - NEXTAUTH_SECRET"
echo "   - NEXTAUTH_URL"
echo "   - Autres variables selon vos besoins"

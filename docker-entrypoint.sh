#!/bin/sh

# Attendre que PostgreSQL soit prêt
echo "Attente du démarrage de PostgreSQL..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL est prêt !"

# Attendre que Redis soit prêt
echo "Attente du démarrage de Redis..."
while ! nc -z redis 6379; do
  sleep 1
done
echo "Redis est prêt !"

# Vérifier si la base de données existe et exécuter les migrations si nécessaire
echo "Vérification et initialisation de la base de données..."
npx prisma generate
npx prisma migrate deploy || npx prisma db push --accept-data-loss

# Démarrer l'application
echo "Démarrage de l'application..."
exec "$@"

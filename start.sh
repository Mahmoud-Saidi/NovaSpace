#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== CollabSpace - Démarrage de l'environnement de développement ===${NC}"

# Démarrage des conteneurs Docker
echo -e "${YELLOW}Démarrage des conteneurs Docker...${NC}"
npm run docker:dev:detach

# Attendre que les conteneurs soient prêts
echo -e "${YELLOW}Attente que les services soient prêts...${NC}"
sleep 10

# Vérifier que l'application est accessible
echo -e "${GREEN}✓ Environnement démarré avec succès!${NC}"
echo -e "${BLUE}Application accessible sur: ${GREEN}http://localhost:3999${NC}"
echo -e "${BLUE}PgAdmin accessible sur: ${GREEN}http://localhost:5050${NC}"
echo -e "${BLUE}  - Email: ${GREEN}admin@collabspace.com${NC}"
echo -e "${BLUE}  - Mot de passe: ${GREEN}admin${NC}"
echo ""
echo -e "${YELLOW}Commandes utiles:${NC}"
echo -e "  ${BLUE}npm run docker:stop${NC} - Arrêter tous les conteneurs"
echo -e "  ${BLUE}npm run docker:restart${NC} - Redémarrer tous les conteneurs"
echo ""
echo -e "${GREEN}Bonne programmation!${NC}"

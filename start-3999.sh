#!/bin/bash

# Script pour démarrer l'application sur le port 3999
echo "🚀 Démarrage de NovaSpace sur le port 3999..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Port configuré: ${GREEN}3999${NC}"
echo -e "${BLUE}URL de l'application: ${GREEN}http://localhost:3999${NC}"
echo ""

# Vérifier si le port 3999 est disponible
if lsof -Pi :3999 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}⚠️  Le port 3999 est déjà utilisé!${NC}"
    echo -e "${YELLOW}Voulez-vous arrêter le processus qui utilise ce port? (y/n)${NC}"
    read -r response
    if [[ "$response" = "y" || "$response" = "Y" ]]; then
        lsof -ti:3999 | xargs kill -9
        echo -e "${GREEN}✓ Port 3999 libéré${NC}"
    else
        echo -e "${RED}Annulation du démarrage${NC}"
        exit 1
    fi
fi

# Démarrer l'application
echo -e "${YELLOW}Démarrage de l'application...${NC}"
npm run dev

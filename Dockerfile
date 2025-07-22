# Dockerfile multi-stage pour Next.js avec optimisations
FROM node:20-alpine AS base

# Installer les dépendances système nécessaires
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage 1: Installation des dépendances
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build de l'application
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 3: Runner pour la production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Définir les permissions appropriées
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copier les fichiers de build automatiquement
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# Stage 4: Développement avec hot reload
FROM base AS development
WORKDIR /app

# Installer git pour npm install et OpenSSL pour Prisma
RUN apk add --no-cache git openssl openssl-dev

COPY package.json package-lock.json* ./
RUN npm install && npm install --save \
    react \
    react-dom \
    next \
    @types/react \
    @types/react-dom \
    @types/node \
    typescript \
    tailwindcss \
    postcss \
    autoprefixer \
    prisma \
    @prisma/client \
    zustand \
    @tanstack/react-query \
    next-auth \
    socket.io-client \
    framer-motion \
    lucide-react \
    react-hook-form \
    zod \
    @radix-ui/react-slot \
    class-variance-authority \
    clsx \
    tailwind-merge \
    @radix-ui/react-toast \
    @hookform/resolvers \
    bcryptjs \
    @types/bcryptjs \
    jsonwebtoken \
    @types/jsonwebtoken

RUN apk add --no-cache netcat-openbsd

# Copier le code source (incluant prisma/)
COPY . .

# Générer le client Prisma avec les bons engines
RUN npx prisma generate

# Ajouter le script d'entrée
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exposer le port
EXPOSE 3000

# Utiliser le script d'entrée pour initialiser et démarrer l'application
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

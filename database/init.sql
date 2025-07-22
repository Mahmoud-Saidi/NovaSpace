-- Init SQL pour PostgreSQL
-- Création des extensions nécessaires

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extension pour full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Extension pour des fonctions additionnelles
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Créer des index pour améliorer les performances
-- Les index seront créés automatiquement par Prisma, mais on peut en ajouter des personnalisés ici

-- Index pour la recherche full-text
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_search 
-- ON projects USING gin(to_tsvector('english', name || ' ' || coalesce(description, '')));

-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_search 
-- ON tasks USING gin(to_tsvector('english', title || ' ' || coalesce(description, '')));

-- Fonctions utilitaires
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Données de test (optionnel)
-- Sera remplacé par les seeds Prisma

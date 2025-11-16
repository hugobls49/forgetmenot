#!/bin/bash

echo "==================================="
echo "ForgetMeNot - Reconstruction V2.0"
echo "==================================="
echo ""

# Arrêter les conteneurs existants
echo "📦 Arrêt des conteneurs existants..."
docker-compose down

# Nettoyer les images
echo "🧹 Nettoyage..."
docker-compose rm -f

# Reconstruire les images
echo "🔨 Reconstruction des images Docker..."
docker-compose build --no-cache

# Démarrer les services
echo "🚀 Démarrage des services..."
docker-compose up -d

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 10

# Appliquer les migrations
echo "🗄️  Application des migrations Prisma..."
docker-compose exec -T backend npx prisma migrate dev --name refonte-notes

# Générer le client Prisma
echo "⚙️  Génération du client Prisma..."
docker-compose exec -T backend npx prisma generate

echo ""
echo "✅ Installation terminée !"
echo ""
echo "📱 Frontend : http://localhost:5173"
echo "🔧 Backend  : http://localhost:3000"
echo ""
echo "Pour voir les logs :"
echo "  docker-compose logs -f"
echo ""
echo "Pour créer un utilisateur de test :"
echo "  docker-compose exec backend npm run seed"
echo ""


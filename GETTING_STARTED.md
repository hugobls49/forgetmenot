# 🚀 Guide de Démarrage - ForgetMeNot

Bienvenue sur ForgetMeNot, votre application de mémorisation par répétition espacée !

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 18+ ([télécharger](https://nodejs.org/))
- **PostgreSQL** 14+ ([télécharger](https://www.postgresql.org/download/))
- **npm** ou **yarn**

**OU**

- **Docker** et **Docker Compose** ([télécharger](https://www.docker.com/))

## 🐳 Option 1 : Démarrage avec Docker (Recommandé)

La façon la plus simple de lancer l'application complète :

```bash
# Cloner le projet (si ce n'est pas déjà fait)
cd forgetmenot

# Lancer tous les services
docker-compose up -d

# Attendre que tout soit prêt (environ 30 secondes)
# Puis accéder à :
# - Frontend : http://localhost:5173
# - Backend API : http://localhost:3000
# - Documentation API : http://localhost:3000/api
```

### Arrêter les services

```bash
docker-compose down
```

### Voir les logs

```bash
docker-compose logs -f
```

## 💻 Option 2 : Démarrage en développement local

### 1. Configuration de la base de données

Créez une base de données PostgreSQL :

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE forgetmenot;

# Créer l'utilisateur
CREATE USER forgetmenot WITH PASSWORD 'forgetmenot_password';

# Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE forgetmenot TO forgetmenot;

# Quitter
\q
```

### 2. Configuration du Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer le fichier .env avec vos configurations
# Important : Modifier JWT_SECRET et JWT_REFRESH_SECRET en production !

# Générer le client Prisma
npx prisma generate

# Lancer les migrations
npx prisma migrate dev

# (Optionnel) Ouvrir Prisma Studio pour voir la base de données
npx prisma studio

# Démarrer le serveur de développement
npm run start:dev
```

Le backend sera accessible sur **http://localhost:3000**

### 3. Configuration du Frontend

Dans un **nouveau terminal** :

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur **http://localhost:5173**

## 🎯 Premiers pas

### 1. Créer un compte

1. Accédez à http://localhost:5173
2. Cliquez sur "S'inscrire"
3. Remplissez le formulaire
4. Vous serez automatiquement connecté

### 2. Créer votre première catégorie

1. Allez dans "Catégories" dans le menu
2. Cliquez sur "+ Nouvelle catégorie"
3. Donnez-lui un nom et une couleur
4. Enregistrez

### 3. Créer votre première carte

1. Allez dans "Mes cartes"
2. Cliquez sur "+ Nouvelle carte"
3. Remplissez la question et la réponse
4. (Optionnel) Ajoutez un indice, une catégorie et des tags
5. Enregistrez

### 4. Réviser vos cartes

1. Allez dans "Réviser" ou cliquez sur "Commencer la révision" depuis le tableau de bord
2. Lisez la question
3. Cliquez sur "Voir la réponse"
4. Évaluez votre réponse :
   - ❌ **À revoir** : Vous ne saviez pas du tout
   - 😓 **Difficile** : Vous avez eu du mal
   - ✅ **Bon** : Vous avez bien répondu
   - 😎 **Facile** : C'était très facile

L'algorithme SM-2 calculera automatiquement quand vous devrez réviser cette carte !

## 📚 Structure du Projet

```
forgetmenot/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── auth/        # Authentification JWT
│   │   ├── cards/       # Gestion des cartes
│   │   ├── reviews/     # Système de révision
│   │   ├── categories/  # Catégories
│   │   ├── stats/       # Statistiques
│   │   └── common/      # Algorithme SM-2
│   └── prisma/          # Schéma de base de données
│
├── frontend/            # Application React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── services/    # Services API
│   │   ├── store/       # State management (Zustand)
│   │   └── lib/         # Utilitaires
│   └── public/
│
└── docker-compose.yml   # Configuration Docker
```

## 🔧 Scripts utiles

### Backend

```bash
# Lancer les tests
npm run test

# Lancer les tests e2e
npm run test:e2e

# Formater le code
npm run format

# Linter
npm run lint

# Build pour production
npm run build

# Lancer en production
npm run start:prod
```

### Frontend

```bash
# Build pour production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

## 📧 Configuration des emails (Optionnel)

Pour activer les notifications par email :

1. Éditez `backend/.env`
2. Configurez les variables SMTP :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app
```

Pour Gmail, vous devez créer un "Mot de passe d'application" :
1. Allez dans les paramètres de votre compte Google
2. Sécurité > Validation en deux étapes
3. Mots de passe des applications

## 🎨 Personnalisation

### Modifier les couleurs

Éditez `frontend/tailwind.config.js` :

```javascript
colors: {
  primary: {
    // Vos couleurs personnalisées
  }
}
```

### Modifier l'algorithme de répétition

L'algorithme SM-2 se trouve dans :
`backend/src/common/algorithms/spaced-repetition.service.ts`

## 🐛 Dépannage

### Le backend ne démarre pas

- Vérifiez que PostgreSQL est lancé
- Vérifiez la chaîne de connexion dans `.env`
- Essayez de supprimer `node_modules` et réinstaller

### Les migrations Prisma échouent

```bash
# Réinitialiser la base de données (ATTENTION : supprime toutes les données)
npx prisma migrate reset

# Puis relancer les migrations
npx prisma migrate dev
```

### Le frontend ne se connecte pas au backend

- Vérifiez que le backend tourne sur le port 3000
- Vérifiez la variable `VITE_API_URL` dans `frontend/.env`

### Erreur CORS

Vérifiez que `FRONTEND_URL` dans `backend/.env` correspond à l'URL de votre frontend.

## 📖 Documentation API

Une fois le backend lancé, accédez à la documentation Swagger sur :
**http://localhost:3000/api**

Vous y trouverez tous les endpoints disponibles avec des exemples.

## 🚀 Déploiement en production

### Backend

1. **Railway / Render / Heroku**
   - Connectez votre repo GitHub
   - Configurez les variables d'environnement
   - Ajoutez une base de données PostgreSQL

2. **VPS**
   - Installez Node.js et PostgreSQL
   - Clonez le repo
   - Configurez nginx comme reverse proxy
   - Utilisez PM2 pour garder l'app en vie

### Frontend

1. **Vercel** (recommandé)
   ```bash
   cd frontend
   vercel
   ```

2. **Netlify**
   - Connectez votre repo
   - Build command : `npm run build`
   - Publish directory : `dist`

## 🤝 Besoin d'aide ?

- 📖 Lisez la documentation complète dans le README.md
- 🐛 Signalez un bug dans les issues GitHub
- 💡 Proposez une amélioration

## 🎉 Bon apprentissage !

N'oubliez pas : la régularité est la clé de la mémorisation. Essayez de réviser un peu chaque jour plutôt que beaucoup en une seule fois !

**ForgetMeNot - Ne laissez plus rien vous échapper** 🧠✨


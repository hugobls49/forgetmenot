# ForgetMeNot - Application de Mémorisation par Répétition Espacée

Application web moderne permettant aux utilisateurs de mémoriser des informations grâce à un algorithme de répétition espacée personnalisé.

## 🚀 Fonctionnalités

- ✅ Authentification sécurisée (JWT)
- 📝 Gestion complète des cartes de révision (CRUD)
- 🧠 Algorithme de répétition espacée (basé sur SM-2)
- 📊 Tableau de bord avec statistiques de progression
- 🔔 Notifications par email pour les révisions
- 📱 Interface responsive (mobile-first)
- 🏷️ Catégorisation et tags des informations

## 🛠️ Stack Technique

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build
- **React Router DOM** pour la navigation
- **TanStack Query** (React Query) pour la gestion des données
- **Tailwind CSS** pour le design
- **React Hook Form** + **Zod** pour les formulaires
- **Axios** pour les requêtes HTTP

### Backend
- **NestJS** avec TypeScript
- **PostgreSQL** comme base de données
- **Prisma** comme ORM
- **Passport.js** + **JWT** pour l'authentification
- **Nodemailer** pour les emails
- **Class Validator** pour la validation

## 📦 Structure du Projet

```
forgetmenot/
├── backend/           # API NestJS
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/          # Application React
│   ├── src/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd forgetmenot
```

2. **Installer les dépendances du backend**
```bash
cd backend
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer le fichier .env avec vos configurations
```

4. **Lancer les migrations de base de données**
```bash
npx prisma migrate dev
```

5. **Démarrer le backend**
```bash
npm run start:dev
```

6. **Dans un nouveau terminal, installer les dépendances du frontend**
```bash
cd frontend
npm install
```

7. **Démarrer le frontend**
```bash
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend API : http://localhost:3000
- Swagger API Docs : http://localhost:3000/api

## 🐳 Docker

Pour lancer l'application avec Docker :

```bash
docker-compose up -d
```

## 📚 Documentation API

Une fois le backend lancé, accédez à la documentation Swagger sur :
http://localhost:3000/api

## 🧪 Tests

### Backend
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend
```bash
cd frontend
npm run test
```

## 🔒 Sécurité

- Mots de passe chiffrés avec bcrypt
- Authentification JWT avec refresh tokens
- Validation et sanitization des entrées
- CORS configuré
- Rate limiting sur les endpoints sensibles
- HTTPS en production

## 📱 Roadmap

- [ ] Version web complète
- [ ] PWA avec notifications push
- [ ] Application mobile React Native (iOS/Android)
- [ ] Synchronisation multi-appareils
- [ ] Mode hors ligne
- [ ] Import/Export de données
- [ ] Partage de decks de cartes

## 📄 Licence

MIT

## 👤 Auteur

Hugo Blois

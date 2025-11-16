# Refonte ForgetMeNot - Version 2.0

## Vue d'ensemble

L'application a été complètement repensée pour adopter une approche plus simple et intuitive : **écrire des notes et les relire au bon moment**.

## Changements majeurs

### 1. Modèle de données simplifié

#### Avant : Système de flashcards
- Question/Réponse
- Algorithme SM-2 complexe
- Niveaux de difficulté (facile, moyen, difficile)
- Calculs d'intervalles dynamiques

#### Après : Système de notes simples
- **Note** : titre (optionnel) + contenu + tags + catégorie
- **Intervalles fixes** : 1, 3, 7, 14, 30, 60, 90, 180, 365 jours
- **Compteur de lectures** : incrémenté à chaque relecture
- **Dates** : création, dernière lecture, prochaine lecture

### 2. Architecture backend

#### Nouveaux modules
- `NotesModule` : remplace `CardsModule` et `ReviewsModule`
- `ReadingReminderService` : gère les intervalles de relecture (remplace `SpacedRepetitionService`)

#### API simplifiée
```
POST   /notes          - Créer une note
GET    /notes          - Liste des notes (avec filtre par catégorie)
GET    /notes/due      - Notes à relire aujourd'hui
GET    /notes/stats    - Statistiques des notes
GET    /notes/:id      - Détail d'une note
PATCH  /notes/:id      - Modifier une note
POST   /notes/:id/read - Marquer comme lue
DELETE /notes/:id      - Supprimer une note
```

### 3. Nouvelle interface utilisateur

#### Palette de couleurs
- **Couleur principale** : `#FFE9D0` (crème/beige)
- **Couleur secondaire** : `#D9D9D9` (gris clair)
- **Texte principal** : `#4A4A4A` (gris foncé)
- **Texte secondaire** : `#8A8A8A` (gris moyen)

#### Design
- **Style** : Minimaliste et sobre
- **Suppression** : Tous les émojis et émoticônes
- **Typographie** : Simple et lisible
- **Interactions** : Subtiles et discrètes

#### Pages refaites
1. **Accueil** (`/dashboard`)
   - Statistiques : total notes, à relire, lues aujourd'hui
   - Aperçu des notes à relire
   - Bouton d'action principal

2. **Mes notes** (`/notes`)
   - Liste de toutes les notes
   - Filtrage par catégorie
   - Création/édition dans un modal sobre
   - Informations : nombre de lectures, prochaine date

3. **À relire** (`/review`)
   - Affichage de la note en plein écran
   - Progression visuelle simple
   - Bouton "Note lue" pour valider
   - Navigation entre les notes

4. **Authentification** (`/login`, `/register`)
   - Design épuré
   - Bordures simples
   - Boutons sobres

#### Navigation
- **Sidebar simplifiée** : Accueil, Mes notes, À relire, Catégories
- **Navbar épurée** : Logo simple, nom utilisateur, paramètres, déconnexion

### 4. Notifications

#### Email de bienvenue
- Design sobre avec les nouvelles couleurs
- Message simple et direct
- Pas d'émojis

#### Rappels quotidiens
- "X note(s) à relire aujourd'hui"
- Design minimaliste
- Call-to-action clair

### 5. Algorithme de relecture

```typescript
// Intervalles fixes en jours
const intervals = [1, 3, 7, 14, 30, 60, 90, 180, 365];

// À chaque relecture :
readCount++;
nextReadDate = today + intervals[min(readCount, intervals.length - 1)];
```

**Exemple de progression** :
- Création : relecture demain (J+1)
- 1ère relecture : dans 3 jours (J+3)
- 2ème relecture : dans 7 jours (J+7)
- 3ème relecture : dans 14 jours (J+14)
- etc.

## Migration

### Base de données

1. **Sauvegarder l'ancienne base** :
   ```bash
   docker-compose exec db pg_dump -U forgetmenot forgetmenot > backup.sql
   ```

2. **Appliquer le nouveau schéma** :
   ```bash
   cd backend
   npx prisma migrate dev --name refonte-notes
   ```

3. **Générer le client Prisma** :
   ```bash
   npx prisma generate
   ```

### Frontend

Aucune migration nécessaire - les anciennes pages ont été remplacées.

## Démarrage

```bash
# Arrêter les conteneurs existants
docker-compose down

# Nettoyer et reconstruire
docker-compose build --no-cache

# Démarrer
docker-compose up

# Dans un autre terminal : migrations
docker-compose exec backend npx prisma migrate dev

# Seed (optionnel)
docker-compose exec backend npm run seed
```

## Structure des fichiers

### Backend (nouveaux/modifiés)
```
backend/src/
├── notes/
│   ├── notes.module.ts
│   ├── notes.service.ts
│   ├── notes.controller.ts
│   └── dto/
│       ├── create-note.dto.ts
│       ├── update-note.dto.ts
│       └── mark-as-read.dto.ts
├── common/algorithms/
│   └── reading-reminder.service.ts
└── notifications/
    └── notifications.service.ts (modifié)
```

### Frontend (nouveaux/modifiés)
```
frontend/src/
├── pages/
│   ├── DashboardPage-new.tsx
│   ├── NotesPage.tsx
│   ├── ReviewPage-new.tsx
│   └── auth/
│       ├── LoginPage.tsx (modifié)
│       └── RegisterPage.tsx (modifié)
├── services/
│   └── notesService.ts
├── components/layout/
│   ├── Navbar.tsx (modifié)
│   ├── Sidebar.tsx (modifié)
│   └── Layout.tsx (modifié)
└── tailwind.config.js (modifié)
```

## Prochaines étapes

1. **Tests** : Tester toutes les fonctionnalités
2. **Migration des données** : Script pour convertir les anciennes "cards" en "notes" (si nécessaire)
3. **Documentation utilisateur** : Guide d'utilisation
4. **Optimisations** : Performance et UX
5. **Mobile** : Adaptation responsive (déjà prévu)

## Notes techniques

- Le nouveau schéma Prisma est **beaucoup plus simple** (4 modèles principaux au lieu de 8)
- L'algorithme de relecture est **prévisible** et **transparent**
- Le code est **plus maintenable** et **plus facile à comprendre**
- L'interface est **plus rapide** à charger et **plus agréable** à utiliser


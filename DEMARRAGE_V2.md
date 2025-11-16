# ForgetMeNot V2.0 - Guide de démarrage

## 🎉 Bienvenue dans la nouvelle version !

L'application a été complètement repensée selon vos spécifications :
- ✅ Système de **notes simples** au lieu de flashcards
- ✅ **Rappels automatiques** pour relire vos notes
- ✅ Interface **sobre et minimaliste**
- ✅ Nouvelles couleurs : `#FFE9D0` et `#D9D9D9`
- ✅ **Zéro émoji** dans l'interface

## 🚀 Installation et démarrage

### Option 1 : Script automatique

```bash
# Rendre le script exécutable
chmod +x rebuild.sh

# Lancer la reconstruction
./rebuild.sh
```

### Option 2 : Commandes manuelles

```bash
# 1. Arrêter les conteneurs
docker-compose down

# 2. Reconstruire
docker-compose build --no-cache

# 3. Démarrer
docker-compose up -d

# 4. Attendre 10 secondes que la base soit prête
sleep 10

# 5. Appliquer les migrations
docker-compose exec backend npx prisma migrate dev --name refonte-notes

# 6. Générer le client Prisma
docker-compose exec backend npx prisma generate

# 7. (Optionnel) Créer des données de test
docker-compose exec backend npm run seed
```

## 📱 Accès à l'application

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000

## 🎯 Utilisation

### Créer une note

1. Connectez-vous ou créez un compte
2. Cliquez sur "Mes notes" dans la sidebar
3. Cliquez sur "Nouvelle note"
4. Écrivez votre contenu (le titre est optionnel)
5. Choisissez une catégorie (optionnel)
6. Cliquez sur "Créer"

### Relire vos notes

1. Allez sur "Accueil" pour voir le nombre de notes à relire
2. Cliquez sur "Commencer la relecture" ou allez sur "À relire"
3. Lisez la note
4. Cliquez sur "Note lue"
5. La note sera automatiquement reprogrammée selon l'algorithme :
   - 1ère lecture → relecture dans 1 jour
   - 2ème lecture → relecture dans 3 jours
   - 3ème lecture → relecture dans 7 jours
   - etc.

### Notifications par email

Les notifications sont configurées dans votre profil (Paramètres).
Vous recevrez un email quotidien si vous avez des notes à relire.

## 📊 Nouveaux endpoints API

```
POST   /notes              - Créer une note
GET    /notes              - Liste des notes
GET    /notes/due          - Notes à relire aujourd'hui
GET    /notes/stats        - Statistiques
GET    /notes/:id          - Détail d'une note
PATCH  /notes/:id          - Modifier une note
POST   /notes/:id/read     - Marquer comme lue
DELETE /notes/:id          - Supprimer une note
```

## 🐛 Dépannage

### Le frontend ne charge pas

```bash
# Vérifier les logs
docker-compose logs frontend

# Reconstruire uniquement le frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Erreur de base de données

```bash
# Réinitialiser la base de données
docker-compose down -v
docker-compose up -d db
sleep 10
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma generate
```

### Voir les logs en temps réel

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 📝 Documentation complète

- **Détails techniques** : Voir `REFONTE_V2.md`
- **Guide original** : Voir `GETTING_STARTED.md`
- **Architecture** : Voir `PROJECT_SUMMARY.md`

## ✨ Ce qui a changé

### Avant → Après

| Avant | Après |
|-------|-------|
| Flashcards (Question/Réponse) | Notes (Titre + Contenu) |
| Algorithme SM-2 complexe | Intervalles fixes simples |
| 3 niveaux de difficulté | Marquage "lu" simple |
| Interface avec émojis | Design sobre et minimal |
| Couleurs vives (bleu/violet) | Couleurs douces (crème/gris) |
| Page "Mes cartes" | Page "Mes notes" |
| "Réviser" | "À relire" |

## 🎨 Palette de couleurs

- **Crème** : `#FFE9D0` - Couleur principale, boutons, highlights
- **Gris clair** : `#D9D9D9` - Bordures, backgrounds secondaires
- **Gris foncé** : `#4A4A4A` - Texte principal
- **Gris moyen** : `#8A8A8A` - Texte secondaire

## 💡 Conseils d'utilisation

1. **Écrivez des notes courtes** : Plus facile à relire
2. **Utilisez des catégories** : Pour organiser vos notes
3. **Relisez régulièrement** : La régularité est la clé
4. **Ne sautez pas de révisions** : Suivez l'algorithme

## 🔄 Intervalles de relecture

```
Lecture 0 → +1 jour    (demain)
Lecture 1 → +3 jours
Lecture 2 → +7 jours   (1 semaine)
Lecture 3 → +14 jours  (2 semaines)
Lecture 4 → +30 jours  (1 mois)
Lecture 5 → +60 jours  (2 mois)
Lecture 6 → +90 jours  (3 mois)
Lecture 7 → +180 jours (6 mois)
Lecture 8+ → +365 jours (1 an)
```

Bon apprentissage avec ForgetMeNot ! 🎓


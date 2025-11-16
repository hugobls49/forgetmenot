# 📡 Exemples d'utilisation de l'API ForgetMeNot

Ce document fournit des exemples pratiques d'utilisation de l'API.

## 🔐 Authentification

### Inscription

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Réponse :
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Rafraîchir le token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: Bearer REFRESH_TOKEN"
```

### Déconnexion

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## 👤 Utilisateurs

### Obtenir son profil

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Mettre à jour son profil

```bash
curl -X PUT http://localhost:3000/api/users/me \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

### Obtenir ses paramètres

```bash
curl -X GET http://localhost:3000/api/users/settings \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Mettre à jour ses paramètres

```bash
curl -X PUT http://localhost:3000/api/users/settings \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emailNotifications": true,
    "dailyReminderTime": "09:00",
    "weeklyGoal": 50
  }'
```

## 🏷️ Catégories

### Créer une catégorie

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Géographie",
    "color": "#3B82F6",
    "description": "Capitales et pays du monde"
  }'
```

### Lister les catégories

```bash
curl -X GET http://localhost:3000/api/categories \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Obtenir une catégorie

```bash
curl -X GET http://localhost:3000/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Modifier une catégorie

```bash
curl -X PUT http://localhost:3000/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Géographie mondiale",
    "color": "#10B981"
  }'
```

### Supprimer une catégorie

```bash
curl -X DELETE http://localhost:3000/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## 🗂️ Cartes

### Créer une carte

```bash
curl -X POST http://localhost:3000/api/cards \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Quelle est la capitale de la France ?",
    "answer": "Paris",
    "hint": "Ville lumière",
    "tags": ["europe", "capitale"],
    "categoryId": "CATEGORY_ID"
  }'
```

### Lister toutes les cartes

```bash
curl -X GET http://localhost:3000/api/cards \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Filtrer les cartes

```bash
# Par catégorie
curl -X GET "http://localhost:3000/api/cards?categoryId=CATEGORY_ID" \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Par recherche
curl -X GET "http://localhost:3000/api/cards?search=France" \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Par tags
curl -X GET "http://localhost:3000/api/cards?tags=europe&tags=capitale" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Obtenir les cartes à réviser

```bash
curl -X GET http://localhost:3000/api/cards/due \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Obtenir les statistiques des cartes

```bash
curl -X GET http://localhost:3000/api/cards/statistics \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Obtenir une carte

```bash
curl -X GET http://localhost:3000/api/cards/CARD_ID \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Modifier une carte

```bash
curl -X PUT http://localhost:3000/api/cards/CARD_ID \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Quelle est la capitale de l'\''Italie ?",
    "answer": "Rome",
    "tags": ["europe", "capitale", "italie"]
  }'
```

### Supprimer une carte

```bash
curl -X DELETE http://localhost:3000/api/cards/CARD_ID \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## ✅ Révisions

### Réviser une carte

```bash
curl -X POST http://localhost:3000/api/reviews/CARD_ID \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quality": "GOOD",
    "timeSpent": 15
  }'
```

**Qualités disponibles :**
- `AGAIN` : Échec total (intervalle réinitialisé)
- `HARD` : Difficile (intervalle réduit)
- `GOOD` : Bon (intervalle normal)
- `EASY` : Facile (intervalle augmenté)

Réponse :
```json
{
  "card": {
    "id": "uuid",
    "question": "Question...",
    "easeFactor": 2.6,
    "interval": 6,
    "repetitions": 2,
    "nextReview": "2024-01-15T00:00:00.000Z"
  },
  "nextReviewDate": "2024-01-15T00:00:00.000Z",
  "mastery": 45
}
```

### Obtenir l'historique de révision

```bash
# Tout l'historique
curl -X GET http://localhost:3000/api/reviews \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Historique d'une carte spécifique
curl -X GET "http://localhost:3000/api/reviews?cardId=CARD_ID" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## 📊 Statistiques

### Tableau de bord

```bash
curl -X GET http://localhost:3000/api/stats/dashboard \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

Réponse :
```json
{
  "totalCards": {
    "total": 50,
    "newCards": 10,
    "learning": 25,
    "mastered": 15
  },
  "dueToday": 8,
  "reviewsToday": 5,
  "streak": 7,
  "weeklyStats": [...],
  "categoryStats": [...]
}
```

### Progrès détaillé

```bash
curl -X GET http://localhost:3000/api/stats/progress \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Rapport mensuel

```bash
curl -X GET "http://localhost:3000/api/stats/monthly?year=2024&month=1" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## 🧪 Exemple de workflow complet

```bash
# 1. Inscription
ACCESS_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.accessToken')

# 2. Créer une catégorie
CATEGORY_ID=$(curl -s -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","color":"#3B82F6"}' \
  | jq -r '.id')

# 3. Créer une carte
CARD_ID=$(curl -s -X POST http://localhost:3000/api/cards \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"Test?\",\"answer\":\"Test!\",\"categoryId\":\"$CATEGORY_ID\"}" \
  | jq -r '.id')

# 4. Réviser la carte
curl -X POST "http://localhost:3000/api/reviews/$CARD_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quality":"GOOD","timeSpent":10}'

# 5. Voir les statistiques
curl -X GET http://localhost:3000/api/stats/dashboard \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## 🔄 Algorithme de répétition espacée (SM-2)

L'API utilise l'algorithme SM-2 pour calculer les intervalles de révision :

1. **Première révision** : 1 jour
2. **Deuxième révision** : 6 jours
3. **Suivantes** : intervalle précédent × facteur de facilité

Le facteur de facilité est ajusté selon la qualité de la réponse :
- **EASY** : augmente le facteur et l'intervalle
- **GOOD** : maintient le facteur
- **HARD** : réduit légèrement le facteur
- **AGAIN** : réinitialise complètement la progression

## 📝 Notes importantes

- Tous les endpoints (sauf auth) nécessitent un token d'authentification
- Les tokens d'accès expirent après 15 minutes
- Utilisez le refresh token pour obtenir un nouveau token d'accès
- Les dates sont au format ISO 8601
- Les IDs sont des UUID v4

## 🔍 Documentation complète

Pour la documentation complète et interactive, visitez :
**http://localhost:3000/api** (Swagger UI)


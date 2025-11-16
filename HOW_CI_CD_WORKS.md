# Comment fonctionne le pipeline CI/CD

Ce guide explique en détail comment le pipeline CI/CD fonctionne pour ForgetMeNot.

## 🎯 Vue d'ensemble

Le pipeline CI/CD s'exécute automatiquement à chaque fois que vous :
- **Poussez du code** vers les branches `main` ou `develop`
- **Créez une Pull Request** vers `main` ou `develop`

## 📊 Flux du pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    Push / Pull Request                       │
└──────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │   GitHub Actions déclenché    │
        └───────────────┬───────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐              ┌───────────────┐
│ Backend Lint  │              │ Frontend Lint │
│ (Parallèle)   │              │ (Parallèle)   │
└───────┬───────┘              └───────┬───────┘
        │                               │
        └───────────────┬───────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │  Backend Tests  │
              │  (si lint OK)   │
              └────────┬─────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Docker Build   │
              │  (si tests OK)  │
              └────────┬─────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Docker Push    │
              │  (uniquement    │
              │   sur main)     │
              └─────────────────┘
```

## 🔄 Workflows disponibles

### 1. **CI/CD Pipeline** (`ci.yml`)

Le workflow principal qui s'exécute sur chaque push/PR.

#### Jobs exécutés (dans l'ordre) :

**1. Backend Lint** (Job parallèle)
- ✅ Vérifie le code avec ESLint
- ✅ Vérifie le formatage avec Prettier
- ⏱️ Durée : ~2-3 minutes

**2. Frontend Lint** (Job parallèle)
- ✅ Vérifie le code avec ESLint
- ✅ Vérifie les types TypeScript
- ⏱️ Durée : ~2-3 minutes

**3. Backend Tests** (Dépend de Backend Lint)
- ✅ Lance une base de données PostgreSQL de test
- ✅ Exécute les migrations Prisma
- ✅ Lance les tests Jest
- ⏱️ Durée : ~3-5 minutes

**4. Docker Build** (Dépend de Backend Lint + Frontend Lint)
- ✅ Construit l'image Docker du backend
- ✅ Construit l'image Docker du frontend
- ✅ Utilise le cache pour accélérer
- ⏱️ Durée : ~5-10 minutes

**5. Docker Push** (Uniquement sur `main`, dépend de Docker Build)
- ✅ Push l'image backend vers Docker Hub
- ✅ Push l'image frontend vers Docker Hub
- ⚠️ Nécessite les secrets `DOCKER_USERNAME` et `DOCKER_PASSWORD`
- ⏱️ Durée : ~3-5 minutes

### 2. **Docker Compose Integration Test** (`docker-compose-test.yml`)

Teste l'application complète avec Docker Compose.

**Étapes :**
1. Démarre tous les services (postgres, backend, frontend)
2. Attend que les services soient prêts
3. Vérifie que le backend répond
4. Vérifie que le frontend répond
5. Exécute les migrations de base de données
6. Teste la connexion à la base de données
7. Nettoie (arrête tous les services)

⏱️ Durée : ~5-8 minutes

### 3. **Deploy** (`deploy.yml`)

Déploiement automatique ou manuel.

**Déclenchement :**
- Automatique : Après un workflow CI réussi sur `main`
- Manuel : Via "Run workflow" dans l'onglet Actions

**Environnements disponibles :**
- `staging`
- `production`

⏱️ Durée : Variable (selon votre configuration de déploiement)

## 🚀 Comment ça fonctionne en pratique

### Scénario 1 : Push sur `develop`

```
1. Vous poussez du code :
   git push origin develop

2. GitHub détecte le push et déclenche le workflow

3. Les jobs s'exécutent :
   ✅ backend-lint (parallèle)
   ✅ frontend-lint (parallèle)
   ✅ backend-test (après backend-lint)
   ✅ docker-build (après les lints)

4. Résultat visible dans l'onglet "Actions"
```

### Scénario 2 : Pull Request vers `main`

```
1. Vous créez une PR :
   git checkout -b feature/ma-feature
   git push origin feature/ma-feature
   # Créez la PR sur GitHub

2. GitHub détecte la PR et déclenche le workflow

3. Les jobs s'exécutent (même chose que scénario 1)

4. Vous voyez le statut directement sur la PR :
   ✅ Tous les checks passent → PR peut être mergée
   ❌ Un check échoue → Corrigez et poussez à nouveau
```

### Scénario 3 : Push sur `main`

```
1. Vous mergez une PR ou poussez directement sur main

2. GitHub déclenche le workflow complet

3. Tous les jobs s'exécutent + Docker Push

4. Les images sont poussées vers Docker Hub :
   - votre-username/forgetmenot-backend:latest
   - votre-username/forgetmenot-backend:sha-commit
   - votre-username/forgetmenot-frontend:latest
   - votre-username/forgetmenot-frontend:sha-commit

5. Le workflow Deploy se déclenche automatiquement
```

## 📈 Voir le statut en temps réel

### Dans GitHub

1. **Onglet Actions** :
   - Allez sur votre repository GitHub
   - Cliquez sur l'onglet "Actions"
   - Vous voyez tous les workflows et leur statut

2. **Sur une Pull Request** :
   - Les checks apparaissent directement sous la PR
   - ✅ Vert = réussi
   - ❌ Rouge = échoué
   - 🟡 Jaune = en cours

3. **Badge de statut** :
   - Ajoutez dans votre README :
   ```markdown
   ![CI](https://github.com/votre-username/forgetmenot/workflows/CI%2FCD%20Pipeline/badge.svg)
   ```

## 🔍 Détails des étapes

### Backend Lint

```yaml
1. Checkout le code
2. Installe Node.js 18
3. Installe les dépendances (npm ci)
4. Lance ESLint (npm run lint)
5. Vérifie le formatage (npm run format --check)
```

**Si ça échoue :**
- Erreurs de linting → Corrigez avec `npm run lint --fix`
- Erreurs de formatage → Corrigez avec `npm run format`

### Frontend Lint

```yaml
1. Checkout le code
2. Installe Node.js 18
3. Installe les dépendances (npm ci)
4. Lance ESLint (npm run lint)
5. Vérifie les types TypeScript (tsc --noEmit)
```

**Si ça échoue :**
- Erreurs de linting → Corrigez avec `npm run lint`
- Erreurs de types → Corrigez les erreurs TypeScript

### Backend Tests

```yaml
1. Démarre PostgreSQL 15 dans un conteneur
2. Checkout le code
3. Installe Node.js et les dépendances
4. Génère le client Prisma
5. Exécute les migrations
6. Lance les tests Jest
```

**Si ça échoue :**
- Vérifiez vos tests localement : `npm test`
- Vérifiez la connexion à la base de données

### Docker Build

```yaml
1. Setup Docker Buildx
2. Build l'image backend (avec cache)
3. Build l'image frontend (avec cache)
```

**Si ça échoue :**
- Vérifiez vos Dockerfiles
- Vérifiez les logs détaillés dans le workflow

### Docker Push

```yaml
1. Login à Docker Hub (avec secrets)
2. Build et push backend:latest
3. Build et push backend:sha
4. Build et push frontend:latest
5. Build et push frontend:sha
```

**Si ça échoue :**
- Vérifiez que les secrets sont configurés
- Vérifiez vos permissions Docker Hub

## ⚙️ Configuration requise

### Secrets GitHub (pour Docker Push)

Si vous voulez pousser vers Docker Hub :

1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Ajoutez :
   - `DOCKER_USERNAME` : Votre nom d'utilisateur Docker Hub
   - `DOCKER_PASSWORD` : Votre token Docker Hub

**Comment créer un token Docker Hub :**
1. Allez sur https://hub.docker.com/settings/security
2. Cliquez sur "New Access Token"
3. Donnez-lui un nom (ex: "github-actions")
4. Copiez le token et ajoutez-le comme secret

### Secrets pour le déploiement (optionnel)

Si vous configurez le déploiement SSH :
- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`

## 🐛 Dépannage

### Le workflow ne se déclenche pas

**Vérifiez :**
- ✅ Vous avez bien poussé vers `main` ou `develop`
- ✅ Le fichier `.github/workflows/ci.yml` est présent
- ✅ Le fichier est bien formaté (YAML valide)

### Un job échoue

**Étapes de dépannage :**
1. Cliquez sur le workflow dans l'onglet Actions
2. Cliquez sur le job qui a échoué
3. Regardez les logs détaillés
4. Identifiez l'erreur
5. Corrigez localement
6. Poussez à nouveau

### Les tests échouent

**Solutions :**
```bash
# Testez localement d'abord
cd backend
npm test

# Vérifiez la base de données
docker-compose up -d postgres
npm run prisma:migrate
npm test
```

### Le build Docker échoue

**Solutions :**
```bash
# Testez localement
docker-compose build backend
docker-compose build frontend

# Vérifiez les Dockerfiles
cat backend/Dockerfile
cat frontend/Dockerfile
```

## 📊 Exemple de workflow réussi

```
✅ backend-lint (2m 15s)
✅ frontend-lint (1m 45s)
✅ backend-test (3m 30s)
✅ docker-build (6m 20s)
✅ docker-push (4m 10s) [uniquement sur main]
```

**Temps total :** ~13-18 minutes (selon la branche)

## 🎓 Bonnes pratiques

1. **Toujours vérifier les checks avant de merger**
   - Attendez que tous les checks soient verts
   - Ne mergez pas si un check échoue

2. **Testez localement avant de pousser**
   ```bash
   npm run lint
   npm test
   docker-compose build
   ```

3. **Utilisez des branches de feature**
   - Ne poussez pas directement sur `main`
   - Créez une branche et une PR

4. **Vérifiez les logs en cas d'échec**
   - Les logs contiennent souvent des indices précieux

5. **Gardez les secrets sécurisés**
   - Ne commitez jamais de secrets
   - Utilisez toujours les secrets GitHub

## 🔗 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Voir vos workflows en action](https://github.com/votre-username/forgetmenot/actions)

---

**Note :** Le pipeline est conçu pour être rapide et efficace. Les jobs parallèles réduisent le temps d'exécution total, et le cache accélère les builds Docker.


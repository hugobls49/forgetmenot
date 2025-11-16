# GitHub Actions Workflows

Ce dossier contient les workflows CI/CD pour ForgetMeNot.

## Workflows disponibles

### 1. `ci.yml` - Pipeline CI principal

Ce workflow s'exécute sur chaque push et pull request vers `main` ou `develop`.

**Jobs inclus :**
- **backend-lint** : Vérifie le linting et le formatage du code backend
- **frontend-lint** : Vérifie le linting et le type checking du code frontend
- **backend-test** : Exécute les tests backend (si disponibles)
- **docker-build** : Construit les images Docker pour backend et frontend
- **docker-push** : Push les images vers Docker Hub (uniquement sur `main`)

### 2. `deploy.yml` - Déploiement

Ce workflow s'exécute après un succès du pipeline CI sur `main`.

**Fonctionnalités :**
- Déploiement automatique après un push réussi sur `main`
- Déploiement manuel via `workflow_dispatch` avec choix de l'environnement

### 3. `docker-compose-test.yml` - Tests d'intégration

Ce workflow teste l'application complète avec Docker Compose.

**Vérifications :**
- Démarrage de tous les services
- Vérification de la santé des services
- Exécution des migrations de base de données
- Tests de connexion à la base de données

## Configuration requise

### Secrets GitHub

Pour utiliser le workflow `docker-push`, vous devez configurer les secrets suivants dans GitHub :

1. **DOCKER_USERNAME** : Votre nom d'utilisateur Docker Hub
2. **DOCKER_PASSWORD** : Votre token d'accès Docker Hub

**Comment ajouter des secrets :**
1. Allez dans votre repository GitHub
2. Settings → Secrets and variables → Actions
3. Cliquez sur "New repository secret"
4. Ajoutez chaque secret

### Secrets pour le déploiement (optionnel)

Si vous configurez le déploiement SSH, ajoutez :
- **DEPLOY_HOST** : Adresse IP ou hostname du serveur
- **DEPLOY_USER** : Nom d'utilisateur SSH
- **DEPLOY_SSH_KEY** : Clé privée SSH

## Utilisation

### Déclencher manuellement un déploiement

1. Allez dans l'onglet "Actions" de votre repository
2. Sélectionnez le workflow "Deploy"
3. Cliquez sur "Run workflow"
4. Choisissez l'environnement (staging ou production)
5. Cliquez sur "Run workflow"

### Voir les logs

1. Allez dans l'onglet "Actions"
2. Cliquez sur le workflow que vous voulez voir
3. Cliquez sur le job spécifique pour voir les logs détaillés

## Personnalisation

### Modifier les branches déclenchantes

Éditez le fichier `ci.yml` et modifiez :
```yaml
on:
  push:
    branches: [ main, develop ]  # Modifiez ici
```

### Ajouter des tests

Ajoutez vos tests dans le job `backend-test` ou créez un nouveau job.

### Configurer le déploiement

Éditez le fichier `deploy.yml` et décommentez/ajoutez vos étapes de déploiement.


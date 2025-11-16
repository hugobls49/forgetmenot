# Configuration CI/CD - ForgetMeNot

Ce guide explique comment configurer et utiliser les pipelines CI/CD pour ForgetMeNot.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [GitHub Actions](#github-actions)
- [Configuration requise](#configuration-requise)
- [Utilisation](#utilisation)
- [Personnalisation](#personnalisation)

## 🎯 Vue d'ensemble

Le projet inclut des configurations CI/CD pour :
- ✅ **Linting et formatage** du code (backend et frontend)
- ✅ **Tests** automatiques
- ✅ **Build des images Docker**
- ✅ **Push vers un registry Docker** (optionnel)
- ✅ **Tests d'intégration** avec Docker Compose
- ✅ **Déploiement** (à configurer selon vos besoins)

## 🐙 GitHub Actions

### Structure des workflows

Les workflows sont dans `.github/workflows/` :

1. **`ci.yml`** - Pipeline CI principal
2. **`deploy.yml`** - Déploiement automatique
3. **`docker-compose-test.yml`** - Tests d'intégration

### Configuration GitHub Actions

#### 1. Secrets requis (pour Docker Hub)

Si vous voulez pousser les images vers Docker Hub, configurez ces secrets :

1. Allez dans votre repository GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **"New repository secret"**
4. Ajoutez :
   - `DOCKER_USERNAME` : Votre nom d'utilisateur Docker Hub
   - `DOCKER_PASSWORD` : Votre token d'accès Docker Hub ([créer un token](https://hub.docker.com/settings/security))

#### 2. Secrets pour le déploiement (optionnel)

Si vous configurez le déploiement SSH :
- `DEPLOY_HOST` : Adresse IP ou hostname du serveur
- `DEPLOY_USER` : Nom d'utilisateur SSH
- `DEPLOY_SSH_KEY` : Clé privée SSH

### Utilisation

Les workflows se déclenchent automatiquement sur :
- Push vers `main` ou `develop`
- Pull requests vers `main` ou `develop`

Pour déclencher un déploiement manuel :
1. Allez dans **Actions**
2. Sélectionnez **"Deploy"**
3. Cliquez sur **"Run workflow"**
4. Choisissez l'environnement

## ⚙️ Configuration requise

### Prérequis

- Repository GitHub
- Compte Docker Hub (optionnel, pour pousser les images)
- Node.js 18+ (pour les tests locaux)

### Structure des branches

Le pipeline est configuré pour :
- **`main`** : Branche de production
- **`develop`** : Branche de développement

Modifiez les branches dans les fichiers de workflow si nécessaire.

## 🚀 Utilisation

### Vérifier le statut des workflows

1. Allez dans l'onglet **"Actions"** de votre repository GitHub
2. Vous verrez tous les workflows et leur statut
3. Cliquez sur un workflow spécifique pour voir les détails

### Voir les logs

Cliquez sur un workflow spécifique pour voir les logs détaillés de chaque job.

### Badge de statut

Ajoutez un badge de statut dans votre README :

```markdown
![CI](https://github.com/votre-username/forgetmenot/workflows/CI%2FCD%20Pipeline/badge.svg)
```

Remplacez `votre-username` par votre nom d'utilisateur GitHub et `forgetmenot` par le nom de votre repository.

## 🔧 Personnalisation

### Modifier les branches déclenchantes

Éditez le fichier `.github/workflows/ci.yml` :

```yaml
on:
  push:
    branches: [ main, develop ]  # Modifiez ici
```

### Ajouter des tests

Ajoutez vos tests dans le job `backend-test` ou créez un nouveau job.

### Configurer le déploiement

#### Déploiement SSH

Décommentez et configurez les étapes dans `deploy.yml` :

```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.DEPLOY_HOST }}
    username: ${{ secrets.DEPLOY_USER }}
    key: ${{ secrets.DEPLOY_SSH_KEY }}
    script: |
      cd /path/to/app
      docker-compose pull
      docker-compose up -d
```

#### Déploiement Kubernetes

Ajoutez des étapes pour déployer sur Kubernetes :

```yaml
- name: Deploy to Kubernetes
  uses: azure/k8s-deploy@v4
  with:
    manifests: |
      k8s/backend-deployment.yaml
      k8s/frontend-deployment.yaml
```

#### Déploiement sur Vercel/Railway/etc.

Ajoutez les étapes spécifiques à votre plateforme de déploiement.

### Modifier les versions Node.js

Changez `NODE_VERSION` dans les fichiers de workflow :

```yaml
env:
  NODE_VERSION: '20'  # Changez ici
```

## 📝 Notes importantes

1. **Sécurité** : Ne commitez jamais de secrets dans le code. Utilisez toujours les secrets du CI/CD.

2. **Cache** : Les workflows utilisent le cache pour accélérer les builds. Le cache est automatiquement géré.

3. **Tests** : Si vous n'avez pas encore de tests, le pipeline continuera avec `--passWithNoTests`.

4. **Docker Hub** : Le push vers Docker Hub n'est activé que sur la branche `main` pour éviter de polluer le registry.

5. **Déploiement** : Le déploiement est configuré en mode manuel par défaut pour éviter les déploiements accidentels.

## 🐛 Dépannage

### Les tests échouent

- Vérifiez que votre base de données de test est correctement configurée
- Vérifiez les variables d'environnement

### Le build Docker échoue

- Vérifiez que les Dockerfiles sont corrects
- Vérifiez les logs détaillés dans le workflow

### Le push Docker échoue

- Vérifiez que les secrets Docker Hub sont correctement configurés
- Vérifiez que vous avez les permissions nécessaires

## 📚 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)


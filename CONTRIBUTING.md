# 🤝 Guide de Contribution - ForgetMeNot

Merci de votre intérêt pour contribuer à ForgetMeNot ! Ce guide vous aidera à démarrer.

## 🎯 Comment contribuer

Il existe plusieurs façons de contribuer :

1. **Signaler des bugs** 🐛
2. **Proposer des améliorations** 💡
3. **Améliorer la documentation** 📚
4. **Soumettre du code** 💻
5. **Traduire l'application** 🌍

## 📋 Avant de commencer

1. Lisez le README.md et GETTING_STARTED.md
2. Parcourez les issues existantes
3. Familiarisez-vous avec le code

## 🐛 Signaler un bug

Créez une issue avec :

- **Titre clair** : Décrivez le bug en une ligne
- **Description** : Que s'est-il passé ? Que devrait-il se passer ?
- **Étapes pour reproduire** :
  1. Aller sur '...'
  2. Cliquer sur '...'
  3. Voir l'erreur
- **Environnement** :
  - OS : [ex: macOS 13.0]
  - Navigateur : [ex: Chrome 120]
  - Version de Node.js : [ex: 18.0.0]
- **Captures d'écran** : Si applicable
- **Logs** : Messages d'erreur console

## 💡 Proposer une amélioration

Créez une issue "Feature Request" avec :

- **Description claire** de la fonctionnalité
- **Cas d'usage** : Pourquoi est-ce utile ?
- **Solution proposée** : Comment l'implémenter ?
- **Alternatives** : Avez-vous considéré d'autres approches ?

## 💻 Soumettre du code

### 1. Fork et clone

```bash
# Fork le repo sur GitHub, puis :
git clone https://github.com/VOTRE-USERNAME/forgetmenot.git
cd forgetmenot
```

### 2. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

**Convention de nommage :**
- `feature/` : Nouvelle fonctionnalité
- `fix/` : Correction de bug
- `docs/` : Documentation
- `refactor/` : Refactoring
- `test/` : Tests
- `style/` : Modifications de style (CSS, format)

### 3. Développer

Suivez les conventions du projet :

#### Backend (NestJS)

```typescript
// ✅ Bon
@Injectable()
export class MyService {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Entity[]> {
    return this.prisma.entity.findMany();
  }
}

// ❌ Mauvais
class myService {
  findAll() {
    return prisma.entity.findMany()
  }
}
```

**Règles :**
- Utiliser les décorateurs NestJS
- Injecter les dépendances via le constructeur
- Typer les retours de fonction
- Gérer les erreurs avec des exceptions HTTP
- Valider les entrées avec class-validator

#### Frontend (React)

```typescript
// ✅ Bon
interface Props {
  title: string;
  onClose: () => void;
}

export default function MyComponent({ title, onClose }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card">
      <h2>{title}</h2>
    </div>
  );
}

// ❌ Mauvais
function mycomponent(props) {
  return <div style={{padding: '20px'}}>{props.title}</div>
}
```

**Règles :**
- Composants fonctionnels avec hooks
- Props typées avec TypeScript
- Utiliser Tailwind CSS (pas de style inline)
- Nommer les fichiers en PascalCase
- Un composant = un fichier

### 4. Tester

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Frontend
cd frontend
npm run lint
npm run build
```

### 5. Commiter

Utilisez des messages de commit clairs :

```bash
git commit -m "feat: ajouter la fonctionnalité X"
git commit -m "fix: corriger le bug Y"
git commit -m "docs: mettre à jour le README"
```

**Convention Conventional Commits :**
- `feat:` : Nouvelle fonctionnalité
- `fix:` : Correction de bug
- `docs:` : Documentation
- `style:` : Formatage (pas de changement de code)
- `refactor:` : Refactoring
- `test:` : Ajout de tests
- `chore:` : Tâches diverses

### 6. Push et Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Sur GitHub :
1. Créer une Pull Request
2. Décrire vos changements
3. Lier les issues concernées
4. Attendre la review

## 📝 Checklist Pull Request

Avant de soumettre, vérifiez :

- [ ] Le code compile sans erreur
- [ ] Les tests passent
- [ ] Le linter ne signale aucune erreur
- [ ] Le code est commenté si nécessaire
- [ ] La documentation est mise à jour
- [ ] Les commits sont clairs et atomiques
- [ ] Pas de `console.log()` oubliés
- [ ] Les secrets ne sont pas commités

## 🎨 Standards de code

### TypeScript

```typescript
// Utiliser des types explicites
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Préférer les interfaces aux types pour les objets
interface User {
  id: string;
  email: string;
}

// Utiliser des enums pour les constantes
enum ReviewQuality {
  AGAIN = 'AGAIN',
  HARD = 'HARD',
  GOOD = 'GOOD',
  EASY = 'EASY',
}
```

### Nommage

```typescript
// Classes : PascalCase
class UserService {}

// Fonctions/Variables : camelCase
const getUserById = () => {};
let currentUser;

// Constantes : UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// Composants React : PascalCase
function UserProfile() {}

// Fichiers : kebab-case ou PascalCase selon le type
// user-service.ts (service)
// UserProfile.tsx (composant)
```

### Commentaires

```typescript
/**
 * Calcule les nouveaux paramètres de révision selon SM-2
 * @param quality - Qualité de la réponse (0-3)
 * @param easeFactor - Facteur de facilité actuel
 * @returns Nouveaux paramètres calculés
 */
function calculateNextReview(quality: number, easeFactor: number) {
  // Ajuster le facteur de facilité
  const newEaseFactor = easeFactor + (0.1 - (3 - quality) * 0.08);
  
  // Le facteur ne peut pas être inférieur à 1.3
  return Math.max(newEaseFactor, 1.3);
}
```

## 🧪 Tests

### Backend

```typescript
describe('CardsService', () => {
  let service: CardsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CardsService, PrismaService],
    }).compile();

    service = module.get<CardsService>(CardsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a card', async () => {
    const card = await service.create(userId, createCardDto);
    expect(card).toBeDefined();
    expect(card.question).toBe(createCardDto.question);
  });
});
```

### Frontend

```typescript
import { render, screen } from '@testing-library/react';
import { LoginPage } from './LoginPage';

test('renders login form', () => {
  render(<LoginPage />);
  const emailInput = screen.getByLabelText(/email/i);
  expect(emailInput).toBeInTheDocument();
});
```

## 🌍 Traductions

Pour ajouter une nouvelle langue :

1. Créer `frontend/src/locales/[lang].json`
2. Copier le contenu de `fr.json`
3. Traduire toutes les clés
4. Ajouter la langue dans les paramètres

## 📦 Structure des fichiers

```
backend/
├── src/
│   ├── module-name/
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entities/         # Entités (si besoin)
│   │   ├── module.module.ts
│   │   ├── module.service.ts
│   │   ├── module.controller.ts
│   │   └── module.service.spec.ts
│   └── common/              # Code partagé

frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   └── feature/
│   │       ├── Feature.tsx
│   │       └── Feature.test.tsx
│   ├── pages/              # Pages complètes
│   ├── services/           # Services API
│   ├── hooks/              # Custom hooks
│   ├── store/              # State management
│   ├── lib/                # Utilitaires
│   └── types/              # Types TypeScript
```

## 🎯 Priorités

Les contributions les plus utiles :

1. **Corrections de bugs** 🐛
2. **Tests** 🧪
3. **Documentation** 📚
4. **Accessibilité** ♿
5. **Performance** ⚡
6. **Traductions** 🌍

## ❓ Questions

- **Issues GitHub** : Pour les questions techniques
- **Discussions** : Pour les discussions générales

## 📜 Code de conduite

- Soyez respectueux et bienveillant
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est meilleur pour le projet
- Aidez les nouveaux contributeurs

## 🎉 Merci !

Chaque contribution, petite ou grande, est précieuse. Merci de rendre ForgetMeNot meilleur ! 🙏

---

**ForgetMeNot** - Ne laissez plus rien vous échapper 🧠✨


import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...');

  // Supprimer les données existantes
  console.log('🗑️  Nettoyage de la base de données...');
  await prisma.readHistory.deleteMany();
  await prisma.note.deleteMany();
  await prisma.category.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.dailyStats.deleteMany();
  await prisma.user.deleteMany();

  // Créer un utilisateur de test
  console.log('👤 Création de l\'utilisateur de test...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@forgetmenot.app',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
    },
  });

  // Créer des paramètres pour l'utilisateur
  await prisma.userSettings.create({
    data: {
      userId: user.id,
      emailNotifications: true,
      dailyReminderTime: '09:00',
      theme: 'light',
    },
  });

  // Créer des catégories
  console.log('📁 Création des catégories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Général',
        color: '#FFE9D0',
        description: 'Notes générales',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Études',
        color: '#D9D9D9',
        description: 'Notes pour les études',
        userId: user.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Travail',
        color: '#FFE9D0',
        description: 'Notes professionnelles',
        userId: user.id,
      },
    }),
  ]);

  // Créer des notes de test
  console.log('📝 Création des notes de test...');
  const notes = [
    {
      title: 'Algorithme de Dijkstra',
      content: `L'algorithme de Dijkstra permet de trouver le plus court chemin entre deux nœuds dans un graphe. Il utilise une file de priorité pour explorer les chemins les plus courts en premier.

Points clés :
- Complexité : O((V + E) log V)
- Fonctionne avec des poids positifs
- Utilise une file de priorité`,
      tags: ['algorithme', 'graphe', 'informatique'],
      categoryId: categories[1].id,
    },
    {
      title: 'Les 7 merveilles du monde antique',
      content: `1. La pyramide de Khéops (Égypte)
2. Les jardins suspendus de Babylone (Irak)
3. La statue de Zeus à Olympie (Grèce)
4. Le temple d'Artémis à Éphèse (Turquie)
5. Le mausolée d'Halicarnasse (Turquie)
6. Le colosse de Rhodes (Grèce)
7. Le phare d'Alexandrie (Égypte)

Seule la pyramide existe encore aujourd'hui.`,
      tags: ['histoire', 'culture', 'antiquité'],
      categoryId: categories[0].id,
    },
    {
      title: 'Formule du théorème de Pythagore',
      content: `a² + b² = c²

Où :
- a et b sont les côtés de l'angle droit
- c est l'hypoténuse (le côté opposé à l'angle droit)

Exemple : Si a = 3 et b = 4, alors c = 5`,
      tags: ['mathématiques', 'géométrie'],
      categoryId: categories[1].id,
    },
    {
      title: 'Cycle de Krebs',
      content: `Le cycle de Krebs (ou cycle de l'acide citrique) est une série de réactions chimiques qui se produisent dans les mitochondries. C'est une étape cruciale de la respiration cellulaire.

Résumé :
- Convertit l'acétyl-CoA en CO2
- Produit de l'énergie sous forme d'ATP
- Génère des coenzymes réduites (NADH, FADH2)`,
      tags: ['biologie', 'biochimie'],
      categoryId: categories[1].id,
    },
    {
      title: 'Commandes Git essentielles',
      content: `git init - Initialiser un dépôt
git add . - Ajouter tous les fichiers
git commit -m "message" - Créer un commit
git push origin main - Pousser vers le dépôt distant
git pull - Récupérer les changements
git branch - Lister les branches
git checkout -b nouvelle-branche - Créer une nouvelle branche`,
      tags: ['git', 'développement', 'outils'],
      categoryId: categories[2].id,
    },
    {
      content: `Le café contient de la caféine, un stimulant du système nerveux central. Une tasse de café contient en moyenne 95 mg de caféine.`,
      tags: ['santé', 'alimentation'],
      categoryId: categories[0].id,
    },
  ];

  for (const noteData of notes) {
    await prisma.note.create({
      data: {
        ...noteData,
        userId: user.id,
        nextReadDate: new Date(), // À relire immédiatement pour démonstration
      },
    });
  }

  console.log('✅ Notes de test créées');
  console.log('\n🎉 Seed terminé avec succès !');
  console.log('\n📧 Compte de test:');
  console.log('   Email: demo@forgetmenot.app');
  console.log('   Mot de passe: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

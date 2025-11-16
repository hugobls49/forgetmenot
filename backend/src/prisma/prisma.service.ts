import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    // Liste des modèles à nettoyer
    const models = [
      'reviewHistory',
      'refreshToken',
      'card',
      'category',
      'dailyStats',
      'userSettings',
      'user',
    ];

    for (const model of models) {
      if (this[model as keyof PrismaService]) {
        await (this[model as keyof PrismaService] as any).deleteMany();
      }
    }
  }
}


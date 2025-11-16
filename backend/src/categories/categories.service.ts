import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    const { name, color, description } = createCategoryDto;

    // Vérifier si une catégorie avec ce nom existe déjà pour cet utilisateur
    const existing = await this.prisma.category.findFirst({
      where: { userId, name },
    });

    if (existing) {
      throw new ConflictException('Une catégorie avec ce nom existe déjà');
    }

    const category = await this.prisma.category.create({
      data: {
        name,
        color,
        description,
        userId,
      },
    });

    return category;
  }

  async findAll(userId: string) {
    const categories = await this.prisma.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { notes: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return categories;
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { notes: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    return category;
  }

  async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!existingCategory) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    // Vérifier le nom unique si modifié
    if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
      const nameExists = await this.prisma.category.findFirst({
        where: {
          userId,
          name: updateCategoryDto.name,
          id: { not: id },
        },
      });

      if (nameExists) {
        throw new ConflictException('Une catégorie avec ce nom existe déjà');
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return category;
  }

  async remove(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Catégorie supprimée avec succès' };
  }
}


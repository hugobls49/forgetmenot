import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReadingReminderService } from '../common/algorithms/reading-reminder.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private readingReminder: ReadingReminderService,
  ) {}

  /**
   * Créer une nouvelle note
   */
  async create(userId: string, createNoteDto: CreateNoteDto) {
    const nextReadDate = this.readingReminder.calculateNextReadDate(0);

    return this.prisma.note.create({
      data: {
        ...createNoteDto,
        userId,
        nextReadDate,
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Obtenir toutes les notes d'un utilisateur
   */
  async findAll(userId: string, categoryId?: string) {
    const where: any = { userId };
    if (categoryId) {
      where.categoryId = categoryId;
    }

    return this.prisma.note.findMany({
      where,
      include: {
        category: true,
        readHistory: {
          orderBy: { readDate: 'desc' },
          take: 5,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Obtenir les notes à relire aujourd'hui
   */
  async findDueForReading(userId: string) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return this.prisma.note.findMany({
      where: {
        userId,
        nextReadDate: {
          lte: today,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        nextReadDate: 'asc',
      },
    });
  }

  /**
   * Obtenir une note par son ID
   */
  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
      include: {
        category: true,
        readHistory: {
          orderBy: { readDate: 'desc' },
        },
      },
    });

    if (!note) {
      throw new NotFoundException('Note non trouvée');
    }

    return note;
  }

  /**
   * Mettre à jour une note
   */
  async update(userId: string, id: string, updateNoteDto: UpdateNoteDto) {
    const note = await this.findOne(userId, id);

    return this.prisma.note.update({
      where: { id: note.id },
      data: updateNoteDto,
      include: {
        category: true,
      },
    });
  }

  /**
   * Marquer une note comme lue
   */
  async markAsRead(userId: string, id: string, timeSpent?: number) {
    const note = await this.findOne(userId, id);

    // Calculer la prochaine date de relecture
    const newReadCount = note.readCount + 1;
    const nextReadDate = this.readingReminder.calculateNextReadDate(newReadCount);

    // Mettre à jour la note
    const updatedNote = await this.prisma.note.update({
      where: { id: note.id },
      data: {
        readCount: newReadCount,
        lastReadDate: new Date(),
        nextReadDate,
      },
      include: {
        category: true,
      },
    });

    // Enregistrer l'historique
    await this.prisma.readHistory.create({
      data: {
        noteId: id,
        userId,
        timeSpent,
      },
    });

    // Mettre à jour les stats quotidiennes
    await this.updateDailyStats(userId);

    return updatedNote;
  }

  /**
   * Supprimer une note
   */
  async remove(userId: string, id: string) {
    const note = await this.findOne(userId, id);
    await this.prisma.note.delete({ where: { id: note.id } });
    return { message: 'Note supprimée avec succès' };
  }

  /**
   * Obtenir les statistiques des notes
   */
  async getStats(userId: string) {
    const [total, dueToday, readToday] = await Promise.all([
      // Total des notes
      this.prisma.note.count({ where: { userId } }),
      
      // Notes à relire aujourd'hui
      this.findDueForReading(userId).then((notes) => notes.length),
      
      // Notes lues aujourd'hui
      this.prisma.readHistory.count({
        where: {
          userId,
          readDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return {
      total,
      dueToday,
      readToday,
    };
  }

  /**
   * Mettre à jour les statistiques quotidiennes
   */
  private async updateDailyStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingStats = await this.prisma.dailyStats.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    if (existingStats) {
      await this.prisma.dailyStats.update({
        where: { id: existingStats.id },
        data: {
          notesRead: { increment: 1 },
        },
      });
    } else {
      await this.prisma.dailyStats.create({
        data: {
          userId,
          date: today,
          notesRead: 1,
          notesCreated: 0,
          totalTimeSpent: 0,
        },
      });
    }
  }
}


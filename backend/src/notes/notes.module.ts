import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ReadingReminderService } from '../common/algorithms/reading-reminder.service';

@Module({
  imports: [PrismaModule],
  controllers: [NotesController],
  providers: [NotesService, ReadingReminderService],
  exports: [NotesService],
})
export class NotesModule {}


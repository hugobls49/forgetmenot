import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { MarkAsReadDto } from './dto/mark-as-read.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(userId, createNoteDto);
  }

  @Get()
  findAll(
    @CurrentUser('sub') userId: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.notesService.findAll(userId, categoryId);
  }

  @Get('due')
  findDueForReading(@CurrentUser('sub') userId: string) {
    return this.notesService.findDueForReading(userId);
  }

  @Get('stats')
  getStats(@CurrentUser('sub') userId: string) {
    return this.notesService.getStats(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.notesService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(userId, id, updateNoteDto);
  }

  @Post(':id/read')
  markAsRead(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() markAsReadDto: MarkAsReadDto,
  ) {
    return this.notesService.markAsRead(userId, id, markAsReadDto.timeSpent);
  }

  @Delete(':id')
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.notesService.remove(userId, id);
  }
}


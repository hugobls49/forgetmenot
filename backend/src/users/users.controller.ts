import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil récupéré' })
  async getProfile(@CurrentUser('sub') userId: string) {
    return this.usersService.findById(userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Mettre à jour le profil' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour' })
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Récupérer les paramètres utilisateur' })
  @ApiResponse({ status: 200, description: 'Paramètres récupérés' })
  async getSettings(@CurrentUser('sub') userId: string) {
    return this.usersService.getSettings(userId);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Mettre à jour les paramètres' })
  @ApiResponse({ status: 200, description: 'Paramètres mis à jour' })
  async updateSettings(
    @CurrentUser('sub') userId: string,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.usersService.updateSettings(userId, updateSettingsDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer son compte' })
  @ApiResponse({ status: 200, description: 'Compte supprimé' })
  async deleteAccount(@CurrentUser('sub') userId: string) {
    return this.usersService.delete(userId);
  }
}


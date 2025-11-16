import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Adresse email de l\'utilisateur',
  })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Mot de passe (minimum 8 caractères)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @MaxLength(100)
  password: string;

  @ApiProperty({
    example: 'Hugo',
    description: 'Prénom de l\'utilisateur',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({
    example: 'Blois',
    description: 'Nom de famille de l\'utilisateur',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;
}


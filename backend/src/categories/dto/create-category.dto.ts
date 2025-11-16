import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Géographie',
    description: 'Nom de la catégorie',
  })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: '#3B82F6',
    description: 'Couleur hexadécimale',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'Couleur invalide (format: #RRGGBB)' })
  color?: string;

  @ApiProperty({
    example: 'Cartes liées à la géographie mondiale',
    description: 'Description de la catégorie',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}


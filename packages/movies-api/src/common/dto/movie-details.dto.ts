import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MovieDto } from './movie.dto';

export class MovieDetailsDto extends MovieDto {
  @ApiProperty({
    description: 'IMDb ID for the movie',
    example: 'tt0848228',
    required: false,
  })
  @IsOptional()
  @IsString()
  imdb_id?: string | null;

  @ApiProperty({
    description: 'Movie overview/synopsis',
    example: 'When an unexpected enemy emerges and threatens global safety...',
    required: false,
  })
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiProperty({
    description: 'Movie runtime in minutes',
    example: 143,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  runtime?: number | null;

  @ApiProperty({
    description: 'Movie vote average',
    example: 7.7,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  vote_average?: number;

  @ApiProperty({
    description: 'Movie vote count',
    example: 28691,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  vote_count?: number;

  @ApiProperty({
    description: 'Movie tagline',
    example: 'Some assembly required.',
    required: false,
  })
  @IsOptional()
  @IsString()
  tagline?: string | null;
}

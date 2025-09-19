import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewAuthorDetailsDto {
  @ApiProperty({
    description: 'Author name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Author username',
    example: 'johndoe123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Author avatar path',
    example: '/path/to/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar_path?: string | null;

  @ApiProperty({
    description: 'Author rating for the movie',
    example: 8.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  rating?: number | null;
}

export class ReviewDto {
  @ApiProperty({
    description: 'Unique identifier for the review',
    example: '5f3f3f3f3f3f3f3f3f3f3f3f',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Author of the review',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: 'Detailed author information',
    type: ReviewAuthorDetailsDto,
  })
  author_details: ReviewAuthorDetailsDto;

  @ApiProperty({
    description: 'Review content/text',
    example: 'This movie was absolutely amazing! The cinematography was...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Review creation date',
    example: '2023-01-15T10:30:00.000Z',
  })
  @IsDateString()
  created_at: string;

  @ApiProperty({
    description: 'Review last update date',
    example: '2023-01-16T14:20:00.000Z',
  })
  @IsDateString()
  updated_at: string;

  @ApiProperty({
    description: 'Review URL on TMDB',
    example: 'https://www.themoviedb.org/review/5f3f3f3f3f3f3f3f3f3f3f3f',
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}

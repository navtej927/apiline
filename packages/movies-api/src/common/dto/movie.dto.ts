import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty({
    description: 'Unique identifier for the movie',
    example: 24428,
  })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: 'Title of the movie',
    example: 'The Avengers',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Release date of the movie in YYYY-MM-DD format',
    example: '2012-04-25',
  })
  @IsDateString()
  release_date: string;

  @ApiProperty({
    description: 'Whether the movie is rated for adults only',
    example: false,
  })
  @IsBoolean()
  adult: boolean;

  computedProperty: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsBoolean } from 'class-validator';
import { MovieDto } from '@src/common/dto/movie.dto';

export class MoviesResponseDTO {
  @ApiProperty({
    description: 'Array of movies matching the search query',
    type: [MovieDto],
  })
  @IsArray()
  movies: MovieDto[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'Total number of pages available',
    example: 5,
  })
  @IsNumber()
  totalPages: number;

  @ApiProperty({
    description: 'Total number of movies found',
    example: 100,
  })
  @IsNumber()
  totalResults: number;

  @ApiProperty({
    description: 'Whether similar movies were included in the response',
    example: true,
  })
  @IsBoolean()
  includedSimilar: boolean;
}

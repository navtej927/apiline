import { ApiProperty } from '@nestjs/swagger';
import { MovieDto } from './movie.dto';

export class SimilarMoviesResponseDto {
  @ApiProperty({
    description: 'List of similar movies',
    type: [MovieDto],
  })
  movies: MovieDto[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Total number of results',
    example: 100,
  })
  totalResults: number;

  @ApiProperty({
    description: 'Movie ID for which similar movies were found',
    example: 24428,
  })
  movieId: number;
}

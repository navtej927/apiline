import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { MovieDto } from 'src/common/dto/movie.dto';
import { ApiSearchMovies } from 'src/common/decorators/api-search-movies.decorator';
import { ApiSearchMovieById } from 'src/common/decorators/api-search-movie.decorator';

@ApiTags('Movies')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('movies')
  @ApiSearchMovies()
  async searchMovies(
    @Query('q') q: string,
    @Query('page') page?: string,
    @Query('includeAdult') includeAdult?: string,
    @Query('language') language?: string,
    @Query('includeSimilar') includeSimilar?: string,
    @Query('similarLimit') similarLimit?: string,
  ): Promise<{
    movies: MovieDto[];
    page: number;
    totalPages: number;
    totalResults: number;
    includedSimilar: boolean;
  }> {
    const p = page ? parseInt(page, 10) : 1;
    const adult = includeAdult === 'true';
    const withSimilar = includeSimilar === 'true';
    const limit = similarLimit ? parseInt(similarLimit, 10) : 3;

    return this.searchService.searchMovies(
      q,
      p,
      adult,
      language,
      withSimilar,
      limit,
    );
  }

  @Get('movie')
  @ApiSearchMovieById()
  async searchMovie(
    @Query('id') id: string,
    @Query('language') language?: string,
  ): Promise<unknown> {
    return this.searchService.searchMovie(id, language);
  }
}

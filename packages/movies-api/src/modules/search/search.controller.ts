import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from '@src/modules/search/search.service';
import { MoviesResponseDTO } from '@src/modules/search/dto/movies-response-dto';
import { ApiSearchMovies } from '@src/common/decorators/api-search-movies.decorator';
import { ApiSearchMovieById } from '@src/common/decorators/api-search-movie.decorator';

@ApiTags('Movies')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('movies')
  @ApiSearchMovies()
  searchMovies(
    @Query('q') q: string,
    @Query('page') page?: string,
    @Query('includeAdult') includeAdult?: string,
    @Query('language') language?: string,
    @Query('includeSimilar') includeSimilar?: string,
    @Query('similarLimit') similarLimit?: string,
  ): Promise<MoviesResponseDTO> {
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

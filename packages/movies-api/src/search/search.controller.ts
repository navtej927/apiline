import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { MovieDto } from '../common/dto/movie.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('movies')
  async searchMoviesDto(
    @Query('q') q: string,
    @Query('page') page?: string,
    @Query('includeAdult') includeAdult?: string,
    @Query('language') language?: string,
  ): Promise<MovieDto[]> {
    const p = page ? parseInt(page, 10) : 1;
    const adult = includeAdult === 'true';
    const response = await this.searchService.searchMovies(
      q,
      p,
      adult,
      language,
    );
    return this.searchService.transformToMovieDtos(response.results);
  }

  @Get('movie')
  async getMovieById(
    @Query('id') id: string,
    @Query('language') language?: string,
  ) {
    const response = await this.searchService.getMovieById(id, language);
    return this.searchService.transformToMovieDto(response);
  }
}

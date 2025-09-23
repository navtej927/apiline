import { Controller, Get, Query } from '@nestjs/common';
import { TMDBService } from './tmdb.service';

@Controller('tmdb')
export class TMDBController {
  constructor(private readonly tmdbService: TMDBService) {}

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('language') language: string,
    @Query('includeAdult') includeAdult: boolean,
    @Query('page') page: number,
  ) {
    return this.tmdbService.getMoviesByQuery({
      query,
      page,
      includeAdult,
      language,
    });
  }
}

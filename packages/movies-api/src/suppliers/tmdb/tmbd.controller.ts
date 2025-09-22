import { Controller, Get, Query } from '@nestjs/common';
import { TMDBService } from './tmdb.service';

@Controller('tmdb')
export class TMDBController {
  constructor(private readonly tmdbService: TMDBService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    return this.tmdbService.getMoviesByQuery(query);
  }
}

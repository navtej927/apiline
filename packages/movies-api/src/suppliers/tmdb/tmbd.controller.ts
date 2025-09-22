import { Controller, Get } from '@nestjs/common';
import { TMDBService } from './tmdb.service';

@Controller('tmdb')
export class TMDBController {
  constructor(private readonly tmdbService: TMDBService) {}

  @Get('search')
  async search(query: string) {
    return this.tmdbService.getMoviesByQuery(query);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { OMDBService } from './omdb.service';

@Controller('omdb')
export class OMDBController {
  constructor(private readonly omdbService: OMDBService) {}

  @Get('search')
  async search(@Query('q') query: string): Promise<unknown> {
    return this.omdbService.getMoviesByQuery(query);
  }
}

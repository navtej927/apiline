import { Controller, Get, Query } from '@nestjs/common';
import { OMDBService, OMDBMovieResponse } from './omdb.service';

@Controller('omdb')
export class OMDBController {
  constructor(private readonly omdbService: OMDBService) {}

  @Get('search')
  async search(@Query('q') query: string): Promise<OMDBMovieResponse> {
    return this.omdbService.getMoviesByQuery(query);
  }
}

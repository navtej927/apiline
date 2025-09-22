import { Controller, Get, Query } from '@nestjs/common';
import { OMDBService } from './omdb.service';
import { OMDBMovieResponse } from './types';

@Controller('omdb')
export class OMDBController {
  constructor(private readonly omdbService: OMDBService) {}

  @Get('search')
  async search(@Query('q') query: string): Promise<OMDBMovieResponse> {
    return this.omdbService.getMoviesByQuery(query);
  }
}

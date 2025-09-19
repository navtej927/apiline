import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('movies')
  async searchMovies(
    @Query('q') q: string,
    @Query('page') page?: string,
    @Query('includeAdult') includeAdult?: string,
    @Query('language') language?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const adult = includeAdult === 'true';
    return this.searchService.searchMovies(q, p, adult, language);
  }

  @Get('movie')
  async getMovieById(
    @Query('id') id: string,
    @Query('language') language?: string,
  ) {
    console.log("------->")
    return this.searchService.getMovieById(id, language);
  }
}

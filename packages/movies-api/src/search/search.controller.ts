import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { MovieDto } from '../common/dto/movie.dto';
import { MovieDetailsDto } from '../common/dto/movie-details.dto';

@ApiTags('Movies')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('movies')
  @ApiOperation({ summary: 'Search for movies' })
  @ApiResponse({
    status: 200,
    description: 'List of movies matching the search query',
    type: [MovieDto],
  })
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
  @ApiOperation({ summary: 'Get movie details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Detailed movie information including IMDb ID',
    type: MovieDetailsDto,
  })
  async getMovieById(
    @Query('id') id: string,
    @Query('language') language?: string,
  ): Promise<MovieDetailsDto> {
    const response = await this.searchService.getMovieById(id, language);
    return this.searchService.transformToMovieDetailsDto(response);
  }
}

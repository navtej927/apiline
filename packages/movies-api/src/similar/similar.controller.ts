import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SimilarService } from './similar.service';
import { SimilarMoviesResponseDto } from '../common/dto/similar-movies.dto';

@ApiTags('Similar Movies')
@Controller('similar')
export class SimilarController {
  constructor(private readonly similarService: SimilarService) {}

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Get similar movies for a specific movie' })
  @ApiParam({
    name: 'movieId',
    description: 'TMDB Movie ID',
    example: '24428',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'Language code for movies',
    example: 'en-US',
  })
  @ApiResponse({
    status: 200,
    description: 'List of similar movies',
    type: SimilarMoviesResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid movie ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
  })
  async getSimilarMovies(
    @Param('movieId') movieId: string,
    @Query('page') page?: string,
    @Query('language') language?: string,
  ): Promise<SimilarMoviesResponseDto> {
    const p = page ? parseInt(page, 10) : 1;

    // Add some delay to simulate expensive processing (similar to your other endpoints)
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 2000),
    ); // 2-3 seconds

    const result = await this.similarService.getSimilarMoviesEnhanced(
      movieId,
      p,
      language,
    );

    // Add computed similarity scores to each movie
    result.movies.forEach((movie, index) => {
      (movie as any).computedSimilarityScore = this.calculateSimilarityScore(index);
      (movie as any).computedRank = index + 1;
    });

    return result;
  }

  /**
   * Calculate similarity score simulation
   */
  private calculateSimilarityScore(index: number): number {
    // Simulate decreasing similarity score based on position
    const baseScore = 100 - index * 5; // Decrease by 5 points per position
    const randomVariation = Math.random() * 10 - 5; // ±5 random variation
    return Math.max(0, Math.min(100, baseScore + randomVariation));
  }
}

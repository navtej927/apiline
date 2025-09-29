import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SimilarService } from './similar.service';
import { MovieDto } from 'src/common/dto/movie.dto';
import { ApiSimilarMovies } from 'src/common/decorators/api-similar-movies.decorator';

@ApiTags('Similar Movies')
@Controller('similar')
export class SimilarController {
  constructor(private readonly similarService: SimilarService) {}

  @Get('movie/:movieId')
  @ApiSimilarMovies()
  async getSimilarMovies(
    @Param('movieId') movieId: string,
    @Query('page') page?: string,
    @Query('language') language?: string,
  ): Promise<{
    results: MovieDto[];
    page: number;
    total_pages: number;
    total_results: number;
  }> {
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

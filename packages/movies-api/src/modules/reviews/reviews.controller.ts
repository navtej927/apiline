import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { ReviewDto } from 'src/common/dto/review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Get reviews for a specific movie' })
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
    description: 'Language code for reviews',
    example: 'en-US',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reviews for the movie',
    type: [ReviewDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid movie ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
  })
  async getMovieReviews(
    @Param('movieId') movieId: string,
    @Query('page') page?: string,
    @Query('language') language?: string,
  ): Promise<{
    reviews: ReviewDto[];
    page: number;
    totalPages: number;
    totalResults: number;
  }> {
    const p = page ? parseInt(page, 10) : 1;
    const response = await this.reviewsService.getMovieReviews(
      movieId,
      p,
      language,
    );

    const reviews = this.reviewsService.transformToReviewDtos(response.results);

    return {
      reviews,
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  //   /**
  //    * Simple sentiment analysis simulation
  //    */
  //   private analyzeSentiment(content: string): string {
  //     const positiveWords = [
  //       'amazing',
  //       'great',
  //       'excellent',
  //       'fantastic',
  //       'wonderful',
  //       'love',
  //       'perfect',
  //     ];
  //     const negativeWords = [
  //       'terrible',
  //       'awful',
  //       'bad',
  //       'horrible',
  //       'hate',
  //       'worst',
  //       'disappointing',
  //     ];

  //     const lowerContent = content.toLowerCase();
  //     const positiveCount = positiveWords.filter((word) =>
  //       lowerContent.includes(word),
  //     ).length;
  //     const negativeCount = negativeWords.filter((word) =>
  //       lowerContent.includes(word),
  //     ).length;

  //     if (positiveCount > negativeCount) return 'positive';
  //     if (negativeCount > positiveCount) return 'negative';
  //     return 'neutral';
  //   }
}

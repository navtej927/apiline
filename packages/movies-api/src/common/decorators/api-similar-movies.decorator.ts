import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

/**
 * Custom decorator for Similar Movies API endpoints
 * Combines all Swagger decorators into a single, reusable decorator
 */
export function ApiSimilarMovies() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get similar movies for a specific movie',
      description:
        'Fetches a list of movies similar to the specified movie ID from TMDB API with pagination support',
    }),

    ApiParam({
      name: 'movieId',
      description: 'TMDB Movie ID',
      example: '24428',
      type: 'string',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number for pagination',
      example: 1,
      type: 'number',
    }),

    ApiQuery({
      name: 'language',
      required: false,
      description: 'Language code for movies',
      example: 'en-US',
      type: 'string',
    }),

    ApiResponse({
      status: 200,
      description: 'List of similar movies with pagination info',
      schema: {
        type: 'object',
        properties: {
          results: {
            type: 'array',
            items: { $ref: '#/components/schemas/MovieDto' },
          },
          page: { type: 'number', example: 1 },
          total_pages: { type: 'number', example: 5 },
          total_results: { type: 'number', example: 100 },
        },
      },
    }),

    ApiResponse({
      status: 400,
      description: 'Bad request - invalid movie ID',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Movie ID must not be empty' },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),

    ApiResponse({
      status: 404,
      description: 'Movie not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Movie not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
}

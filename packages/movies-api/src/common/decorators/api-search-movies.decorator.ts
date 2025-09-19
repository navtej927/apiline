import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

/**
 * Custom decorator for Search Movies API endpoint
 * Combines all Swagger decorators for movie search with optional similar movies
 */
export function ApiSearchMovies() {
  return applyDecorators(
    ApiOperation({
      summary: 'Search for movies with optional similar movies',
      description:
        'Search for movies with option to include similar movies for each result. ' +
        'Use includeSimilar=true to get richer data (slower response).',
    }),

    ApiQuery({
      name: 'q',
      description: 'Search query for movies',
      example: 'avengers',
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
      name: 'includeAdult',
      required: false,
      description: 'Include adult content in search results',
      example: false,
      type: 'boolean',
    }),

    ApiQuery({
      name: 'language',
      required: false,
      description: 'Language code for search results',
      example: 'en-US',
      type: 'string',
    }),

    ApiQuery({
      name: 'includeSimilar',
      required: false,
      description: 'Include similar movies for each search result',
      example: true,
      type: 'boolean',
    }),

    ApiQuery({
      name: 'similarLimit',
      required: false,
      description: 'Maximum number of similar movies per result (1-10)',
      example: 3,
      type: 'number',
    }),

    ApiResponse({
      status: 200,
      description: 'Search results with optional similar movies',
      schema: {
        type: 'object',
        properties: {
          movies: {
            type: 'array',
            items: { $ref: '#/components/schemas/MovieDto' },
            description: 'Array of movies matching the search query',
          },
          page: {
            type: 'number',
            example: 1,
            description: 'Current page number',
          },
          totalPages: {
            type: 'number',
            example: 5,
            description: 'Total number of pages available',
          },
          totalResults: {
            type: 'number',
            example: 100,
            description: 'Total number of movies found',
          },
          includedSimilar: {
            type: 'boolean',
            example: true,
            description: 'Whether similar movies were included in the response',
          },
        },
      },
    }),

    ApiResponse({
      status: 400,
      description: 'Bad request - invalid search parameters',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Query must not be empty' },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
  );
}

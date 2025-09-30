import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MoviesResponseDTO } from '../../modules/search/dto/movies-response-dto';

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
      type: MoviesResponseDTO,
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

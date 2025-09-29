import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MovieDto } from '@src/common/dto/movie.dto';

export const SimilarMoviesApiDocs = {
  getSimilarMovies: {
    operation: ApiOperation({
      summary: 'Get similar movies for a specific movie',
      description:
        'Fetches a list of movies similar to the specified movie ID from TMDB API',
    }),

    params: {
      movieId: ApiParam({
        name: 'movieId',
        description: 'TMDB Movie ID',
        example: '24428',
        type: 'string',
      }),
    },

    queries: {
      page: ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: 1,
        type: 'number',
      }),
      language: ApiQuery({
        name: 'language',
        required: false,
        description: 'Language code for movies',
        example: 'en-US',
        type: 'string',
      }),
    },

    responses: {
      success: ApiResponse({
        status: 200,
        description: 'List of similar movies with pagination info',
        type: [MovieDto],
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
      badRequest: ApiResponse({
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
      notFound: ApiResponse({
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
    },
  },
};

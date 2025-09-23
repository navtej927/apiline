import { HttpStatus } from '@nestjs/common';
import { BaseException, ErrorContext } from './base.exception';

export class MovieNotFoundException extends BaseException {
  constructor(movieId: string | number, context?: ErrorContext) {
    super(
      `Movie with ID '${movieId}' not found`,
      HttpStatus.NOT_FOUND,
      'MOVIE_NOT_FOUND',
      {
        movieId,
        ...context,
      },
    );
  }
}

export class InvalidSearchQueryException extends BaseException {
  constructor(query: string, reason?: string, context?: ErrorContext) {
    super(
      `Invalid search query: ${query}${reason ? ` - ${reason}` : ''}`,
      HttpStatus.BAD_REQUEST,
      'INVALID_SEARCH_QUERY',
      {
        query,
        reason,
        ...context,
      },
    );
  }
}

export class ReviewsNotAvailableException extends BaseException {
  constructor(
    movieId: string | number,
    provider: string,
    context?: ErrorContext,
  ) {
    super(
      `Reviews not available for movie '${movieId}' from ${provider}`,
      HttpStatus.NOT_FOUND,
      'REVIEWS_NOT_AVAILABLE',
      {
        movieId,
        provider,
        ...context,
      },
    );
  }
}

export class SimilarMoviesNotAvailableException extends BaseException {
  constructor(movieId: string | number, context?: ErrorContext) {
    super(
      `Similar movies not available for movie '${movieId}'`,
      HttpStatus.NOT_FOUND,
      'SIMILAR_MOVIES_NOT_AVAILABLE',
      {
        movieId,
        ...context,
      },
    );
  }
}

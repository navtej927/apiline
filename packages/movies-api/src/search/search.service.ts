import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { TMDBService } from '../suppliers/tmdb/tmdb.service';
import { SimilarService } from '../similar/similar.service';
import { MovieDto } from 'src/common/dto/movie.dto';
import {
  tmdbToMovieDto,
  omdbToMovieDto,
} from 'src/common/util/movie-mapping.util';
import { OMDBService } from 'src/suppliers/omdb/omdb.service';
import type { TMDBSearchResponse } from '../suppliers/tmdb/types';
import type { OMDBMovieResponse } from 'src/suppliers/omdb/types';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly tmdbService: TMDBService,
    private readonly similarService: SimilarService,
    private readonly omdbService: OMDBService,
  ) {}

  async searchMovies(
    query: string,
    page = 1,
    includeAdult = false,
    language?: string,
    includeSimilar = false,
    similarLimit = 3,
  ): Promise<{
    movies: MovieDto[];
    page: number;
    totalPages: number;
    totalResults: number;
    includedSimilar: boolean;
  }> {
    if (!query || !query.trim()) {
      throw new BadRequestException('Query must not be empty');
    }
    // Delegate to TMDBService
    const tmdbMoviesResponse: TMDBSearchResponse =
      await this.tmdbService.getMoviesByQuery(
        query,
        page,
        includeAdult,
        language,
      );

    const moviesDto = tmdbMoviesResponse.results.map(tmdbToMovieDto);
    if (includeSimilar && moviesDto.length > 0) {
      await this.populateSimilarMovies(moviesDto, similarLimit);
    }

    const omdbMoviesResponse: OMDBMovieResponse =
      await this.omdbService.getMoviesByQuery(query);

    const omdbMovieDto = omdbToMovieDto(omdbMoviesResponse);

    const allMovies = moviesDto.concat(omdbMovieDto);

    return {
      movies: allMovies,
      page: tmdbMoviesResponse.page,
      totalPages: tmdbMoviesResponse.total_pages,
      totalResults: tmdbMoviesResponse.total_results,
      includedSimilar: includeSimilar,
    };
  }

  async searchMovie(id: string | number, language?: string): Promise<unknown> {
    return this.tmdbService.getMovieById(id, language);
  }

  /**
   * Populate similar movies for each movie in the list using existing SimilarService
   */
  private async populateSimilarMovies(
    movies: MovieDto[],
    limit: number,
  ): Promise<void> {
    // Use Promise.allSettled to handle failures gracefully
    const similarPromises = movies.map(async (movie) => {
      try {
        // Reuse existing similar service instead of duplicating logic
        const similarResponse =
          await this.similarService.getSimilarMoviesEnhanced(
            movie.id.toString(),
            1,
          );

        // Take only the requested number of similar movies
        movie.similar_movie = similarResponse.results.slice(0, limit);
      } catch (error) {
        this.logger.warn(
          `Failed to fetch similar movies for ${movie.id}`,
          error,
        );
        movie.similar_movie = []; // Graceful fallback
      }
    });

    await Promise.allSettled(similarPromises);
  }
}

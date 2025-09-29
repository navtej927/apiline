import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { MovieDto } from 'src/common/dto/movie.dto';

export interface TMDBSimilarMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface TMDBSimilarMoviesResponse {
  page: number;
  results: TMDBSimilarMovie[];
  total_pages: number;
  total_results: number;
}

@Injectable()
export class SimilarService {
  private readonly logger = new Logger(SimilarService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl =
      this.config.get<string>('TMDB_BASE_URL') ||
      'https://api.themoviedb.org/3';
  }

  async getSimilarMovies(
    movieId: string | number,
    page = 1,
    language?: string,
  ): Promise<TMDBSimilarMoviesResponse> {
    if (!movieId) {
      throw new BadRequestException('Movie ID must not be empty');
    }

    const token = this.config.get<string>('TMDB_API_ACCESS_TOKEN');
    if (!token || typeof token !== 'string') {
      throw new Error('TMDB_API_ACCESS_TOKEN is not configured');
    }

    const url = `${this.baseUrl}/movie/${movieId}/similar`;
    const params: Record<string, string | number> = {
      page,
    };
    if (language) params.language = language;

    try {
      const res = await firstValueFrom(
        this.http.get(url, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json;charset=utf-8',
          },
        }),
      );
      return res.data as TMDBSimilarMoviesResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('TMDB similar movies fetch failed', {
        error: errorMessage,
        movieId,
        page,
      });
      throw error instanceof Error
        ? error
        : new Error('TMDB similar movies fetch failed');
    }
  }

  /**
   * Transform TMDB similar movie to MovieDto
   */
  transformToMovieDto(tmdbMovie: TMDBSimilarMovie): MovieDto {
    const movieDto = new MovieDto();
    movieDto.id = tmdbMovie.id;
    movieDto.title = tmdbMovie.title;
    movieDto.release_date = tmdbMovie.release_date;
    movieDto.adult = tmdbMovie.adult;
    movieDto.similar_movies = []; // Initialize empty array
    movieDto.content_type = 'TMDB';
    return movieDto;
  }

  /**
   * Transform array of TMDB similar movies to MovieDto array
   */
  transformToMovieDtos(tmdbMovies: TMDBSimilarMovie[]): MovieDto[] {
    return tmdbMovies.map((movie) => this.transformToMovieDto(movie));
  }

  /**
   * Get similar movies with enhanced response
   */
  async getSimilarMoviesEnhanced(
    movieId: string | number,
    page = 1,
    language?: string,
  ): Promise<{
    results: MovieDto[];
    page: number;
    total_pages: number;
    total_results: number;
  }> {
    const response = await this.getSimilarMovies(movieId, page, language);
    const transformedMovies = this.transformToMovieDtos(response.results);

    return {
      page: response.page,
      results: transformedMovies,
      total_pages: response.total_pages,
      total_results: response.total_results,
    };
  }
}

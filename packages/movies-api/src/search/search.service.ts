import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TMDBSearchResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    const configuredBaseUrl: string | undefined = this.config.get<string>('TMDB_BASE_URL');
    this.baseUrl =
      configuredBaseUrl && typeof configuredBaseUrl === 'string' && configuredBaseUrl.length > 0
        ? configuredBaseUrl
        : 'https://api.themoviedb.org/3';
  }

  async searchMovies(
    query: string,
    page = 1,
    includeAdult = false,
    language?: string,
  ): Promise<TMDBSearchResponse> {
    if (!query || !query.trim()) {
      throw new BadRequestException('Query must not be empty');
    }

    const token = this.config.get<string>('TMDB_API_ACCESS_TOKEN');
    if (!token || typeof token !== 'string') {
      throw new Error('TMDB_API_ACCESS_TOKEN is not configured');
    }

    const url = `${this.baseUrl}/search/movie`;
    const params: Record<string, string | number | boolean> = {
      query,
      page,
      include_adult: includeAdult,
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
      return res.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('TMDB search failed', { error: errorMessage });
      throw error instanceof Error ? error : new Error('TMDB search failed');
    }
  }

  async getMovieById(
    id: string | number,
    language?: string,
  ): Promise<TMDBMovie> {
    const token = this.config.get<string>('TMDB_API_ACCESS_TOKEN');
    if (!token || typeof token !== 'string') {
      throw new Error('TMDB_API_ACCESS_TOKEN is not configured');
    }

    const url = `${this.baseUrl}/movie/${id}`;
    const params: Record<string, string> = {};
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
      return res.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('TMDB get movie failed', { error: errorMessage });
      throw error instanceof Error ? error : new Error('TMDB get movie failed');
    }
  }
}

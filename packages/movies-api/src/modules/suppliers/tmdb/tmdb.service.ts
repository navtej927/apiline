import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { TMDBMovieDetailsResponse, TMDBSearchResponse } from './types';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { TMDBReviewsResponse } from 'src/reviews/reviews.service';
import {
  ExternalApiException,
  ExternalApiTimeoutException,
  ExternalApiConfigurationException,
  InvalidSearchQueryException,
} from '../../exceptions';

@Injectable()
export class TMDBService {
  private readonly logger = new Logger(TMDBService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {
    this.baseUrl = this.config.get<string>('externalApis.tmdb.baseUrl')!;
  }

  async getMoviesByQuery({
    query,
    page,
    includeAdult,
    language,
  }): Promise<TMDBSearchResponse> {
    if (!query || typeof query !== 'string' || !query.trim()) {
      throw new InvalidSearchQueryException(query, 'Query must not be empty');
    }

    const token = this.config.get<string>('externalApis.tmdb.apiAccessToken');
    if (!token || typeof token !== 'string') {
      throw new ExternalApiConfigurationException(
        'TMDB',
        'TMDB_API_ACCESS_TOKEN',
      );
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
      return res.data as TMDBSearchResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('TMDB search failed', {
        error: errorMessage,
        query,
        page,
      });

      if (error instanceof Error && error.message.includes('timeout')) {
        throw new ExternalApiTimeoutException('TMDB', 10000, { query, page });
      }

      throw new ExternalApiException(
        'TMDB search failed',
        'TMDB',
        error instanceof Error && 'status' in error
          ? (error as any).status
          : undefined,
        { query, page, originalError: errorMessage },
      );
    }
  }

  async getMovieById(
    id: string | number,
    language?: string,
  ): Promise<TMDBMovieDetailsResponse> {
    const token = this.config.get<string>('externalApis.tmdb.apiAccessToken');
    if (!token || typeof token !== 'string') {
      throw new ExternalApiConfigurationException(
        'TMDB',
        'TMDB_API_ACCESS_TOKEN',
      );
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

  async getMovieReviews(
    movieId: string | number,
    page = 1,
    language?: string,
  ): Promise<TMDBReviewsResponse> {
    if (!movieId) {
      throw new BadRequestException('Movie ID must not be empty');
    }

    const token = this.config.get<string>('externalApis.tmdb.apiAccessToken');
    if (!token || typeof token !== 'string') {
      throw new ExternalApiConfigurationException(
        'TMDB',
        'TMDB_API_ACCESS_TOKEN',
      );
    }

    const url = `${this.baseUrl}/movie/${movieId}/reviews?language=en-US&page=1`;
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
      return res.data as TMDBReviewsResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('TMDB reviews fetch failed', {
        error: errorMessage,
        movieId,
        page,
      });
      throw error instanceof Error
        ? error
        : new Error('TMDB reviews fetch failed');
    }
  }
}

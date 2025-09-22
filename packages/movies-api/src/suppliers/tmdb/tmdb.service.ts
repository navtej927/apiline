import { BadRequestException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { TMDBSearchResponse } from 'src/search/search.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

export class TMDBService {
  private readonly logger = new Logger(TMDBService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {
    this.baseUrl =
      this.config.get<string>('TMDB_BASE_URL') ||
      'https://api.themoviedb.org/3';
  }

  async getMoviesByQuery(
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
}

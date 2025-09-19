import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl =
      this.config.get<string>('TMDB_BASE_URL') ??
      'https://api.themoviedb.org/3';
  }

  async searchMovies(
    query: string,
    page = 1,
    includeAdult = false,
    language?: string,
  ) {
    if (!query || !query.trim()) {
      throw new BadRequestException('Query must not be empty');
    }

    const token = this.config.get<string>('TMDB_API_ACCESS_TOKEN');
    if (!token) {
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
    } catch (err) {
      this.logger.error('TMDB search failed', err);
      throw err;
    }
  }

  async getMovieById(id: string | number, language?: string) {
    const token = this.config.get<string>('TMDB_API_ACCESS_TOKEN');
    if (!token) throw new Error('TMDB_API_ACCESS_TOKEN is not configured');

    const url = `${this.baseUrl}/movie/${id}`;
    const params: Record<string, string> = {};
    if (language) params.language = language;

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
  }
}

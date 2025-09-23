import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { OMDBMovieResponse } from './types';
import {
  ExternalApiException,
  ExternalApiConfigurationException,
  InvalidSearchQueryException,
} from '../../exceptions';

@Injectable()
export class OMDBService {
  private readonly baseUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {
    this.baseUrl = this.config.get<string>('externalApis.omdb.baseUrl')!;
  }

  async getMoviesByQuery(query: string): Promise<OMDBMovieResponse> {
    if (!query || !query.trim()) {
      throw new InvalidSearchQueryException(query, 'Query must not be empty');
    }

    const token = this.config.get<string>('externalApis.omdb.apiKey');
    if (!token || typeof token !== 'string') {
      throw new ExternalApiConfigurationException('OMDB', 'OMDB_API_KEY');
    }

    const url = `${this.baseUrl}/?t=${query}&apikey=${token}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data as OMDBMovieResponse;
  }

  async getMovieById(id: string | number): Promise<OMDBMovieResponse> {
    const token = this.config.get<string>('externalApis.omdb.apiKey');
    if (!token || typeof token !== 'string') {
      throw new ExternalApiConfigurationException('OMDB', 'OMDB_API_KEY');
    }

    try {
      const url = `${this.baseUrl}/?i=${id}&apikey=${token}`;
      const res = await firstValueFrom(this.http.get(url));
      return res.data as OMDBMovieResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new ExternalApiException('OMDB request failed', 'OMDB', undefined, {
        movieId: id,
        originalError: errorMessage,
      });
    }
  }
}

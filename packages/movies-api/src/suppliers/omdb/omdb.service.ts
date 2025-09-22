import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OMDBService {
  private readonly baseUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {
    this.baseUrl =
      this.config.get<string>('OMDB_BASE_URL') || 'https://www.omdbapi.com';
  }

  async getMoviesByQuery(query: string): Promise<unknown> {
    if (!query || !query.trim()) {
      throw new BadRequestException('Query must not be empty');
    }

    const token = this.config.get<string>('OMDB_API_KEY');
    if (!token || typeof token !== 'string') {
      throw new Error('OMDB_API_KEY is not configured');
    }

    const url = `${this.baseUrl}/?t=${query}&apikey=${token}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data as unknown;
  }

  async getMovieById(id: string | number): Promise<unknown> {
    const url = `${this.baseUrl}/?i=${id}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data as unknown;
  }
}

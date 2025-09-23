import { registerAs } from '@nestjs/config';
import { IsString, IsUrl, IsOptional } from 'class-validator';

export class ExternalApisConfig {
  @IsString()
  TMDB_API_ACCESS_TOKEN: string;

  @IsUrl()
  @IsOptional()
  TMDB_BASE_URL?: string = 'https://api.themoviedb.org/3';

  @IsString()
  OMDB_API_KEY: string;

  @IsUrl()
  @IsOptional()
  OMDB_BASE_URL?: string = 'https://www.omdbapi.com';
}

export default registerAs('externalApis', () => ({
  tmdb: {
    apiAccessToken: process.env.TMDB_API_ACCESS_TOKEN,
    baseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  },
  omdb: {
    apiKey: process.env.OMDB_API_KEY,
    baseUrl: process.env.OMDB_BASE_URL || 'https://www.omdbapi.com',
  },
}));

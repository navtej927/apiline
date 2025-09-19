import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { MovieDto } from '../common/dto/movie.dto';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TMDBCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TMDBMovieDetailsResponse {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: TMDBCollection | null;
  budget: number;
  genres: TMDBGenre[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: TMDBSpokenLanguage[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
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
    this.baseUrl =
      this.config.get<string>('TMDB_BASE_URL') ||
      'https://api.themoviedb.org/3';
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
  ): Promise<TMDBMovieDetailsResponse> {
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

  /**
   * Transform TMDB movie data to MovieDto
   */
  transformToMovieDto(
    tmdbMovie: TMDBMovieDetailsResponse | TMDBMovie,
  ): MovieDto {
    const movieDto = new MovieDto();
    movieDto.id = tmdbMovie.id;
    movieDto.title = tmdbMovie.title;
    movieDto.release_date = tmdbMovie.release_date;
    movieDto.adult = tmdbMovie.adult;
    return movieDto;
  }

  /**
   * Transform array of TMDB movies to MovieDto array
   */
  transformToMovieDtos(tmdbMovies: TMDBMovie[]): MovieDto[] {
    return tmdbMovies.map((movie) => this.transformToMovieDto(movie));
  }
}

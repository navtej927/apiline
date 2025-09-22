import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { TMDBService } from '../suppliers/tmdb/tmdb.service';
import { SimilarService } from '../similar/similar.service';
import { MovieDto } from 'src/common/dto/movie.dto';
import { MovieDetailsDto } from 'src/common/dto/movie-details.dto';
import { OMDBService } from 'src/suppliers/omdb/omdb.service';

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
    const tmdbMoviesResponse = await this.tmdbService.getMoviesByQuery(
      query,
      page,
      includeAdult,
      language,
    );

    const moviesDto = this.transformToMovieDtos(tmdbMoviesResponse.results);
    moviesDto.forEach((movie) => {
      movie.content_type = 'TMDB';
    });
    // If similar movies requested, fetch them for each movie using existing service
    if (includeSimilar && moviesDto.length > 0) {
      await this.populateSimilarMovies(moviesDto, 3);
    }

    const omdbMoviesResponse = await this.omdbService.getMoviesByQuery(query);

    console.log('----->', omdbMoviesResponse);

    return {
      movies: moviesDto,
      page: tmdbMoviesResponse.page,
      totalPages: tmdbMoviesResponse.total_pages,
      totalResults: tmdbMoviesResponse.total_results,
      includedSimilar: includeSimilar,
    };
  }

  async searchMovie(
    id: string | number,
    language?: string,
  ): Promise<TMDBMovieDetailsResponse> {
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
    movieDto.similar_movie = [];
    movieDto.content_type = 'TMDB';
    return movieDto;
  }

  /**
   * Transform array of TMDB movies to MovieDto array
   */
  transformToMovieDtos(tmdbMovies: TMDBMovie[]): MovieDto[] {
    return tmdbMovies.map((movie) => this.transformToMovieDto(movie));
  }

  /**
   * Transform TMDB movie details response to MovieDetailsDto
   */
  transformToMovieDetailsDto(
    tmdbMovie: TMDBMovieDetailsResponse,
  ): MovieDetailsDto {
    const movieDetailsDto = new MovieDetailsDto();
    // Base MovieDto fields (inherited)
    movieDetailsDto.id = tmdbMovie.id;
    movieDetailsDto.title = tmdbMovie.title;
    movieDetailsDto.release_date = tmdbMovie.release_date;
    movieDetailsDto.adult = tmdbMovie.adult;

    // Additional MovieDetailsDto fields
    movieDetailsDto.imdb_id = tmdbMovie.imdb_id;
    movieDetailsDto.overview = tmdbMovie.overview;
    movieDetailsDto.runtime = tmdbMovie.runtime;
    movieDetailsDto.vote_average = tmdbMovie.vote_average;
    movieDetailsDto.vote_count = tmdbMovie.vote_count;
    movieDetailsDto.tagline = tmdbMovie.tagline;
    return movieDetailsDto;
  }
}

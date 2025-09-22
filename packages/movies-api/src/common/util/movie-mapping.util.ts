// Utility functions for mapping TMDB and OMDB API responses to MovieDto and MovieDetailsDto
import { MovieDto } from '../dto/movie.dto';
import { MovieDetailsDto } from '../dto/movie-details.dto';
import {
  TMDBMovie,
  TMDBMovieDetailsResponse,
} from '../../suppliers/tmdb/types';
import type { OMDBMovieResponse } from '../../suppliers/omdb/types';

export function tmdbToMovieDto(
  tmdbMovie: TMDBMovie | TMDBMovieDetailsResponse,
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

export function tmdbToMovieDetailsDto(
  tmdbMovie: TMDBMovieDetailsResponse,
): MovieDetailsDto {
  const movieDetailsDto = new MovieDetailsDto();
  movieDetailsDto.id = tmdbMovie.id;
  movieDetailsDto.title = tmdbMovie.title;
  movieDetailsDto.release_date = tmdbMovie.release_date;
  movieDetailsDto.adult = tmdbMovie.adult;
  movieDetailsDto.imdb_id = tmdbMovie.imdb_id;
  movieDetailsDto.overview = tmdbMovie.overview;
  movieDetailsDto.runtime = tmdbMovie.runtime;
  movieDetailsDto.vote_average = tmdbMovie.vote_average;
  movieDetailsDto.vote_count = tmdbMovie.vote_count;
  movieDetailsDto.tagline = tmdbMovie.tagline;
  return movieDetailsDto;
}

export function omdbToMovieDto(omdb: OMDBMovieResponse): MovieDto {
  const movieDto = new MovieDto();
  const digits = (omdb.imdbID || '').replace(/\D/g, '');
  const parsedId = digits ? parseInt(digits, 10) : 0;
  movieDto.id = parsedId;
  const d = new Date(omdb.Released);
  movieDto.release_date = isNaN(d.getTime())
    ? '1970-01-01'
    : d.toISOString().slice(0, 10);
  movieDto.title = omdb.Title;
  movieDto.adult = false;
  movieDto.similar_movie = [];
  movieDto.content_type = 'OMDB';
  return movieDto;
}

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ReviewDto, ReviewAuthorDetailsDto } from '../common/dto/review.dto';

export interface TMDBAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface TMDBReview {
  id: string;
  author: string;
  author_details: TMDBAuthorDetails;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface TMDBReviewsResponse {
  id: number;
  page: number;
  results: TMDBReview[];
  total_pages: number;
  total_results: number;
}

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl =
      this.config.get<string>('TMDB_BASE_URL') ||
      'https://api.themoviedb.org/3';
  }

  async getMovieReviews(
    movieId: string | number,
    page = 1,
    language?: string,
  ): Promise<TMDBReviewsResponse> {
    if (!movieId) {
      throw new BadRequestException('Movie ID must not be empty');
    }

    const token = this.config.get<string>('TMDB_API_ACCESS_TOKEN');
    if (!token || typeof token !== 'string') {
      throw new Error('TMDB_API_ACCESS_TOKEN is not configured');
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

  /**
   * Transform TMDB author details to ReviewAuthorDetailsDto
   */
  transformToAuthorDetailsDto(
    tmdbAuthorDetails: TMDBAuthorDetails,
  ): ReviewAuthorDetailsDto {
    const authorDetailsDto = new ReviewAuthorDetailsDto();
    authorDetailsDto.name = tmdbAuthorDetails.name;
    authorDetailsDto.username = tmdbAuthorDetails.username;
    authorDetailsDto.avatar_path = tmdbAuthorDetails.avatar_path;
    authorDetailsDto.rating = tmdbAuthorDetails.rating;
    return authorDetailsDto;
  }

  /**
   * Transform TMDB review to ReviewDto
   */
  transformToReviewDto(tmdbReview: TMDBReview): ReviewDto {
    const reviewDto = new ReviewDto();
    reviewDto.id = tmdbReview.id;
    reviewDto.author = tmdbReview.author;
    reviewDto.author_details = this.transformToAuthorDetailsDto(
      tmdbReview.author_details,
    );
    reviewDto.content = tmdbReview.content;
    reviewDto.created_at = tmdbReview.created_at;
    reviewDto.updated_at = tmdbReview.updated_at;
    reviewDto.url = tmdbReview.url;
    return reviewDto;
  }

  /**
   * Transform array of TMDB reviews to ReviewDto array
   */
  transformToReviewDtos(tmdbReviews: TMDBReview[]): ReviewDto[] {
    return tmdbReviews.map((review) => this.transformToReviewDto(review));
  }
}

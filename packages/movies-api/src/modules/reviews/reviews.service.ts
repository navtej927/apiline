import { Injectable } from '@nestjs/common';
import { ReviewDto, ReviewAuthorDetailsDto } from 'src/common/dto/review.dto';
import { TMDBService } from 'src/modules/suppliers/tmdb/tmdb.service';

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
  constructor(private readonly tmdbService: TMDBService) {}

  async getMovieReviews(
    movieId: string | number,
    page = 1,
    language?: string,
  ): Promise<TMDBReviewsResponse> {
    return this.tmdbService.getMovieReviews(movieId, page, language);
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

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TMDBService } from 'src/suppliers/tmdb/tmdb.service';

@Module({
  imports: [HttpModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, TMDBService],
  exports: [ReviewsService],
})
export class ReviewsModule {}

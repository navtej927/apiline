import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReviewsController } from '@src/modules/reviews/reviews.controller';
import { ReviewsService } from '@src/modules/reviews/reviews.service';
import { TMDBService } from '@src/modules/suppliers/tmdb/tmdb.service';

@Module({
  imports: [HttpModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, TMDBService],
  exports: [ReviewsService],
})
export class ReviewsModule {}

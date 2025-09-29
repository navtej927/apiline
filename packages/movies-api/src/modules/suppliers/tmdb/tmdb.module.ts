import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TMDBService } from './tmdb.service';

@Module({
  imports: [HttpModule],
  providers: [TMDBService],
  exports: [TMDBService],
})
export class TMDBModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TMDBService } from '@src/modules/suppliers/tmdb/tmdb.service';

@Module({
  imports: [HttpModule],
  providers: [TMDBService],
  exports: [TMDBService],
})
export class TMDBModule {}

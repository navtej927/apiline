import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SimilarModule } from '../similar/similar.module';
import { TMDBModule } from '../suppliers/tmdb/tmdb.module';
import { OMDBModule } from '../suppliers/omdb/omdb.module';

@Module({
  imports: [HttpModule, SimilarModule, TMDBModule, OMDBModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}

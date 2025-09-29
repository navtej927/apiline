import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchController } from '@src/modules/search/search.controller';
import { SearchService } from '@src/modules/search/search.service';
import { SimilarModule } from '@src/modules/similar/similar.module';
import { TMDBModule } from '@src/modules/suppliers/tmdb/tmdb.module';
import { OMDBModule } from '@src/modules/suppliers/omdb/omdb.module';

@Module({
  imports: [HttpModule, SimilarModule, TMDBModule, OMDBModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}

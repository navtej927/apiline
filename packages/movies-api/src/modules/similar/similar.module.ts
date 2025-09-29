import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SimilarController } from '@src/modules/similar/similar.controller';
import { SimilarService } from '@src/modules/similar/similar.service';

@Module({
  imports: [HttpModule],
  controllers: [SimilarController],
  providers: [SimilarService],
  exports: [SimilarService],
})
export class SimilarModule {}

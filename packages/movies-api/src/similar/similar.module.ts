import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SimilarController } from './similar.controller';
import { SimilarService } from './similar.service';

@Module({
  imports: [HttpModule],
  controllers: [SimilarController],
  providers: [SimilarService],
  exports: [SimilarService],
})
export class SimilarModule {}

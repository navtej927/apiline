import { Module } from '@nestjs/common';
import { OMDBService } from './omdb.service';

@Module({
  providers: [OMDBService],
  exports: [OMDBService],
})
export class OMDBModule {}

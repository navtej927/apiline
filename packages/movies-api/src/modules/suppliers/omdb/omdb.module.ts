import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OMDBService } from './omdb.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [OMDBService],
  exports: [OMDBService],
})
export class OMDBModule {}

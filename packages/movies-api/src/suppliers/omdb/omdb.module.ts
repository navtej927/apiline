import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OMDBService } from './omdb.service';
import { OMDBController } from './omdb.controller';

@Module({
  imports: [HttpModule],
  controllers: [OMDBController],
  providers: [OMDBService],
  exports: [OMDBService],
})
export class OMDBModule {}

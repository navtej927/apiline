import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SimilarModule } from './similar/similar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule,
    SearchModule,
    ReviewsModule,
    SimilarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

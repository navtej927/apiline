import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SearchModule } from './search/search.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SimilarModule } from './similar/similar.module';
import { HealthModule } from './health/health.module';
import { appConfig, externalApisConfig, validate } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, externalApisConfig],
      validate,
    }),
    HttpModule,
    SearchModule,
    ReviewsModule,
    SimilarModule,
    HealthModule,
  ],
})
export class AppModule {}

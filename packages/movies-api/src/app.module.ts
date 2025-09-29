import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SearchModule } from './modules/search/search.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SimilarModule } from './modules/similar/similar.module';
import { HealthModule } from './modules/health/health.module';
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

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SearchModule } from '@src/modules/search/search.module';
import { ReviewsModule } from '@src/modules/reviews/reviews.module';
import { SimilarModule } from '@src/modules/similar/similar.module';
import { HealthModule } from '@src/modules/health/health.module';
import { appConfig, externalApisConfig, validate } from '@src/config';

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

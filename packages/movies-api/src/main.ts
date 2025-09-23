import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Set global prefix
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`Movies API is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start Movies API:', error);
});

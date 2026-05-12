import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CLIENT_URL, PORT } from './config/env';

// Add global prefix
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [CLIENT_URL],
  });
  app.setGlobalPrefix('api');
  await app.listen(PORT ?? 3000);
}
bootstrap();

/**
 * Simple NestJS server without MongoDB for demonstration
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppSimpleModule } from './app/app-simple.module';

async function bootstrap() {
  const app = await NestFactory.create(AppSimpleModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: 'http://localhost:4200', // Angular dev server
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
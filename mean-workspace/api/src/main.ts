/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static files from Angular build
  app.useStaticAssets(join(__dirname, '..', 'web', 'browser'), {
    index: false, // Don't serve index.html automatically
  });
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? true // Allow all origins in production for now
      : ['http://localhost:4200', 'http://localhost:8080', 'http://localhost:3000'],
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
  
  // Fallback to serve Angular app for non-API routes
  app.use('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      next();
    } else {
      res.sendFile(join(__dirname, '..', 'web', 'browser', 'index.html'));
    }
  });
  
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Application is running on port ${port} with prefix /${globalPrefix}`
  );
}

bootstrap().catch(err => {
  Logger.error('Error starting application:', err);
  process.exit(1);
});

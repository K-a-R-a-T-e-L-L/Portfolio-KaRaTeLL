import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger('ImageRequests');

  app.use((req, res, next) => {
    logger.log(`Request for ${req.url}`);
    next();
  });

  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  app.set('trust proxy', true);

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  });

  app.enableCors({
    origin: JSON.parse(process.env.ALLOWED_DOMAINS as string) || [],
    methods: 'GET,POST,DELETE, PUT',
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Range'],
    credentials: true
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();

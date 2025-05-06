import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  app.set('trust proxy', true);

  app.enableCors({
    origin:  JSON.parse(process.env.ALLOWED_DOMAINS as string) || [],
    methods: 'GET,POST,DELETE, PUT',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'Content-Range'],
    credentials: true
  });


  await app.listen(process.env.PORT || 4000);
}
bootstrap();

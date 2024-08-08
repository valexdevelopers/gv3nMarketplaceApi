/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const cors = {
    origin: ['http://localhost:5001'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  };

  app.enableCors(cors);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
}
bootstrap();

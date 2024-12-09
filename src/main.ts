import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { ModelNotFoundExceptionFilter } from './shared/filters/model-not-found.exception-filter';
import { DataTransformInterceptor } from './shared/interceptors/data-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/usuario');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(helmet());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new DataTransformInterceptor());

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new ModelNotFoundExceptionFilter(),
  );

  app.enableCors();

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      // TODO analisar em prod esse host
      host: '0.0.0.0',
      port: 4001,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

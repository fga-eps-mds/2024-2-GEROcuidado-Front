import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/shared/filters/all-exceptions.filter';
import { ModelNotFoundExceptionFilter } from '../src/shared/filters/model-not-found.exception-filter';
import { DataTransformInterceptor } from '../src/shared/interceptors/data-transform.interceptor';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

    await app.init();
  });

  describe('GET: /api/usuario/health-check', () => {
    it('/api/usuario/health-check (GET) Health Check', async () => {
      const response = await request(app.getHttpServer())
        .get('/health-check')
        .set('Content-Type', 'application/json')
        .send()
        .expect(200);

      expect(response.body).toEqual({
        message: 'GEROcuidadoApiUsuario health check Ok!',
        data: {},
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

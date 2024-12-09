import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { ModelNotFoundExceptionFilter } from './model-not-found.exception-filter';

const allExceptionsFilter = new ModelNotFoundExceptionFilter();

const json = {
  message: 'Registro(s) não encontrado(s)!',
  data: null,
};

const host = {
  switchToHttp: () => ({
    getResponse: () => ({
      status: (value: any) => ({
        json: (js: any) => js,
      }),
    }),
  }),
} as any;

describe('ModelNotFoundExceptionFilter', () => {
  it('should be defined', () => {
    expect(allExceptionsFilter).toBeDefined();
  });

  it('should be catch', async () => {
    const exception: EntityNotFoundError = new EntityNotFoundError(
      'Internal server error.',
      500,
    );
    const catchError = allExceptionsFilter.catch(exception, host);

    expect(catchError).toEqual(json);
  });
});

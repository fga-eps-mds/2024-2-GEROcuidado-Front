import { HttpException } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

const allExceptionsFilter = new AllExceptionsFilter<any>();

const json = {
  message: 'Internal server error.',
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

class TestResponseException {
  response: any;

  constructor(response: any) {
    this.response = response;
  }
}

class TestMessageException {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

describe('AllExceptionsFilter', () => {
  it('should be defined', () => {
    expect(allExceptionsFilter).toBeDefined();
  });

  it('should be catch', async () => {
    const exception: HttpException = new HttpException(
      'Internal server error.',
      500,
    );
    const catchError = allExceptionsFilter.catch(exception, host);

    expect(catchError).toEqual(json);
  });

  it('should be not exception to class-validator', async () => {
    const exception: TestResponseException = new TestResponseException({
      message: 'Internal server error.',
    });
    const catchError = allExceptionsFilter.catch(exception, host);

    expect(catchError).toEqual(json);
  });

  it('should be not exception only message', async () => {
    const exception: TestMessageException = new TestMessageException(
      'Internal server error.',
    );
    const catchError = allExceptionsFilter.catch(exception, host);

    expect(catchError).toEqual(json);
  });
});

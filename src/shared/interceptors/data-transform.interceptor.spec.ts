import { of } from 'rxjs';
import {
  DataTransformInterceptor,
  Response,
} from './data-transform.interceptor';

const interceptor = new DataTransformInterceptor<string>();

const executionContext = {
  switchToHttp: jest.fn().mockReturnThis(),
  getRequest: jest.fn().mockReturnThis(),
} as any;

const callHandler = {
  handle: jest.fn(),
};

const response: Response<string> = {
  message: 'teste',
  data: 'Data response',
};

describe('DataTransformInterceptor', () => {
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('should be intercept', () => {
    it('t1', async () => {
      jest.spyOn(callHandler, 'handle').mockImplementation(() => of(response));
      const actualValue = interceptor.intercept(executionContext, callHandler);

      actualValue.subscribe({
        next: (value) => {
          expect(value).toStrictEqual(response);
        },
      });

      expect(callHandler.handle).toBeCalledTimes(1);
    });

    it('should formatData with message', () => {
      const actualData: Response<string> = interceptor.formatData(response);
      expect(actualData).toEqual(response);
    });

    it('should formatData with no message', () => {
      const actualData: Response<string> =
        interceptor.formatData('Response message');
      expect(actualData).toEqual({
        message: null,
        data: 'Response message',
      });
    });

    it('should formatData with Paginate', () => {
      Object.assign(response, {
        count: 1,
        pageSize: 1,
      });
      const actualData: Response<string> = interceptor.formatData(response);
      expect(actualData).toEqual(response);
    });
  });
});

import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

import { Paginate, Pagination } from './paginate.decorator';

const query: any = {
  limit: 10,
  offset: 1,
};

const executionContext = {
  switchToHttp: () => ({
    getRequest: () => ({ query }),
  }),
} as any;

export function getParamDecoratorFactory(decorator: Function) {
  class Test {
    // @ts-ignore
    public test(@decorator() value: any) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
}

describe('Pagination', () => {
  it('should be defined', () => {
    expect(new Pagination(query)).toBeDefined();
  });

  it('should be Paginate', () => {
    const factory = getParamDecoratorFactory(Paginate);
    const result = factory(null, executionContext);
    expect(result).toEqual(new Pagination(query));
  });

  it('should be Paginate not limit', () => {
    const factory = getParamDecoratorFactory(Paginate);

    const offset: any = { offset: 1, limit: undefined };
    const executionContextLimit = {
      switchToHttp: () => ({
        getRequest: () => ({ query: offset }),
      }),
    } as any;
    const result = factory(null, executionContextLimit);
    expect(result).toEqual(new Pagination(offset));
  });

  it('should be Paginate not offset', () => {
    const factory = getParamDecoratorFactory(Paginate);

    const limit: any = { offset: undefined, limit: 10 };
    const executionContextOffset = {
      switchToHttp: () => ({
        getRequest: () => ({ query: limit }),
      }),
    } as any;
    const result = factory(null, executionContextOffset);
    expect(result).toEqual(new Pagination(limit));
  });
});

import { Filtering, Filtrate } from './filtrate.decorator';
import { getParamDecoratorFactory } from './paginate.decorator.spec';

interface TestFilterProps {
  id?: number;
  text?: string;
}

describe('Filtrate', () => {
  const stringFilter = '{"id":1,"text":"teste"}';
  const executionContext = {
    switchToHttp: () => ({
      getRequest: () => ({ query: { filter: stringFilter } }),
    }),
  } as any;

  it('should return empty object for filter', () => {
    expect(new Filtering<TestFilterProps>('')).toEqual({ filter: {} });
  });

  it('should return TestFilterProps object with values for filter', () => {
    expect(new Filtering<TestFilterProps>(stringFilter)).toEqual({
      filter: { id: 1, text: 'teste' },
    });
  });

  it('should be Filtrate using factory', () => {
    const factory = getParamDecoratorFactory(Filtrate);
    const result = factory(null, executionContext);
    expect(result).toEqual(new Filtering(stringFilter));
  });
});

import { FilteringString, FiltrateString } from './filtrate-string.decorator';
import { getParamDecoratorFactory } from './paginate.decorator.spec';

describe('FiltrateString', () => {
  const stringFilter = 'teste';
  const executionContext = {
    switchToHttp: () => ({
      getRequest: () => ({ query: { filter: stringFilter } }),
    }),
  } as any;

  it('should return empty object for filter', () => {
    expect(new FilteringString('')).toEqual({ filter: '' });
  });

  it('should return TestFilterProps object with values for filter', () => {
    expect(new FilteringString(stringFilter)).toEqual({
      filter: 'teste',
    });
  });

  it('should be FiltrateString using factory', () => {
    const factory = getParamDecoratorFactory(FiltrateString);
    const result = factory(null, executionContext);
    expect(result).toEqual(new FilteringString(stringFilter));
  });
});

import { createHash, isJsonObject, isNil } from './commons';

describe('Helper', () => {
  it('deve criar um hash com tamanho default', async () => {
    const hash = await createHash();
    expect(hash).toBeDefined();
    expect(hash).toHaveLength(6);
  });

  it('should be return if its nill for undefined', () => {
    expect(isNil(undefined)).toEqual(true);
  });

  it('should be return if its nill for null', () => {
    expect(isNil(null)).toEqual(true);
  });

  it('should be isJsonObject to be true', () => {
    const isObject = isJsonObject(`{ "id": 1 }`);
    expect(isObject).toBeTruthy();
  });

  it('should be isJsonObject to be false', () => {
    const isObject = isJsonObject(`test`);
    expect(isObject).toBeFalsy();
  });

  it('should be isJsonObject to be false in not parse', () => {
    const isObject = isJsonObject(`{ id: 1 }`);
    expect(isObject).toBeFalsy();
  });
});

import { clearSqlInject } from './string-helpers';

describe('String Helpers', () => {
  it('should be regex', () => {
    const regex = clearSqlInject('4><*$');
    expect(regex).toBe('4');
  });
});

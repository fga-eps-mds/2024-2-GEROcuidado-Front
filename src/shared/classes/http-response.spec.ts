import { HttpResponse } from './http-response';

describe('HttpResponse', () => {
  it('should be defined', () => {
    expect(new HttpResponse({})).toBeDefined();
  });

  it('should create message with payload text', () => {
    const response = new HttpResponse({});
    const created = response.onSuccess('Salvo com sucesso!');

    const expected = {
      message: 'Salvo com sucesso!',
      data: {},
    };

    expect(created).toEqual(expected);
  });

  it('should create message with success text', () => {
    const response = new HttpResponse({});
    const created = response.onCreated();

    const expected = {
      message: 'Salvo com sucesso!',
      data: {},
    };

    expect(created).toEqual(expected);
  });

  it('should create message with updated text', () => {
    const response = new HttpResponse({});
    const updated = response.onUpdated();

    const expected = {
      message: 'Atualizado com sucesso!',
      data: {},
    };

    expect(updated).toEqual(expected);
  });

  it('should create message with deleted text', () => {
    const response = new HttpResponse({});
    const updated = response.onDeleted();

    const expected = {
      message: 'Excluído com sucesso!',
      data: {},
    };

    expect(updated).toEqual(expected);
  });

  it('should create message with login text', () => {
    const response = new HttpResponse({});
    const updated = response.onLogin();

    const expected = {
      message: 'Login efetuado com sucesso!',
      data: {},
    };

    expect(updated).toEqual(expected);
  });
});

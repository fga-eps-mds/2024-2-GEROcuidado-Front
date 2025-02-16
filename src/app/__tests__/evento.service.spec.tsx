import { IEvento, IEventoBody, IEventoFilter, IOrder } from "../interfaces/evento.interface";
import { IResponse } from "../interfaces/response.interface";
import * as eventoService from "../services/evento.service"; 

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_PORT = process.env.EXPO_PUBLIC_API_SAUDE_PORT;
const BASE_URL = `${API_URL}:${API_PORT}/api/saude/evento`;

describe('evento.service.ts', () => {
  const mockEvento: IEvento = {
    id: '1',
    titulo: 'Festa de Teste',
    descricao: 'Testando tudo',
    dataHora: '2024-03-10T10:00:00.000Z',
    categoria: 'Evento',
    local: 'local',
    participantes: ['participante1', 'participante2'],
    createdAt: '2024-03-05T10:00:00.000Z',
    updatedAt: '2024-03-05T10:00:00.000Z',
  };

  const mockToken = 'mockToken';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um evento com sucesso', async () => {
    const mockResponse: IResponse<IEvento> = {
      status: 201,
      message: 'Evento criado com sucesso',
      data: mockEvento,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 201,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as Response);

    const result = await eventoService.postEvento(mockEvento, mockToken);
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(BASE_URL, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
      body: JSON.stringify(mockEvento),
    });
  });

  it('deve lidar com erro ao criar um evento', async () => {
    const mockResponse: IResponse<string> = {
      status: 400,
      message: 'Erro ao criar evento',
      data: '',
    };

    global.fetch = jest.fn().mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), {
        status: 400,
        headers: {
            'Content-Type': 'application/json',
        },
    }));

    await expect(eventoService.postEvento(mockEvento, mockToken)).rejects.toThrow(mockResponse.message as string);
    expect(global.fetch).toHaveBeenCalledWith(BASE_URL, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
      body: JSON.stringify(mockEvento),
    });
  });

  it('deve listar todos os eventos com sucesso', async () => {
    const mockResponse: IResponse<IEvento> = {
      status: 200,
      message: 'Eventos listados com sucesso',
      data: [mockEvento],
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as Response);

    const filter: IEventoFilter = {};
    const order: IOrder = { field: 'dataHora', direction: 'asc' };
    const result = await eventoService.getAllEvento(filter, order);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}?limit=20&offset=0&filter={}&order={"field":"dataHora","direction":"asc"}`, {
      method: 'GET',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  });

  it('deve lidar com erro ao listar todos os eventos', async () => {
    const mockResponse: IResponse<null> = {
      status: 400,
      message: 'Erro ao listar eventos',
      data: null,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 400,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as Response);

    const filter: IEventoFilter = {};
    const order: IOrder = { field: 'dataHora', direction: 'asc' };
    await expect(eventoService.getAllEvento(filter, order)).rejects.toThrow(mockResponse.message as string);

    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}?limit=20&offset=0&filter={}&order={"field":"dataHora","direction":"asc"}`, {
      method: 'GET',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  });

  it('deve atualizar um evento com sucesso', async () => {
    const mockResponse: IResponse<IEvento> = {
      status: 200,
      message: 'Evento atualizado com sucesso',
      data: mockEvento,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as Response);

    const result = await eventoService.updateEvento(1, mockEvento, mockToken);
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/1`, {
      method: 'PATCH',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
      body: JSON.stringify(mockEvento),
    });
  });

  it('deve lidar com erro ao atualizar um evento', async () => {
    const mockResponse: IResponse<null> = {
      status: 400,
      message: 'Erro ao atualizar evento',
      data: null,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 400,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as Response);

    await expect(eventoService.updateEvento(1, mockEvento, mockToken)).rejects.toThrowError(mockResponse.message);
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/1`, {
      method: 'PATCH',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
      body: JSON.stringify(mockEvento),
    });
  });

  it('deve excluir um evento com sucesso', async () => {
    const mockResponse: IResponse<IEvento> = {
      status: 200,
      message: 'Evento excluído com sucesso',
      data: mockEvento,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as Response);

    const result = await eventoService.deleteEvento(1, mockToken);
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/1`, {
      method: 'DELETE',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
    });
  });

  it('deve lidar com erro ao excluir um evento', async () => {
    const mockResponse: IResponse<null> = {
      status: 400,
      message: 'Erro ao excluir evento',
      data: null,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 400,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as Response);

    await expect(eventoService.deleteEvento(1, mockToken)).rejects.toThrow(mockResponse.message as string);
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/1`, {
      method: 'DELETE',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
    });
  });
});
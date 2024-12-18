declare global {
  namespace NodeJS {
    interface Global {
      fetch: jest.Mock;
    }
  }
}

import { postMetrica, getAllMetrica, updateMetrica, getSomaHidratacao } from "../services/metrica.service";
const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}:${process.env.EXPO_PUBLIC_API_SAUDE_PORT}/api/saude/metrica`;

global.fetch = jest.fn();

describe("metricas.service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("postMetrica", () => {
    it("deve chamar a API corretamente ao criar uma métrica", async () => {
      const mockBody = {
        /* Seu corpo de exemplo aqui */
      };
      const mockToken = "seu-token-de-exemplo";

      const mockResponse = {
        status: 201,
        json: jest.fn().mockResolvedValue({
          /* Seu objeto de resposta aqui */
        }),
      };

      global.fetch.mockResolvedValue(mockResponse);

      await postMetrica(mockBody, mockToken);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify(mockBody),
        }),
      );
    });

    it("deve lançar um erro se a resposta da API não for bem-sucedida", async () => {
      const mockBody = {};
      const mockToken = "seu-token-de-exemplo";

      const mockResponse = {
        status: 500,
        json: jest.fn().mockResolvedValue({ message: "Erro na API" }),
      };

      global.fetch.mockResolvedValue(mockResponse);

      await expect(postMetrica(mockBody, mockToken)).rejects.toThrow(
        "Erro na API",
      );
    });
  });

  describe("getAllMetrica", () => {
    it("deve chamar a API corretamente ao obter todas as métricas", async () => {
      const mockFilter = {};

      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({}),
      };

      global.fetch.mockResolvedValue(mockResponse);

      await getAllMetrica(mockFilter);

      const expectedParams = `limit=20&offset=0&filter=${JSON.stringify(
        mockFilter,
      )}`;

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(expectedParams),
        expect.objectContaining({
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      );
    });

    it("deve lançar um erro se a resposta da API não for bem-sucedida", async () => {
      const mockFilter = {};

      const mockResponse = {
        status: 500,
        json: jest.fn().mockResolvedValue({ message: "Erro na API" }),
      };

      global.fetch.mockResolvedValue(mockResponse);

      await expect(getAllMetrica(mockFilter)).rejects.toThrow("Erro na API");
    });
  });
});

describe("updateMetrica", () => {
  it("deve chamar a API corretamente ao atualizar uma métrica", async () => {
    const mockId = 1;
    const mockBody = { /* corpo da atualização */ };
    const mockToken = "seu-token-de-exemplo";

    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValue({
        /* resposta esperada aqui */
      }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    await updateMetrica(mockId, mockBody, mockToken);

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/${mockId}`,
      expect.objectContaining({
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(mockBody),
      }),
    );
  });

  it("deve lançar um erro se a resposta da API não for bem-sucedida", async () => {
    const mockId = 1;
    const mockBody = {};
    const mockToken = "seu-token-de-exemplo";

    const mockResponse = {
      status: 500,
      json: jest.fn().mockResolvedValue({ message: "Erro na API" }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    await expect(updateMetrica(mockId, mockBody, mockToken)).rejects.toThrow("Erro na API");
  });
}); 

describe("getSomaHidratacao", () => {
  it("deve chamar a API corretamente ao obter a soma de hidratação", async () => {
    const mockId = 1;
    const mockToken = "seu-token-de-exemplo";

    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValue({ data: 100 }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    const result = await getSomaHidratacao(mockId, mockToken);

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/soma-hidratacao/${mockId}`,
      expect.objectContaining({
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
      }),
    );

    expect(result).toBe(100);
  });

  it("deve lançar um erro se a resposta da API não for bem-sucedida", async () => {
    const mockId = 1;
    const mockToken = "seu-token-de-exemplo";

    const mockResponse = {
      status: 500,
      json: jest.fn().mockResolvedValue({ message: "Erro na API" }),
    };

    global.fetch.mockResolvedValue(mockResponse);

    await expect(getSomaHidratacao(mockId, mockToken)).rejects.toThrow("Erro na API");
  });
});
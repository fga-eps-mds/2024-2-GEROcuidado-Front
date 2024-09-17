import {getAllMetricaValues, postMetricaValue, deleteMetricaValue} from "../services/metricaValue.service";
import { IValorMetricaBody, IMetricaValueFilter, IOrder } from "../interfaces/metricas.interface";
  
  // Mocks de variáveis globais e funções
  const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}:${process.env.EXPO_PUBLIC_API_SAUDE_PORT}/api/saude/valorMetrica`;
  global.fetch = jest.fn();
  
  describe("metricaValue.service", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    describe("getAllMetricaValues", () => {
      it("deve chamar a API corretamente ao obter todos os valores de métrica", async () => {
        const mockFilter: IMetricaValueFilter = { };
        const mockOrder: IOrder = {  };
  
        const mockResponse = {
          status: 200,
          json: jest.fn().mockResolvedValue({ data: [] }),
        };
  
        global.fetch.mockResolvedValue(mockResponse);
  
        const result = await getAllMetricaValues(mockFilter, mockOrder);
  
        expect(global.fetch).toHaveBeenCalledWith(
          `${BASE_URL}?limit=20&offset=0&filter=${JSON.stringify(mockFilter)}&order=${JSON.stringify(mockOrder)}`,
          expect.objectContaining({
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }),
        );
  
        expect(result).toEqual({ data: [] });
      });
    });

    it("deve lançar um erro se a resposta da API não for bem-sucedida", async () => {
        const mockFilter: IMetricaValueFilter = {};
        const mockOrder: IOrder = {};
  
        const mockResponse = {
          status: 500,
          json: jest.fn().mockResolvedValue({ message: "Erro na API" }),
        };
  
        global.fetch.mockResolvedValue(mockResponse);
  
        await expect(getAllMetricaValues(mockFilter, mockOrder)).rejects.toThrow("Erro na API");
    });
  });

  describe("postMetricaValue", () => {
    it("deve chamar a API corretamente ao criar um valor de métrica", async () => {
      const mockBody: IValorMetricaBody = { };
      const mockToken = "token-exemplo";

      const mockResponse = {
        status: 201,
        json: jest.fn().mockResolvedValue({ data: { id: 1 } }),
      };

      global.fetch.mockResolvedValue(mockResponse);

      const result = await postMetricaValue(mockBody, mockToken);

      expect(global.fetch).toHaveBeenCalledWith(
        BASE_URL,
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

      expect(result).toEqual({ data: { id: 1 } });
    });

    it("deve lançar um erro se a resposta da API não for bem-sucedida", async () => {
      const mockBody: IValorMetricaBody = {};
      const mockToken = "token-exemplo";

      const mockResponse = {
        status: 500,
        json: jest.fn().mockResolvedValue({ message: "Erro na API" }),
      };

      global.fetch.mockResolvedValue(mockResponse);

      await expect(postMetricaValue(mockBody, mockToken)).rejects.toThrow("Erro na API");
    });
  });

  describe("deleteMetricaValue", () => {
    it("deve chamar a API corretamente ao deletar um valor de métrica", async () => {
      const mockId = 1;
      const mockToken = "token-exemplo";

      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({ message: "Deletado com sucesso" }),
      };

      global.fetch.mockResolvedValue(mockResponse);

      const result = await deleteMetricaValue(mockId, mockToken);

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/${mockId}`,
        expect.objectContaining({
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockToken}`,
          },
        }),
      );

      expect(result).toEqual({ message: "Deletado com sucesso" });
    });
});
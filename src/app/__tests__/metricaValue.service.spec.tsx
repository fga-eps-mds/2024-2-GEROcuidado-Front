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
        const mockFilter: IMetricaValueFilter = { /* defina um mock válido de filtro */ };
        const mockOrder: IOrder = { /* defina uma ordem válida */ };
  
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
  });
  
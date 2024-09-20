import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VisualizarMetrica from "../private/pages/visualizarMetrica";
import ValorMetrica from "../model/ValorMetrica";

// Mock para AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock para metrica.service
jest.mock("../services/metrica.service", () => ({
  getValoresMetrica: jest.fn(() => Promise.resolve([{ id: '123', categoria: 'HIDRATACAO', valorMaximo: 2000 }])),
  getSomaHidratacao: jest.fn(() => Promise.resolve(1500)),
}));

// Mock para expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({
    id: '123',
    categoria: 'HIDRATACAO',
  })),
}));

describe("VisualizarMetrica component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === "usuario") {
        return Promise.resolve(JSON.stringify({ id: 1 }));
      } else if (key === "token") {
        return Promise.resolve("mockedToken");
      }
      return Promise.resolve(null);
//
//      // Limpar os mocks antes de cada teste
//      jest.clearAllMocks();
    });
    
  });

  it('deve retornar o valor mockado de AsyncStorage.getItem', async () => {
    // Mock da implementação de AsyncStorage.getItem para retornar um valor simulado
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      return Promise.resolve('valor para a chave: ${key}');
    });

    // Chame a função que utiliza AsyncStorage.getItem
    const key = 'teste_chave';
    const value = await AsyncStorage.getItem(key);

    // Verifique se o valor retornado é o esperado
    expect(value).toBe('valor para a chave: ${key}');

    // Verifique se AsyncStorage.getItem foi chamado corretamente
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
  });

  test("renders 'Novo valor' button when category is not IMC", async () => {
      const { getByText } = render(<VisualizarMetrica />);

      await waitFor(() => {
        const novoValorButton = getByText("Novo valor");
        expect(novoValorButton).toBeTruthy();
      });
    });

  it('deve retornar null se a chave não existir no AsyncStorage', async () => {
    // Mock da implementação de AsyncStorage.getItem para retornar null
    (AsyncStorage.getItem as jest.Mock).mockImplementation(() => {
      return Promise.resolve(null);
    });

    const key = 'chave_inexistente';
    const value = await AsyncStorage.getItem(key);

    // Verifique se o valor retornado é null
    expect(value).toBeNull();
  });

  test("renders the component correctly", async () => {
    const { getByText } = render(<VisualizarMetrica />);

    await waitFor(() => {
      const categoriaText = getByText("HIDRATACAO");
      expect(categoriaText).toBeTruthy();
    });
  });


  test("should retrieve idoso from AsyncStorage and update state", async () => {
    const mockIdoso = { id: 1, name: "Teste idoso" };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockIdoso));

    const { queryByText } = render(<VisualizarMetrica />);

    await waitFor(() => {

      const idosoName = queryByText("Teste idoso");
      expect(idosoName).toBeNull();
    });
  });

    test("should not update state if no idoso is found", async () => {

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const { queryByText } = render(<VisualizarMetrica />);

      await waitFor(() => {
        const idosoName = queryByText("Teste idoso");
        expect(idosoName).toBeNull();
      });
    });

  test("opens the modal when 'Novo valor' button is pressed", async () => {
    const { getByText } = render(<VisualizarMetrica />);

    await waitFor(() => {
      const addButton = getByText("Novo valor");
      expect(addButton).toBeTruthy();
    });

    fireEvent.press(getByText("Novo valor"));

    await waitFor(() => {
      const salvarButton = getByText("Salvar");
      expect(salvarButton).toBeTruthy();
    });
  });

  test("does not call calcular for categories other than 'IMC'", async () => {
    const { queryByText } = render(<VisualizarMetrica />);

    await waitFor(() => {
      const calcularButton = queryByText("Calcular automaticamente");
      expect(calcularButton).toBeNull();
    });
  });

  test("handleUser - should handle empty AsyncStorage values", async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => Promise.resolve(null));
    render(<VisualizarMetrica />);
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("usuario");
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("token");
    });
  });

  test("closes the modal when 'Cancelar' is pressed", async () => {
    const { getByText, queryByText } = render(<VisualizarMetrica />);

    await waitFor(() => {
      const addButton = getByText("Novo valor");
      expect(addButton).toBeTruthy();
    });

    fireEvent.press(getByText("Novo valor"));

    await waitFor(() => {
      expect(getByText("Salvar")).toBeTruthy();
    });

    fireEvent.press(getByText("Cancelar"));

    await waitFor(() => {
      expect(queryByText("Salvar")).toBeFalsy();
    });
  });

  test("calculates IMC when category is 'IMC'", async () => {
    jest.mock("expo-router", () => ({
      router: {
        push: jest.fn(),
        replace: jest.fn(),
      },
      useLocalSearchParams: jest.fn(() => ({
        id: '123',
        categoria: 'IMC',
      })),
    }));
  });
  
  test("closes the modal when 'Cancelar' is pressed", async () => {
    const { getByText, queryByText } = render(<VisualizarMetrica />);
  
    await waitFor(() => {
      const addButton = getByText("Novo valor");
      expect(addButton).toBeTruthy();
    });
  
    fireEvent.press(getByText("Novo valor"));
  
    await waitFor(() => {
      expect(getByText("Salvar")).toBeTruthy();
    });
  
    fireEvent.press(getByText("Cancelar"));
  
    await waitFor(() => {
      expect(queryByText("Salvar")).toBeFalsy();
    });
  
  });
  
  test("does not show 'Novo valor' button when categoria is different", async () => {
    jest.mock("expo-router", () => ({
      router: {
        push: jest.fn(),
        replace: jest.fn(),
      },
      useLocalSearchParams: jest.fn(() => ({
        id: '123',
        categoria: 'OUTRA_CATEGORIA',
      })),
    }));
  
    const { queryByText } = render(<VisualizarMetrica />);
  
    await waitFor(() => {
      const addButton = queryByText("Novo valor");
      expect(addButton).toBeNull();
    });
  });

});
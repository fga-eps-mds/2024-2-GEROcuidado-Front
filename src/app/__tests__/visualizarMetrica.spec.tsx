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
    });    
  });

  test("renders the component correctly", async () => {
    const { getByText } = render(<VisualizarMetrica />);

    await waitFor(() => {
      const categoriaText = getByText("HIDRATACAO");
      expect(categoriaText).toBeTruthy();
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
      expect(getByText("Salvar")).toBeTruthy(); // Confirma que o modal está aberto
    });

    fireEvent.press(getByText("Cancelar")); // Supondo que exista um botão de cancelar

    await waitFor(() => {
      expect(queryByText("Salvar")).toBeFalsy(); // Verifica se o modal foi fechado
    });
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
    expect(getByText("Salvar")).toBeTruthy(); // Confirma que o modal está aberto
  });

  fireEvent.press(getByText("Cancelar")); // Supondo que exista um botão de cancelar

  await waitFor(() => {
    expect(queryByText("Salvar")).toBeFalsy(); // Verifica se o modal foi fechado
  });

});


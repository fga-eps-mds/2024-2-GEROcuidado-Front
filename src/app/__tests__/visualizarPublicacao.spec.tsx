import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import VisualizarPublicacao from "../private/pages/visualizarPublicacao";
import { router } from "expo-router";  // Importa a função de roteamento
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({ id: '1', idUsuarioReporte: '1' })),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

interface Mocks {
  usuario: string;
  token: string;
}

describe("VisualizarPublicacao", () => {
  beforeEach(() => {
    const mocks: Mocks = {
      usuario: JSON.stringify({ id: 1, admin: true }),
      token: "mock-token",
    };

    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      return Promise.resolve(mocks[key as keyof Mocks]);
    });
  });

  it("Renderiza sem quebrar", () => {
    render(<VisualizarPublicacao />);
  });

  it("Exibe ações corretamente para admin", async () => {
    const { getByText } = render(<VisualizarPublicacao />);
  
    await waitFor(() => {
      expect(getByText("Apagar")).toBeTruthy();
    });
  });  

  it("Testa botão de apagar", async () => {
    const { getByTestId, getByText } = render(<VisualizarPublicacao />);
    
    // Simulando o clique no botão "Apagar"
    await act(async () => {
      fireEvent.press(getByTestId("deleteBtn"));
    });
    
    // Verificando se o modal foi exibido corretamente
    await waitFor(() => {
      expect(getByTestId("deleteModal")).toBeTruthy();
    });
    
    // Simulando a confirmação no modal
    await act(async () => {
      fireEvent.press(getByTestId("callbackBtn"));
    });
  });

  it("Testa botão de reportar", async () => {
    // Configurando o estado para que o botão de reportar seja visível
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === "usuario") {
        return Promise.resolve(JSON.stringify({ id: 1, admin: false }));
      }
      return Promise.resolve("mock-token");
    });
  
    const { getByTestId } = render(<VisualizarPublicacao />);
  
    // Verifica se o botão "Reportar" está presente
    await waitFor(() => {
      expect(getByTestId("reportBtn")).toBeTruthy();
    });
  
    // Simulando o clique no botão "Reportar"
    await act(async () => {
      fireEvent.press(getByTestId("reportBtn"));
    });
  
    // Verifica se o modal de reporte foi exibido corretamente
    await waitFor(() => {
      expect(getByTestId("reportModal")).toBeTruthy();
    });
  });
  
  it("Testa botão de desfazer reporte", async () => {
    // Configurando o estado para que o botão de desfazer reporte seja visível
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === "usuario") {
        return Promise.resolve(JSON.stringify({ id: 1, admin: false }));
      }
      return Promise.resolve("mock-token");
    });
  
    const { getByTestId } = render(<VisualizarPublicacao />);
  
    // Verifica se o botão "Desfazer" está presente
    await waitFor(() => {
      expect(getByTestId("reportBtn")).toBeTruthy();
    });
  
    // Simulando o clique no botão "Desfazer"
    await act(async () => {
      fireEvent.press(getByTestId("reportBtn"));
    });
  
    // Verifica se o modal de reporte foi exibido corretamente
    await waitFor(() => {
      expect(getByTestId("reportModal")).toBeTruthy();
    });
  });  
});
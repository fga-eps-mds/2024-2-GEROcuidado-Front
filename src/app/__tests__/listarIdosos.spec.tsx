import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import ListarIdosos from "../private/pages/listarIdosos";
import { getAllIdoso } from "../services/idoso.service"; // Função para buscar idosos no servidor
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Mocking
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({
    id: "123",
    nome: "Nome Teste",
    foto: null,
  }),
  router: {
    push: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  },
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  }),
}));

jest.mock("../db/index", () => ({
  get: jest.fn().mockReturnValue({
    query: jest.fn().mockReturnValue({
      fetch: jest.fn().mockResolvedValueOnce([
        { _raw: { id: 1, nome: "Idoso 1", foto: "foto1.jpg" } },
        { _raw: { id: 2, nome: "Idoso 2", foto: "foto2.jpg" } },
      ]), 
    }),
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("../services/idoso.service", () => ({
  getAllIdoso: jest.fn(),
}));

describe("ListarIdosos", () => {

  it("deve exibir a lista de idosos após a conclusão da chamada da API", async () => {
    // Mock do AsyncStorage para retornar um usuário com ID
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === "usuario") {
        return Promise.resolve(JSON.stringify({ id: 1 }));
      }
      return Promise.resolve(null);
    });

    const { getByText } = render(<ListarIdosos />);

    // Aguarda a resolução da promessa e a renderização dos dados
    await waitFor(() => expect(getByText("Idoso 1")).toBeTruthy());
    expect(getByText("Idoso 2")).toBeTruthy();
  });

  it("deve exibir mensagem de loading enquanto aguarda a resposta da API", () => {
    // Mockando getAllIdoso para um valor vazio (ou seja, a resposta demora)
    (getAllIdoso as jest.Mock).mockResolvedValueOnce([]);

    const { getByTestId } = render(<ListarIdosos />);

    expect(getByTestId("loading")).toBeTruthy();
  });

  it("deve sincronizar dados locais com o servidor quando houver conectividade", async () => {
    // Simulando dados locais e remoto
    const localData = [
      { _raw: { id: 1, nome: "Idoso 1", foto: "foto1.jpg" } },
    ];
    const remoteData = [
      { id: 1, nome: "Idoso 1", foto: "foto1.jpg" },
      { id: 2, nome: "Idoso 2", foto: "foto2.jpg" },
    ];

    // Mock para retornar dados locais e dados de sincronização
    (getAllIdoso as jest.Mock).mockResolvedValue(remoteData);

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({ id: 1 }));

    const { getByText } = render(<ListarIdosos />);

    // Verificando se a lista local e remota são atualizadas após a sincronização
    await waitFor(() => expect(getByText("Idoso 2")).toBeTruthy());
  });

  it("deve navegar para a tela de cadastro ao clicar no botão de adicionar", async () => {
    const { getByTestId } = render(<ListarIdosos />);

    const cadastroBtn = getByTestId("add-button");

    fireEvent.press(cadastroBtn);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/private/pages/cadastrarIdoso");
    });
  });

  test("Navega para a tela anterior ao clicar no botão de voltar", async () => {
    const { getByTestId } = render(<ListarIdosos />);

    const backButton = getByTestId("back-button-pressable");

    fireEvent.press(backButton);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/private/tabs/perfil");
    });
  });
});

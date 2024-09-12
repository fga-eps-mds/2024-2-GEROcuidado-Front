import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import CadastrarIdoso from "../private/pages/cadastrarIdoso";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useRouter } from "expo-router";

// Mock any dependencies if needed
// Substituindo o módulo real do expo-router por uma versão mockada
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({
    id: "123",
    nome: "Nome Teste",
    foto: null,
  }),
  router: {
    push: jest.fn(), // Mocka o método push para verificações de navegação
    back: jest.fn(), // Mocka o método back para o caso de não haver a prop route
    canGoBack: jest.fn().mockReturnValue(true), // Mocka o método canGoBack
  },
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(), // Mocka novamente o push no caso do uso da função useRouter
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  }),
}));
// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

describe("CadastrarIdoso component", () => {
  test("renders correctly", () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === "usuario") {
        return Promise.resolve(JSON.stringify({ id: 1 }));
      } else if (key === "token") {
        return Promise.resolve("mockedToken");
      }
      return Promise.resolve(null);
    });

    const { getByText } = render(<CadastrarIdoso />);

    const cadastrarButton = getByText("Cadastrar");
    expect(cadastrarButton).toBeTruthy();
  });

  it("Salvar sem nome", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <CadastrarIdoso />,
    );

    const nome = getByPlaceholderText("Nome");
    const cadastrar = getByText("Cadastrar");

    act(() => {
      fireEvent.changeText(nome, "");
      fireEvent.press(cadastrar);
    });
    const erroTitulo = getByTestId("Erro-nome");

    expect(erroTitulo.props.children.props.text).toBe("Campo obrigatório!");
  });

  it("Salvar com nome muito grande", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <CadastrarIdoso />,
    );

    const titulo = getByPlaceholderText("Nome");
    const cadastrar = getByText("Cadastrar");

    act(() => {
      fireEvent.changeText(
        titulo,
        "Por que o livro de matemática está sempre triste? Porque tem muitos problemas!",
      );
      fireEvent.press(cadastrar);
    });
    const erroTitulo = getByText(
      "O nome completo deve ter no máximo 60 caracteres.",
    );

    expect(erroTitulo).toBeTruthy();
  });

  it("Salvar com nome curto", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <CadastrarIdoso />,
    );

    const nome = getByPlaceholderText("Nome");
    const cadastrar = getByText("Cadastrar");

    act(() => {
      fireEvent.changeText(nome, "Jo");
      fireEvent.press(cadastrar);
    });
    const erroTitulo = getByTestId("Erro-nome");

    expect(erroTitulo.props.children.props.text).toBe(
      "O nome completo deve ter pelo menos 5 caracteres.",
    );
  });

  it("Salvar data com formato errado", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <CadastrarIdoso />,
    );

    const data = getByPlaceholderText("Data de Nascimento");
    const salvar = getByText("Cadastrar");

    act(() => {
      fireEvent.changeText(data, "2010");
      fireEvent.press(salvar);
    });
    const erroData = getByTestId("Erro-data");

    expect(erroData.props.children.props.text).toBe(
      "Data deve ser no formato dd/mm/yyyy!",
    );
  });

  it("Salvar com telefone errado", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <CadastrarIdoso />,
    );

    const data = getByPlaceholderText("Telefone Responsável");
    const salvar = getByText("Cadastrar");

    act(() => {
      fireEvent.changeText(data, "55111");
      fireEvent.press(salvar);
    });
    const erroData = getByTestId("Erro-telefone");

    expect(erroData.props.children.props.text).toBe(
      "Deve estar no formato (XX)XXXXX-XXXX",
    );
  });

    // Novo teste para verificar a navegação ao clicar no botão de voltar na tela de cadastrar idoso
    test("Navega para a tela anterior ao clicar no botão de voltar", async () => {
      // Renderiza o componente EditarPerfil
      const { getByTestId } = render(<CadastrarIdoso />);
  
      // Obtendo o botão de voltar
      const backButton = getByTestId("back-button-pressable");
  
      // Simula o clique no botão de voltar
      fireEvent.press(backButton);
  
      // Verifica se a função de navegação foi chamada corretamente e se ele navega pra tela de listar idosos
      await waitFor(() => {
        // expect(router.push).toHaveBeenCalledWith("/private/pages/listarIdosos");
        expect(router.push).toHaveBeenCalledWith("/private/pages/listarIdosos");
      });
    });
});

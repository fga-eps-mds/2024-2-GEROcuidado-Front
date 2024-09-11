import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import CadastrarRotina from "../private/pages/cadastrarRotina";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Notifications } from "expo-notifications";
import Toast from "react-native-toast-message";

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
}));

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("CadastrarRotina component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly", () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === "token") {
        return Promise.resolve("mockedToken");
      }
      return Promise.resolve(null);
    });

    const { getByText } = render(<CadastrarRotina />);

    const salvarButton = getByText("Salvar");
    expect(salvarButton).toBeTruthy();
  });

  it("Mostra erro quando o título está vazio", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<CadastrarRotina />);

    const titulo = getByPlaceholderText("Adicionar título");
    const salvar = getByText("Salvar");

    act(() => {
      fireEvent.changeText(titulo, "");
      fireEvent.press(salvar);
    });

    const erroTitulo = getByTestId("Erro-titulo");
    expect(erroTitulo.props.children.props.text).toBe("Campo obrigatório!");
  });

  it("Mostra erro quando o título é muito longo", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<CadastrarRotina />);

    const titulo = getByPlaceholderText("Adicionar título");
    const salvar = getByText("Salvar");

    act(() => {
      fireEvent.changeText(titulo, "A".repeat(101));
      fireEvent.press(salvar);
    });

    const erroTitulo = getByTestId("Erro-titulo");
    expect(erroTitulo.props.children.props.text).toBe("O título deve ter no máximo 100 caracteres.");
  });

  it("Mostra erro para o formato de data incorreta", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<CadastrarRotina />);

    const data = getByPlaceholderText("Data da rotina");
    const salvar = getByText("Salvar");

    act(() => {
      fireEvent.changeText(data, "2010");
      fireEvent.press(salvar);
    });

    const erroData = getByTestId("Erro-data");
    expect(erroData.props.children.props.text).toBe("Data deve ser no formato dd/mm/yyyy!");
  });

  it("Mostra erro para o formato de tempo incorreto", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<CadastrarRotina />);

    const hora = getByPlaceholderText("Horário de início");
    const salvar = getByText("Salvar");

    act(() => {
      fireEvent.changeText(hora, "125:00");
      fireEvent.press(salvar);
    });

    const erroHora = getByTestId("Erro-hora");
    expect(erroHora.props.children.props.text).toBe("Hora deve ser no formato hh:mm!");
  });

  it("Mostra erro quando descrição é muito longa", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<CadastrarRotina />);

    const descricao = getByPlaceholderText("Descrição");
    const salvar = getByText("Salvar");

    act(() => {
      fireEvent.changeText(descricao, "A".repeat(301));
      fireEvent.press(salvar);
    });

    const erroDescricao = getByTestId("Erro-descricao");
    expect(erroDescricao.props.children.props.text).toBe("A descrição deve ter no máximo 300 caracteres.");
  });
});

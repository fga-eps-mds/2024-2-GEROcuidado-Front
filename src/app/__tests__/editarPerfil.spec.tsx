import React from "react";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react-native";
import EditarPerfil from "../private/pages/editarPerfil";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_PORT = process.env.EXPO_PUBLIC_API_USUARIO_PORT;
const BASE_URL = `${API_URL}:${API_PORT}/api/usuario`;


jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("react-native-toast-message");
jest.mock("../db");

describe("EditarPerfil", () => {

  const mockUser = {
    id: 1,
    nome: "Ana Testando",
    email: "teste@example.com",
    foto: null,
    data_nascimento: "2000-01-01T12:00:00.000Z",
    descricao: "Descrição de teste",
  };

  const usersCollection = {
    query: jest.fn().mockReturnThis(),
    fetch: jest.fn(),
    update: jest.fn().mockReturnThis(),
    destroyPermanently: jest.fn(),
  };

  beforeEach(() => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o componente corretamente", () => {
    render(<EditarPerfil />);

    expect(screen.getByText("teste@example.com")).toBeTruthy();
  });

  it("atualiza o perfil com sucesso", async () => {
    render(<EditarPerfil />);

    fireEvent.changeText(screen.getByPlaceholderText("Nome completo"), "Novo Nome");
    fireEvent.changeText(screen.getByPlaceholderText("Senha"), "novasenha");
    fireEvent.changeText(screen.getByPlaceholderText("Confirme sua senha"), "novasenha");
    fireEvent.changeText(screen.getByPlaceholderText("Data de Nascimento"), "01/01/2000");
    fireEvent.changeText(screen.getByPlaceholderText("Descrição"), "Nova descrição");

    fireEvent.press(screen.getByText("Salvar"));

    const mockResponse = {
      status: 200,
      message: "Perfil atualizado com sucesso",
      data: mockUser,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as Response);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/${mockUser.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          nome: "Novo Nome",
          foto: null,
          data_nascimento: "2000-01-01T12:00:00.000Z",
          descricao: "Nova descrição",
          senha: "novasenha",
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer undefined`,
        },
      });
      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Sucesso!",
        text2: "Perfil atualizado com sucesso.",
      });
    });
  });

  it("exibe mensagens de erro de validação", () => {
    render(<EditarPerfil />);

    fireEvent.changeText(screen.getByPlaceholderText("Nome completo"), "a");
    fireEvent.changeText(screen.getByPlaceholderText("Senha"), "123");
    fireEvent.changeText(screen.getByPlaceholderText("Confirme sua senha"), "1234");

    fireEvent.press(screen.getByText("Salvar"));

    expect(screen.getByText("O nome completo deve ter pelo menos 5 caractéres.")).toBeTruthy();
    expect(screen.getByText("Senha deve ter no mínimo 6 caracteres!")).toBeTruthy();
    expect(screen.getByText("As senhas precisam ser iguais!")).toBeTruthy();
  });

  it("apaga a conta com sucesso", async () => {
    usersCollection.query.mockReturnValue({ fetch: jest.fn().mockResolvedValue([{ destroyPermanently: jest.fn() }]) });

    render(<EditarPerfil />);

    fireEvent.press(screen.getByText("Apagar Conta"));
    fireEvent.press(screen.getByText("Apagar"));

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("usuario");
      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Sucesso!",
        text2: "Conta apagada com sucesso.",
      });
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });

  it("cancelar a operação de apagar conta", async () => {
    usersCollection.query.mockReturnValue({ fetch: jest.fn().mockResolvedValue([{ destroyPermanently: jest.fn() }]) });

    render(<EditarPerfil />);

    fireEvent.press(screen.getByText("Apagar Conta"));
    fireEvent.press(screen.getByText("Cancelar"));

    expect(screen.queryByText("Tem certeza que deseja apagar sua conta?")).toBeFalsy();
  });
});
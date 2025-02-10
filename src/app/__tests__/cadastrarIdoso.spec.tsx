import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import CadastrarIdoso from "../private/pages/cadastrarIdoso";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import database from "../db";
import NetInfo from "@react-native-community/netinfo";
import api from "../services/api"; // Mock da API

jest.mock('../db', () => ({
  get: jest.fn().mockReturnValue({
    query: jest.fn(),
  }),
}));

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
    replace: jest.fn(),
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

jest.mock("react-native/Libraries/Components/ToastAndroid/ToastAndroid", () => ({
  show: jest.fn(),
}));

jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(),
}));

jest.mock("../services/api", () => ({
  post: jest.fn(),
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

  it("Salva online quando há conexão", async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValueOnce({ isConnected: true });
    (api.post as jest.Mock).mockResolvedValueOnce({ status: 201 });

    const { getByText, getByPlaceholderText } = render(<CadastrarIdoso />);

    fireEvent.changeText(getByPlaceholderText("Nome"), "Nome Completo");
    fireEvent.changeText(getByPlaceholderText("Data de Nascimento"), "01/01/1960");
    fireEvent.changeText(getByPlaceholderText("Telefone Responsável"), "(11)12345-6789");

    fireEvent.press(getByText("Cadastrar"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/idosos", expect.any(Object));
    });
  });

  it("Salva localmente quando não há conexão", async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValueOnce({ isConnected: false });
    const saveLocalMock = jest.spyOn(database, "get").mockReturnValue({ create: jest.fn() });

    const { getByText, getByPlaceholderText } = render(<CadastrarIdoso />);

    fireEvent.changeText(getByPlaceholderText("Nome"), "Nome Completo");
    fireEvent.changeText(getByPlaceholderText("Data de Nascimento"), "01/01/1960");
    fireEvent.changeText(getByPlaceholderText("Telefone Responsável"), "(11)12345-6789");

    fireEvent.press(getByText("Cadastrar"));

    await waitFor(() => {
      expect(saveLocalMock).toHaveBeenCalled();
    });
  });

  it("Sincroniza dados locais quando a conexão é restaurada", async () => {
    (NetInfo.fetch as jest.Mock).mockResolvedValueOnce({ isConnected: true });
    const localData = [{ id: 1, nome: "Nome Offline" }];
    const getLocalDataMock = jest.spyOn(database, "get").mockReturnValue({ query: jest.fn().mockReturnValue(localData) });

    const { getByText } = render(<CadastrarIdoso />);
    fireEvent.press(getByText("Sincronizar"));

    await waitFor(() => {
      expect(getLocalDataMock).toHaveBeenCalled();
      expect(api.post).toHaveBeenCalledWith("/idosos", expect.any(Object));
    });
  });
});

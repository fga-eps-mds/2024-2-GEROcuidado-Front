import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react-native";
import CriarMetrica from "../private/pages/cadastrarMetrica";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postMetrica } from "../services/metrica.service";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("../services/metrica.service", () => ({
  postMetrica: jest.fn(),
}));

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("criarMetrica Component", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza corretamente e interage com as métricas", async () => {
    jest
      .spyOn(require("@react-native-async-storage/async-storage"), "getItem")
      .mockResolvedValueOnce("mockedToken");

    jest
      .spyOn(require("@react-native-async-storage/async-storage"), "getItem")
      .mockResolvedValueOnce(JSON.stringify({ id: 1, nome: "Usuário Mock" }));

    jest
      .spyOn(require("@react-native-async-storage/async-storage"), "getItem")
      .mockResolvedValueOnce(
        JSON.stringify({ id: 2, nome: "Idoso Mock", foto: null }),
      );

    const { getByText } = render(<CriarMetrica />);
    expect(getByText("Selecione a métrica a ser cadastrada")).toBeTruthy();
  });

  it("mostrar mensagem quando uma métrica é registrada com sucesso", async () => {
    const router = require("expo-router").useRouter();

    AsyncStorage.getItem
      .mockResolvedValueOnce("mockedToken")
      .mockResolvedValueOnce(JSON.stringify({ id: 1, nome: "Usuário Mock" }))
      .mockResolvedValueOnce(JSON.stringify({ id: 2, nome: "Idoso Mock", foto: null }));

    postMetrica.mockResolvedValue({
      message: "Métrica cadastrada com sucesso!",
    });

    const toastShow = jest.spyOn(Toast, "show").mockImplementation(() => {});

    render(<CriarMetrica />);

    await waitFor(() => {
      expect(screen.getByText("Frequência Cardíaca")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Frequência Cardíaca"));

    await waitFor(() => {
      expect(toastShow).toHaveBeenCalledWith({
        type: "success",
        text1: "Sucesso!",
        text2: "Métrica cadastrada com sucesso!",
      });
    });
  });

});

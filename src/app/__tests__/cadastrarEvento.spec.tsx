import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import CadastrarEvento from "../private/pages/cadastrarEvento";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ECategoriaRotina } from "../interfaces/rotina.interface";
import * as Notifications from "expo-notifications";
import database from "../db";
import { Collection } from "@nozbe/watermelondb";
import Evento from "../model/Evento";
import { validateFields } from "../shared/helpers/useNotification";
import CustomButton from "../components/CustomButton";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import Toast from "react-native-toast-message";

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
  scheduleNotificationAsync: jest.fn(),
}));

jest.mock("../db");
jest.mock("../shared/helpers/useNotification", () => ({
  validateFields: jest.fn(),
  handleNotificacao: jest.fn(),
}));

describe("CadastrarEvento", () => {
  const mockIdoso = {
    id: "1",
  };

  const mockToken = "mockToken";

  const eventoCollection = {
    create: jest.fn(),
  } as unknown as Collection<Evento>;


  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock)
    .mockResolvedValueOnce(JSON.stringify(mockIdoso))
    .mockResolvedValueOnce(mockToken);
    (database.get as jest.Mock).mockReturnValue(eventoCollection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o componente corretamente", async () => {
    render(<CadastrarEvento />);

    expect(screen.getByPlaceholderText("Adicionar título")).toBeTruthy();
    expect(screen.getByPlaceholderText("Data do evento")).toBeTruthy();
    expect(screen.getByPlaceholderText("Horário de início")).toBeTruthy();
    expect(screen.getByPlaceholderText("Descrição")).toBeTruthy();
    expect(screen.getByTestId("categoria")).toBeTruthy();
  });

  it("preenche os campos do formulário", () => {
    render(<CadastrarEvento />);

    fireEvent.changeText(screen.getByPlaceholderText("Adicionar título"), "Título do evento");
    fireEvent.changeText(screen.getByPlaceholderText("Data do evento"), "17/02/2025");
    fireEvent.changeText(screen.getByPlaceholderText("Horário de início"), "10:00");
    fireEvent.press(screen.getByText("Categoria"));
    fireEvent.press(screen.getByText(ECategoriaRotina.GERAL));
    fireEvent.changeText(screen.getByPlaceholderText("Descrição"), "Descrição do evento");

    expect(screen.getByPlaceholderText("Adicionar título").props.value).toBe("Título do evento");
    expect(screen.getByPlaceholderText("Data do evento").props.value).toBe("17/02/2025");
    expect(screen.getByPlaceholderText("Horário de início").props.value).toBe("10:00");
    expect(screen.getByTestId("geral-icon").props.children).toBeTruthy();
    expect(screen.getByPlaceholderText("Descrição").props.value).toBe("Descrição do evento");
  });

  /*it("salva o evento com sucesso", async () => {
    render(<CadastrarEvento />);

    fireEvent.changeText(screen.getByPlaceholderText("Adicionar título"), "Título do evento");
    fireEvent.changeText(screen.getByPlaceholderText("Data do evento"), "17/02/2025");
    fireEvent.changeText(screen.getByPlaceholderText("Horário de início"), "10:00");
    fireEvent.press(screen.getByText("Categoria"));
    fireEvent.press(screen.getByText(ECategoriaRotina.GERAL));
    fireEvent.changeText(screen.getByPlaceholderText("Descrição"), "Descrição do evento");

    AsyncStorage.getItem
    .mockResolvedValueOnce("mockedToken")
    .mockResolvedValueOnce(JSON.stringify({ id: 1, nome: "Usuário Mock" }))
    .mockResolvedValueOnce(JSON.stringify({ id: 2, nome: "Idoso Mock", foto: null }));
    
    fireEvent.press(screen.getByText("Salvar"));

    await waitFor(() => {
      
      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Sucesso!",
        text2: "Evento criado",
      });
    });
  });*/

  it("exibe mensagens de erro de validação", () => {
    (validateFields as jest.Mock).mockReturnValue({
      titulo: "",
      data: "Campo obrigatório",
      hora: "Campo obrigatório",
      categoria: "Campo obrigatório",
      descricao: "Campo obrigatório",
    });

    render(<CadastrarEvento />);

    fireEvent.press(screen.getByText("Salvar"));

    expect(screen.getByTestId("Erro-categoria")).toBeTruthy();
    expect(screen.getByTestId("Erro-data")).toBeTruthy();
    expect(screen.getByTestId("Erro-hora")).toBeTruthy();
    expect(screen.getByTestId("Erro-titulo")).toBeTruthy();
    expect(screen.getByTestId("Erro-descricao")).toBeTruthy();
  });
});
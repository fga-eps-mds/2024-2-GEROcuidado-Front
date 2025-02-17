import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import CriarDenuncia from "../private/pages/criarDenuncia";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updatePublicacao } from "../services/forum.service";
import { router } from "expo-router";
import { Alert } from "react-native";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    push: jest.fn(),
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

jest.mock("../services/forum.service");

describe("CriarDenuncia", () => {
  const mockPublicacao = {
    id: 1,
    titulo: "Título da Publicação",
    descricao: "Descrição da publicação.",
    dataHora: new Date(),
    categoria: "Categoria",
    idUsuario: 1,
    idUsuarioReporte:[],
    usuario: {
      id: 1,
      nome: "Nome do Usuário",
      foto: "https://example.com/foto.jpg",
    },
  };

  const mockUsuario = {
    id: 2,
    admin: false,
  };

  beforeEach(() => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
    ...mockPublicacao,
    ...mockPublicacao.usuario,
      id: mockPublicacao.id,
      foto: mockPublicacao.usuario.foto,
      nome: mockPublicacao.usuario.nome,
      idUsuarioReporte: "",
    });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUsuario));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o componente corretamente", () => {
    render(<CriarDenuncia />);

    expect(screen.getByText("Denunciar Publicação")).toBeTruthy();
    expect(screen.getByText("Título da Publicação")).toBeTruthy();
    expect(screen.getByText("Descrição da publicação.")).toBeTruthy();
  });

  it("seleciona um motivo de denúncia", () => {
    render(<CriarDenuncia />);

    fireEvent.press(screen.getByText("Selecione o motivo da denúncia"));
    fireEvent.press(screen.getByText("Conteúdo impróprio"));

    expect(screen.getByText("Conteúdo impróprio").props.children).toBeTruthy();
  });

  it("preenche a descrição da denúncia", () => {
    render(<CriarDenuncia />);

    fireEvent.changeText(screen.getByPlaceholderText("Descreva o motivo da denúncia!"), "Descrição da denúncia");

    expect(screen.getByPlaceholderText("Descreva o motivo da denúncia!")).toBeTruthy();
  });

  /*it("reporta a publicação com sucesso", async () => {
    (updatePublicacao as jest.Mock).mockResolvedValue({
      status: 200,
      message: "Publicação atualizada com sucesso",
      data: {...mockPublicacao, idUsuarioReporte: [mockUsuario.id] },
    });

    render(<CriarDenuncia />);

    fireEvent.press(screen.getByText("Selecione o motivo da denúncia"));
    fireEvent.press(screen.getByText("Conteúdo impróprio"));
    fireEvent.changeText(screen.getByPlaceholderText("Descreva o motivo da denúncia!"), "Descrição da denúncia");
    fireEvent.press(screen.getByTestId("report-publicacao"));

    await waitFor(() => {
      expect(updatePublicacao).toHaveBeenCalledWith(mockPublicacao.id, { idUsuarioReporte: [mockUsuario.id] }, expect.any(String));
      expect(router.push).toHaveBeenCalledWith({ pathname: "/private/tabs/forum" });
    });
  });

  it("exibe alerta se não selecionar um motivo", () => {
    const alertMock = jest.spyOn(Alert, "alert").mockImplementation();

    render(<CriarDenuncia />);

    fireEvent.changeText(screen.getByPlaceholderText("Descreva o motivo da denúncia!"), "Descrição da denúncia");
    fireEvent.press(screen.getByText("Reportar Publicação"));

    expect(alertMock).toHaveBeenCalledWith("Selecione um motivo para a denúncia");
  });*/

  it("exibe alerta se não preencher a descrição", () => {
    const alertMock = jest.spyOn(Alert, "alert").mockImplementation();

    render(<CriarDenuncia />);

    fireEvent.press(screen.getByText("Selecione o motivo da denúncia"));
    fireEvent.press(screen.getByText("Conteúdo impróprio"));
    fireEvent.press(screen.getByText("Reportar Publicação"));

    expect(alertMock).toHaveBeenCalledWith("Erro ao reportar publicação");
  });
});
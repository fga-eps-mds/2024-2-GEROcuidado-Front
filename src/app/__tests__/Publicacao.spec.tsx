import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import Publicacao from "../components/Publicacao";
import { router } from "expo-router"; 

// Mock do router.push
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

const mockItem = {
  id: 1,
  titulo: "Título da publicação",
  categoria: "Categoria da publicação",
  descricao: "Descrição da publicação",
  dataHora: "2023-11-04T12:00:00Z",
  idUsuarioReporte: [],
  usuario: {
    id: 1,
    nome: "Nome do Usuário",
    foto: "data:image/png;base64,base64-encoded-image-data",
  },
};

const mockItemComFoto = {
  id: 1,
  titulo: "Título da publicação",
  categoria: "Categoria da publicação",
  descricao: "Descrição da publicação",
  dataHora: "2023-11-04T12:00:00Z",
  idUsuarioReporte: [],
  usuario: {
    id: 1,
    nome: "Nome do Usuário",
    foto: "data:image/png;base64,base64-encoded-image-data",
  },
};

const mockItemSemFoto = {
  id: 1,
  titulo: "Título da publicação",
  categoria: "Categoria da publicação",
  descricao: "Descrição da publicação",
  dataHora: "2023-11-04T12:00:00Z",
  idUsuarioReporte: [],
  usuario: {
    id: 1,
    nome: "Nome do Usuário",
    foto: null,  // Sem foto
  },
};

const hasFoto = (foto: string | null | undefined) => {
  if (!foto) return false;

  const raw = foto.split("data:image/png;base64,")[1];
  return raw.length > 0;
};

describe("Publicacao", () => {
  
  it("deve formatar o nome corretamente com crop ativado", () => {
    render(<Publicacao item={mockItem} crop={true} />);

    // Verifique se o nome foi cortado corretamente
    const usernameElement = screen.getByText("Nome do Usuário");
    expect(usernameElement).toBeTruthy();
  });

  it("deve chamar o router.push com os parâmetros corretos ao clicar na publicação", () => {
    render(<Publicacao item={mockItem} crop={true} />);

    // Simula o clique na publicação
    fireEvent.press(screen.getByText("Título da publicação"));

    // Verifique se o router.push foi chamado com os parâmetros esperados
    const expectedParams = { ...mockItem, ...mockItem.usuario, id: mockItem.id };
    expect(router.push).toHaveBeenCalledWith({
      pathname: "/private/pages/visualizarPublicacao",
      params: expectedParams,
    });
  });
});

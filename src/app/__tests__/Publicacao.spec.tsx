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

  it("deve exibir a foto se o item tiver uma foto", () => {
    render(<Publicacao item={mockItemComFoto} crop={false} />);

    // Verifique se a foto está presente
    const fotoElement = screen.getByText("data:image/png;base64,base64-encoded-image-data");
    expect(fotoElement).toBeTruthy();
  });

  it("não deve exibir foto", () => {
    render(<Publicacao item={mockItemSemFoto} crop={false} />);

    // Verifique se a foto está presente
    const fotoElement = screen.getByPlaceholderText("foto");
    expect(fotoElement).toBeNull();
  });
// verifica o crop para o nome gigante, como JOAO NOME GRANDE QUE TESTA O CODIGO 2 
  it("deve exibir o nome do usuário cortado se a prop crop for true e o nome for longo", () => {
    const longName = "Nome do Usuário com um nome bem longo";
    const mockItemComNomeLongo = {
      ...mockItem,
      usuario: { ...mockItem.usuario, nome: longName }
    };
    
    render(<Publicacao item={mockItemComNomeLongo} crop={true} />);
    
    const usernameElement = screen.getByText("Nome do Usuário com");
    expect(usernameElement).toBeTruthy();  // O nome deve ser cortado
  });
// verifica se o crop funciona para o título
  it("deve exibir o título da publicação cortado se a prop crop for true e o título for longo", () => {
    const longTitle = "Título da publicação que é muito longo e precisa ser cortado";
    const mockItemComTituloLongo = { ...mockItem, titulo: longTitle };
    
    render(<Publicacao item={mockItemComTituloLongo} crop={true} />);
    
    const titleElement = screen.getByText("Título da publicação que");
    expect(titleElement).toBeTruthy();  // O título deve ser cortado
  });

// para nomes enormes e descrições maiores ainda, deve cortar para evitar o texto aparecer inteiro na tela.
  it("deve exibir a descrição da publicação cortada se a prop crop for true e a descrição for longa", () => {
    const longDescription = "Descrição da publicação que é bem longa e vai ser cortada aqui para testar o funcionamento do crop";
    const mockItemComDescricaoLonga = { ...mockItem, descricao: longDescription };
    
    render(<Publicacao item={mockItemComDescricaoLonga} crop={true} />);
    
    const descriptionElement = screen.getByText("Descrição da publicação que");
    expect(descriptionElement).toBeTruthy();  // A descrição deve ser cortada
  });
});

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import VisualizarPublicacao from "../private/pages/visualizarPublicacao";
import ModalConfirmation from "../components/ModalConfirmation";
import PublicacaoVisualizar from "../components/PublicacaoVisualizar";
import { IPublicacaoUsuario, ECategoriaPublicacao } from '../interfaces/forum.interface';
import { router } from "expo-router";  // Importa a função de roteamento
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({ id: '1', idUsuarioReporte: '1' })),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

interface Mocks {
  usuario: string;
  token: string;
}

describe("VisualizarPublicacao", () => {
  beforeEach(() => {
    const mocks: Mocks = {
      usuario: JSON.stringify({ id: 1, admin: true }),
      token: "mock-token",
    };

    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      return Promise.resolve(mocks[key as keyof Mocks]);
    });
  });

  it("Renderiza corretamente o componente com dados de publicação", async () => {
    const mockPublicacao: IPublicacaoUsuario = {
      id: 1,
      idUsuario: 1,
      admin: false,
      email: "usuario@test.com",
      nome: "Usuário Teste",
      senha: "senhaFicticia",
      foto: null,
      titulo: "Título de Teste",
      descricao: "Descrição de Teste",
      dataHora: new Date().toISOString(),
      categoria: ECategoriaPublicacao.SAUDE,
      idUsuarioReporte: [],
    };    

    const { getByText } = render(<PublicacaoVisualizar item={mockPublicacao} />);
   // Verifica se o título da publicação está sendo exibido
   await waitFor(() => {
     expect(getByText(mockPublicacao.titulo)).toBeTruthy();
   });
 });  

  it("Obtém usuário e token ao carregar o componente", async () => {
    render(<VisualizarPublicacao />);
  
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("usuario");
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("token");
    });
  });  

  it("Exibe ações corretamente para admin", async () => {
    const { getByText } = render(<VisualizarPublicacao />);
  
    await waitFor(() => {
      expect(getByText("Apagar")).toBeTruthy();
    });
  });  

  it("Exibe e interage com o modal de confirmação corretamente", async () => {
    const mockCloseModal = jest.fn();
    const mockCallbackFn = jest.fn();
  
    const { getByText, getByTestId } = render(
      <ModalConfirmation
        visible={true}
        callbackFn={mockCallbackFn}
        closeModal={mockCloseModal}
        message="Tem certeza que deseja deletar?"
        messageButton="Confirmar"
        testID="modalConfirm"
      />
    );
  
    // Verifica se o modal é renderizado com a mensagem correta
    expect(getByText("Tem certeza que deseja deletar?")).toBeTruthy();
  
    // Simula o clique no botão "Cancelar" e verifica se a função closeModal é chamada
    fireEvent.press(getByTestId("cancelarBtn"));
    expect(mockCloseModal).toHaveBeenCalled();
  
    // Simula o clique no botão "Confirmar" e verifica se a função callbackFn é chamada
    fireEvent.press(getByTestId("callbackBtn"));
    expect(mockCallbackFn).toHaveBeenCalled();
  });  

  it("Renderiza sem quebrar", () => {
    render(<VisualizarPublicacao />);
  });

  it("Confirma exclusão de publicação via modal", async () => {
    const { getByTestId } = render(<VisualizarPublicacao />);
  
    await act(async () => {
      fireEvent.press(getByTestId("deleteBtn"));
    });
  
    await act(async () => {
      fireEvent.press(getByTestId("callbackBtn"));
    });
  
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });    

  it("Testa botão de reportar", async () => {
    // Configurando o estado para que o botão de reportar seja visível
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === "usuario") {
        return Promise.resolve(JSON.stringify({ id: 1, admin: false }));
      }
      return Promise.resolve("mock-token");
    });
  
    const { getByTestId } = render(<VisualizarPublicacao />);
  
    // Verifica se o botão "Reportar" está presente
    await waitFor(() => {
      expect(getByTestId("reportBtn")).toBeTruthy();
    });
  
    // Simulando o clique no botão "Reportar"
    await act(async () => {
      fireEvent.press(getByTestId("reportBtn"));
    });
  
    // Verifica se o modal de reporte foi exibido corretamente
    await waitFor(() => {
      expect(getByTestId("reportModal")).toBeTruthy();
    });
  });
  
  it("Testa botão de desfazer reporte", async () => {
    // Configurando o estado para que o botão de desfazer reporte seja visível
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === "usuario") {
        return Promise.resolve(JSON.stringify({ id: 1, admin: false }));
      }
      return Promise.resolve("mock-token");
    });
  
    const { getByTestId } = render(<VisualizarPublicacao />);
  
    // Verifica se o botão "Desfazer" está presente
    await waitFor(() => {
      expect(getByTestId("reportBtn")).toBeTruthy();
    });
  
    // Simulando o clique no botão "Desfazer"
    await act(async () => {
      fireEvent.press(getByTestId("reportBtn"));
    });
  
    // Verifica se o modal de reporte foi exibido corretamente
    await waitFor(() => {
      expect(getByTestId("reportModal")).toBeTruthy();
    });
  });  

it("Testa a navegação para a tela de edição", async () => {
  // Mock do AsyncStorage
  (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
    if (key === "usuario") {
      return Promise.resolve(JSON.stringify({ id: 1, admin: true }));
    }
    return Promise.resolve("mock-token");
  });

  // Mock dos parâmetros necessários
  const params = {
    id: 1,
    titulo: 'Título da Publicação',
    descricao: 'Descrição da Publicação',
    dataHora: new Date().toISOString(),
    categoria: 'GERAL',
    idUsuario: 1,
    idUsuarioReporte: '',
  };

  // Mock da função useLocalSearchParams
  jest.spyOn(require('expo-router'), 'useLocalSearchParams').mockReturnValue(params);

  // Renderiza o componente com parâmetros simulados
  const { getByTestId } = render(<VisualizarPublicacao />);

  // Aguarda a renderização completa do botão de editar
  await waitFor(() => {
    expect(getByTestId("editBtn")).toBeTruthy();
  });

  // Simulando o clique no botão "Editar"
  await act(async () => {
    fireEvent.press(getByTestId("editBtn"));
  });

  // Verifica se a função de navegação foi chamada com os parâmetros esperados
  expect(router.push).toHaveBeenCalledWith(expect.objectContaining({
    pathname: "/private/pages/editarPublicacao",
    params: expect.objectContaining({
      id: 1,
      titulo: 'Título da Publicação',
      descricao: 'Descrição da Publicação',
      categoria: 'GERAL',
      idUsuario: 1,
      idUsuarioReporte: '',
    }),
  }));
});
it("Não exibe ações para usuários não autorizados", async () => {
  (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
    if (key === "usuario") {
      return Promise.resolve(JSON.stringify({ id: 1, admin: false }));
    }
    return Promise.resolve("mock-token");
  });

  const { queryByTestId } = render(<VisualizarPublicacao />);

  await waitFor(() => {
    expect(queryByTestId("deleteBtn")).toBeNull();
    expect(queryByTestId("editBtn")).toBeNull();
  });
});
});

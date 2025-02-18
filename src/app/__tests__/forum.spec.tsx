import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Forum from "../private/tabs/forum";
import { getAllPublicacao } from "../services/forum.service";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useNavigation } from '@react-navigation/native';
import { ECategoriaPesquisa } from "../interfaces/forum.interface";

// Mockando as funções de serviço e navegação
jest.mock("../services/forum.service");
jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

// Mock da função de navegação
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock para a função que busca publicações
jest.mock("../services/forum.service", () => ({
  getAllPublicacao: jest.fn(() => Promise.resolve(mockPublicacoes)),
}));

const mockPublicacoes = [
  { id: 1, titulo: "Publicação 1", descricao: "Descrição 1", categoria: "Saúde" },
  { id: 2, titulo: "Publicação 2", descricao: "Descrição 2", categoria: "Geral" },
];

describe("Forum", () => {

  beforeEach(() => {
    (getAllPublicacao as jest.Mock).mockResolvedValue({
      data: mockPublicacoes,
    });
  });

  it("renderiza corretamente", async () => {
    await waitFor(() => render(<Forum />));
  });

  it("exibe mensagem de erro quando falha ao carregar publicações", async () => {
    (getAllPublicacao as jest.Mock).mockRejectedValueOnce({
      message: "Erro ao carregar publicações",
    });

    const { getByText } = render(<Forum />);

    await waitFor(() => expect(Toast.show).toHaveBeenCalledWith({
      type: "error",
      text1: "Erro!",
      text2: "Erro ao carregar publicações",
    }));
  });

  it("deve realizar pesquisa com debounce", async () => {
    const { getByPlaceholderText } = render(<Forum />);
  
    // Alterar para o placeholder correto
    const searchInput = getByPlaceholderText("Pesquise uma publicação");
  
    fireEvent.changeText(searchInput, "");
  
    // Aguarda o debounce
    await waitFor(() => {
      expect(getAllPublicacao).toHaveBeenCalledWith(
        0,
        { titulo: "", isReported: false },
        expect.any(Object)
      );
    });
  });

  describe("Forum - Carregar Mais", () => {
    it("desativa o botão 'Carregar Mais' quando não há novas publicações", async () => {
      // Simulando a resposta com uma lista vazia de publicações
      (getAllPublicacao as jest.Mock).mockResolvedValueOnce({
        data: [],
      });
  
      const { queryByTestId } = render(<Forum />);
      
      // Verifica se setShowCarregarMais(false) foi chamado (ou seja, o botão foi removido)
      await waitFor(() => {
        const botaoCarregarMais = queryByTestId("botaoCarregarMais");
        expect(botaoCarregarMais).toBeNull(); // Verifica que o botão "Carregar Mais" foi removido
      });
    });
  });

  describe("Forum - Seleção de categoria", () => {
    it("atualiza a categoria ao selecionar um item", async () => {
      const { getByText, getByPlaceholderText } = render(<Forum />);
  
      // Supondo que o dropdown tenha um placeholder "Todas"
      const dropdown = getByText("Todas");
  
      // Simula a abertura do dropdown
      fireEvent.press(dropdown);
  
      // Verifica se o dropdown foi aberto e se a opção "Saúde" está visível
      await waitFor(() => {
        const dropdownOption = getByText(ECategoriaPesquisa.SAUDE);
        expect(dropdownOption).toBeTruthy();
        
        // Simula a seleção da categoria "Saúde"
        fireEvent.press(dropdownOption);
      });
  
      // Verifica se a função setCategoria foi chamada corretamente
      await waitFor(() => {
        expect(getAllPublicacao).toHaveBeenCalledWith(
          expect.any(Number),
          { titulo: expect.any(String), isReported: expect.any(Boolean), categoria: ECategoriaPesquisa.SAUDE },
          expect.any(Object)
        );
      });
    });
  });

  describe('Forum Page - Error Handling', () => {
    it('deve exibir uma mensagem de erro quando a requisição falha', async () => {
      const mockError = { message: 'Erro de conexão!' };
  
      // Forçando o serviço a rejeitar com um erro
      (getAllPublicacao as jest.Mock).mockRejectedValueOnce(mockError);
  
      const { getByText } = render(<Forum />);
  
      // Espera o Toast ser chamado após o erro
      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledWith({
          type: 'error',
          text1: 'Erro!',
          text2: mockError.message,
        });
      });
    });
  });
});
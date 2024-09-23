import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CriaPublicacao from '../private/pages/criaPublicacao'; // Corrija o caminho conforme necessário
import Toast from 'react-native-toast-message';

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest
    .fn()
    .mockResolvedValueOnce(JSON.stringify({ id: 1 }))
    .mockResolvedValueOnce('token123')
    .mockResolvedValue(JSON.stringify({ id: 1 })), // Mock para chamadas subsequentes
}));

describe('CriaPublicacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir erros de validação quando Título estiver vazio', async () => {
    const { getByText, getByPlaceholderText } = render(<CriaPublicacao />);

    // Simular clique no botão Publicar sem preencher campos
    fireEvent.changeText(getByPlaceholderText('Título'), '');
    fireEvent.changeText(getByPlaceholderText('Descrição'), 'Teste');
    
    // Simular a seleção da categoria usando o texto do placeholder
    fireEvent.press(getByText('Categoria')); // Abre a lista de categorias
    fireEvent.press(getByText('Geral'));     // Seleciona "Geral"

    fireEvent.press(getByText('Publicar'));

    await waitFor(() => {
      expect(getByText('Campo obrigatório!')).toBeTruthy(); // Verifica erro no campo Título
    });
  });

  it('deve exibir erros de validação quando Descrição estiver vazio', async () => {
    const { getByText, getByPlaceholderText } = render(<CriaPublicacao />);

    // Simular clique no botão Publicar sem preencher campos
    fireEvent.changeText(getByPlaceholderText('Título'), 'Teste');
    fireEvent.changeText(getByPlaceholderText('Descrição'), '');
    
    // Simular a seleção da categoria usando o texto do placeholder
    fireEvent.press(getByText('Categoria'));
    fireEvent.press(getByText('Geral'));

    fireEvent.press(getByText('Publicar'));

    await waitFor(() => {
      expect(getByText('Campo Obrigatório!')).toBeTruthy(); // Verifica erro no campo Descrição
    });
  });

  it('não deve exibir erros de validação quando Título, Descrição e Categoria estão preenchidos', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<CriaPublicacao />);

    // Preencher campos corretamente
    fireEvent.changeText(getByPlaceholderText('Título'), 'Título de teste');
    fireEvent.changeText(getByPlaceholderText('Descrição'), 'Descrição de teste');
    
    // Simular a seleção da categoria usando o texto do placeholder
    fireEvent.press(getByText('Categoria'));
    fireEvent.press(getByText('Geral'));

    fireEvent.press(getByText('Publicar'));

    await waitFor(() => {
      // Verificar que os erros de validação não estão mais presentes
      expect(queryByText('Campo obrigatório!')).toBeNull();
    });
  });

  it('deve exibir mensagem de erro para publicação', async () => {
    const { getByText, getByPlaceholderText } = render(<CriaPublicacao />);

    // Preencher campos corretamente
    fireEvent.changeText(getByPlaceholderText('Título'), 'Título de teste');
    fireEvent.changeText(getByPlaceholderText('Descrição'), 'Descrição de teste');
    
    // Simular a seleção da categoria usando o texto do placeholder
    fireEvent.press(getByText('Categoria'));
    fireEvent.press(getByText('Geral'));

    fireEvent.press(getByText('Publicar'));

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Erro!',
        text2: 'fetch failed',
      });
    });
  });
});

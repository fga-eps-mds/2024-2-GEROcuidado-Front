// EditarPublicacao.test.tsx

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import EditarPublicacao from "../private/pages/editarPublicacao";
import Toast from 'react-native-toast-message';

// Mock de useLocalSearchParams
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

// Mock de updatePublicacao
jest.mock('../services/forum.service', () => ({
  updatePublicacao: jest.fn(),
}));

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('mocked-token')),
}));

// Mock de Toast
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('EditarPublicacao', () => {
  const mockPublicacao = {
    id: '1',
    titulo: 'Test Title',
    descricao: 'Test Description',
    categoria: 'GERAL',
    // Adicione outros campos necessários aqui
  };

  beforeEach(() => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockPublicacao);
  });

  test('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<EditarPublicacao />);

    expect(getByPlaceholderText('Título')).toBeTruthy();
    expect(getByPlaceholderText('Descrição')).toBeTruthy();
    expect(getByText('Editar publicação')).toBeTruthy();
  });

//   test('shows error messages for empty fields', async () => {
//     const { getByText, getByPlaceholderText } = render(<EditarPublicacao />);
//
//     // Envolva a mudança de texto e clique no botão em um act(...)
//     await act(async () => {
//       fireEvent.changeText(getByPlaceholderText('Título'), '');
//       fireEvent.changeText(getByPlaceholderText('Descrição'), '');
//
//       // Simula o clique no botão de salvar
//       fireEvent.press(getByText('Salvar'));
//
//       // Espera até que os erros apareçam
//       await waitFor(() => {
//         expect(getByText('Campo obrigatório!')).toBeTruthy();
//         expect(getByText('Campo Obrigatório!')).toBeTruthy();
//       });
//     });
//   });

  test('calls save function and shows success toast', async () => {
    // Mock da função updatePublicacao
    const mockUpdatePublicacao = require('../services/forum.service').updatePublicacao;
    mockUpdatePublicacao.mockResolvedValue({ message: 'Publicação atualizada com sucesso!' });

    const { getByText, getByPlaceholderText } = render(<EditarPublicacao />);

    // Envolva a mudança de texto e clique no botão em um act(...)
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Título'), 'New Title');
      fireEvent.changeText(getByPlaceholderText('Descrição'), 'New Description');

      // Simula o clique no botão de salvar
      fireEvent.press(getByText('Salvar'));

      // Espera até que o Toast apareça
      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledWith({
          type: 'success',
          text1: 'Sucesso!',
          text2: 'Publicação atualizada com sucesso!',
        });
      });
    });
  });

});

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CadastrarRotina from '../private/pages/cadastrarRotina'; // Ajuste o caminho conforme necessário
import Toast from 'react-native-toast-message';

// Mock do Toast
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('CadastrarRotina Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  test('should show error if title is empty', async () => {
    const { getByPlaceholderText, getByText } = render(<CadastrarRotina />);

    const inputField = getByPlaceholderText('Adicionar título');
    const saveButton = getByText('Salvar');

    fireEvent.changeText(inputField, '');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText('Campo obrigatório!')).toBeTruthy();
    });
  });

  test('should render input field and save button', () => {
    const { getByPlaceholderText, getByText } = render(<CadastrarRotina />);

    expect(getByPlaceholderText('Adicionar título')).toBeTruthy();
    expect(getByText('Salvar')).toBeTruthy();
  });

  test('should hide error message when input is corrected', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<CadastrarRotina />);

    const inputField = getByPlaceholderText('Adicionar título');
    const saveButton = getByText('Salvar');

    fireEvent.changeText(inputField, '');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText('Campo obrigatório!')).toBeTruthy();
    });

    fireEvent.changeText(inputField, 'Título válido');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(queryByText('Campo obrigatório!')).toBeNull();
    });
  });
});

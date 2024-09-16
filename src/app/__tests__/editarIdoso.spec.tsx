import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditarIdoso from '../private/pages/editarIdoso';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '../db';
import Idoso from '../model/Idoso';
import Toast from 'react-native-toast-message';
import { Collection } from '@nozbe/watermelondb';

// Mock para AsyncStorage e outros módulos
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));
jest.mock('../db', () => ({
  get: jest.fn().mockImplementation((modelName: string) => {
    return {
      find: jest.fn().mockResolvedValue({
        update: jest.fn().mockResolvedValue(null), 
      }),
    };
  }),
}));

describe('EditarIdoso', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ id: 1 }) // Mock de retorno de AsyncStorage
    );
  });

  it('deve renderizar o componente corretamente', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <EditarIdoso />
    );

    await waitFor(() => {
      expect(getByPlaceholderText('Nome')).toBeTruthy();
      expect(getByPlaceholderText('Data de Nascimento')).toBeTruthy();
      expect(getByPlaceholderText('Telefone Responsável')).toBeTruthy();
      expect(getByPlaceholderText('Descrição')).toBeTruthy();
      expect(getByText('Salvar')).toBeTruthy();
      expect(getByText('Apagar Idoso')).toBeTruthy();
      expect(getByTestId('uploadImageButton')).toBeTruthy();
    });
  });

  it('deve exibir erro quando Nome estiver vazio', async () => {
    const { getByPlaceholderText, getByText } = render(
      <EditarIdoso />
    );

    fireEvent.changeText(getByPlaceholderText('Nome'), '');
    fireEvent.changeText(getByPlaceholderText('Data de Nascimento'), '15/10/1998');
    fireEvent.changeText(getByPlaceholderText('Telefone Responsável'), '99999999999');

    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(getByText('Campo obrigatório!')).toBeTruthy();
    });
  });

  it('deve exibir erro quando Telefone Responsável estiver vazio', async () => {
    const { getByPlaceholderText, getByText } = render(
      <EditarIdoso />
    );

    fireEvent.changeText(getByPlaceholderText('Nome'), 'Ugor B');
    fireEvent.changeText(getByPlaceholderText('Data de Nascimento'), '15/10/1998');
    fireEvent.changeText(getByPlaceholderText('Telefone Responsável'), '');

    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(getByText('Campo obrigatório!')).toBeTruthy();
    });
  });

  it('deve exibir erro quando Data de Nascimento estiver vazio', async () => {
    const { getByPlaceholderText, getByText } = render(
      <EditarIdoso />
    );

    fireEvent.changeText(getByPlaceholderText('Nome'), 'Ugor B');
    fireEvent.changeText(getByPlaceholderText('Data de Nascimento'), '');
    fireEvent.changeText(getByPlaceholderText('Telefone Responsável'), '99999999999');

    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(getByText('Campo obrigatório!')).toBeTruthy();
    });
  });

  it('deve exibir um modal de confirmação ao tentar apagar um idoso', async () => {
    const { getByText } = render(
      <EditarIdoso />
    );

    fireEvent.press(getByText('Apagar Idoso'));

    await waitFor(() => {
      expect(getByText('Apagar')).toBeTruthy();
      expect(getByText('Cancelar')).toBeTruthy();
    });
  });

  it('Mensagem de erro recebida ao editar Idoso:', async () => {
    const { getByPlaceholderText, getByText } = render(
      <EditarIdoso />
    );

    fireEvent.changeText(getByPlaceholderText('Nome'), 'Ugor B');
    fireEvent.changeText(getByPlaceholderText('Data de Nascimento'), '15/10/1998');
    fireEvent.changeText(getByPlaceholderText('Telefone Responsável'), '99999999999');
    fireEvent.changeText(getByPlaceholderText('Descrição'), 'Descrição Teste');

    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      const idosoCollection = database.get('idoso') as Collection<Idoso>;
      const findMock = idosoCollection.find as jest.Mock;
      const updateMock = findMock().update as jest.Mock;

      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Erro!',
        text2: '_db.default.write is not a function',
      });
    });

    // Verifica se a navegação ocorreu
  });

  it('Mensagem de erro ao apagar Idoso', async () => {
    // Mock para o registro de idoso
    const mockIdoso = {
      destroyPermanently: jest.fn().mockResolvedValue(null), // Mock para destroyPermanently
    } as unknown as Idoso;

    // Mock da coleção de idoso
    const mockIdosoCollection = {
      find: jest.fn().mockResolvedValue(mockIdoso), // Simular a busca do idoso
    } as unknown as Collection<Idoso>;

    (database.get as jest.Mock).mockReturnValue(mockIdosoCollection);

    const { getByText } = render(<EditarIdoso />);

    // Simular o clique no botão de apagar
    fireEvent.press(getByText('Apagar Idoso'));

    // Simular o clique no botão de confirmação de apagar
    fireEvent.press(getByText('Apagar')); // Certifique-se de que esse texto corresponde ao botão de confirmação de exclusão no seu componente

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Erro!',
        text2: '_db.default.write is not a function',
      });
    });
  });

});
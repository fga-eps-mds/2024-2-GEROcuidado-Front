import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../public/login'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { loginUser } from '../services/user.service';
import JWT from 'expo-jwt';

// Mock do Toast
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

// Mock do router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock da função loginUser
jest.mock('../services/user.service', () => ({
  loginUser: jest.fn(),
}));

// Mock do JWT
jest.mock('expo-jwt', () => ({
  decode: jest.fn(),
}));

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir mensagem de erro se o login falhar', async () => {
    const error = new Error('Erro de login');

    // Mock da função loginUser para lançar um erro
    (loginUser as jest.Mock).mockRejectedValue(error);
    (Toast.show as jest.Mock).mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = render(<Login />);

    // Preenche os campos e tenta enviar o formulário
    fireEvent.changeText(getByPlaceholderText('Email'), 'usuario@exemplo.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'senhaerrada');
    fireEvent.press(getByText('Entrar'));

    // Aguarda o erro ser exibido com um timeout de 5000ms
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Erro!',
        text2: 'Erro de login',
      });
    }, { timeout: 5000 });

    // Adicionalmente, você pode querer verificar se outras ações esperadas aconteceram
  });

  it('deve realizar login com sucesso', async () => {
    const token = 'mockToken';
    const userResponse = { data: token };
    const userInfo = { id: 1, email: 'u@gmail.com', senha: 'teste1' };

    // Mock dos retornos das funções
    (loginUser as jest.Mock).mockResolvedValue(userResponse);
    (JWT.decode as jest.Mock).mockReturnValue(userInfo);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (router.push as jest.Mock).mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'u@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'teste1');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({ email: 'u@gmail.com', senha: 'teste1' });
      expect(router.push).toHaveBeenCalledWith('/private/pages/listarIdosos');
    });
  });

  it('deve exibir mensagem de erro quando os campos estão vazios', async () => {
    const { getByText } = render(<Login />);
    fireEvent.press(getByText('Entrar'));
  
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo de email é obrigatório!',
      });
  
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo de senha é obrigatório!',
      });
    });
  });
});

import React from 'react';
import { render, fireEvent, waitFor} from '@testing-library/react-native';
import Login from '../public/login'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { loginUser, getUserById} from '../services/user.service';
import JWT from 'expo-jwt';
import database from "../db";
import { syncDatabaseWithServer } from '../services/watermelon.service';
import getUser  from '../public/login'; 
import * as authService from "../services/user.service";
import { text } from '@nozbe/watermelondb/decorators';
jest.mock("../services/user.service"); // Mocka o módulo inteiro

const mockUser = { id: 1, name: 'Usuário Teste' };

// Mock do database e da função de sincronização
jest.mock('../db', () => ({
  get: jest.fn(),
}));

jest.mock('../services/watermelon.service', () => ({
  syncDatabaseWithServer: jest.fn(),
}));

jest.mock('../services/user.service', () => ({
  getUserById: jest.fn().mockResolvedValue({ data: mockUser }),
  loginUser: jest.fn(),
}));

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

// Mock do JWT
jest.mock('expo-jwt', () => ({
  decode: jest.fn(),
}));

describe('Login', () => {
  const mockLoginResponse = {
    data: 'mockToken',
  };

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
  
  it('deve exibir mensagem de erro se o email estiver no formato inválido', async () => {
    const invalidEmail = 'usuario#email.com';
  
    const { getByPlaceholderText, getByText } = render(<Login />);
  
    fireEvent.changeText(getByPlaceholderText('Email'), invalidEmail);
    fireEvent.changeText(getByPlaceholderText('Senha'), 'teste123');
    fireEvent.press(getByText('Entrar'));
  
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Erro!',
        text2: 'O campo de email é obrigatório!',
      });
    });
  });  

  it('deve alternar a visibilidade da senha ao clicar no ícone de olho', () => {
    const { getByPlaceholderText, getByTestId } = render(<Login />);
  
    const senhaInput = getByPlaceholderText('Senha');
    const eyeIcon = getByTestId('escondeSenhaIcon');
  
    // Inicialmente, a senha deve estar escondida
    expect(senhaInput.props.secureTextEntry).toBe(true);
  
    // Clica no ícone para mostrar a senha
    fireEvent.press(eyeIcon);
    expect(senhaInput.props.secureTextEntry).toBe(false);
  
    // Clica novamente para esconder a senha
    fireEvent.press(eyeIcon);
    expect(senhaInput.props.secureTextEntry).toBe(true);
  });  

  it('deve tratar erro ao decodificar o token', async () => {
    const token = 'mockToken';
    const userResponse = { data: token };
    const userInfo = { id: 1, email: 'u@gmail.com', senha: 'teste1' };

    // Mock dos retornos das funções
    (loginUser as jest.Mock).mockResolvedValue(userResponse);
    (JWT.decode as jest.Mock).mockImplementation(() => {
      throw new Error('Erro ao decodificar o token');
    });
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (router.push as jest.Mock).mockImplementation(() => {});

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'u@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'teste1');
    fireEvent.press(getByText('Entrar'));

    // Aguarda que o loginUser seja chamado
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({ email: 'u@gmail.com', senha: 'teste1' });
    });

    // Verifica se console.error foi chamado com a mensagem esperada
    expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao decodificar o token:", expect.any(Error));

    // Limpa o spy
    consoleErrorSpy.mockRestore();
  });

  /*it('deve tratar erro ao processar o token', async () => {
    const mockToken = 'mockToken';
    
    // Simula o retorno do loginUser
    (loginUser as jest.Mock).mockResolvedValueOnce({ data: "token", status: 200 });

    
    // Simula o AsyncStorage.setItem para lançar um erro
    //jest.spyOn(authService, "loginUser").mockResolvedValueOnce({ data: "token", status: 200 });
    (authService.loginUser as jest.Mock).mockResolvedValueOnce({
        data: "fake-jwt-token", // O dado esperado
        message: null, // A mensagem
        status: 200, // Agora o status está disponível, porque foi adicionado na interface
    });

    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Erro ao salvar no AsyncStorage'));

    // Mock Toast to show error message
    (Toast.show as jest.Mock).mockImplementation(() => {});


    const { getByPlaceholderText, getByText } = render(<Login />);

    // Preenche os campos
    fireEvent.changeText(getByPlaceholderText('Email'), 'teste@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'teste1');

    // Clica no botão de login
    fireEvent.press(getByText('Entrar'));

    // Verifica se o Toast foi chamado com a mensagem de erro
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Erro!',
        text2: 'Erro ao salvar o token',
      });
    });
  });*/

  it('deve buscar o usuário no banco e salvar no AsyncStorage', async () => {
    const mockUser = { id: 1, name: 'Usuário Teste' };
    const mockId = 1;
    const mockToken = 'mockToken';

    // Mock do AsyncStorage
    jest.spyOn(AsyncStorage, 'setItem');

    // Simular a função getUserById
    (authService.getUserById as jest.Mock).mockResolvedValue({
        data: { id: 1, name: "Teste" }, // Dados fictícios do usuário
        message: "Usuário encontrado",
        status: 200,
      });

    // Renderizando o componente
    const { getByText, getByPlaceholderText } = render(<Login />);

    // Simular preenchimento do formulário
    fireEvent.changeText(getByPlaceholderText('Email'), 'teste@teste.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), '123456');

    // Simular o clique no botão de login
    fireEvent.press(getByText('Entrar')); // Mudei para 'Entrar'

    // Verificar se o AsyncStorage foi chamado com os valores corretos
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'token', // Altere para o token esperado
        'mockToken' // Altere para o valor esperado do token
      );
    });
  });
});
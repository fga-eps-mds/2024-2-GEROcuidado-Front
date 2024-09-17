import React from 'react';
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react-native';
import CadastrarRotina from '../private/pages/cadastrarRotina'; // Adjust path as needed
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mocking Toast and AsyncStorage
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)), // Return a resolved promise
  setItem: jest.fn(() => Promise.resolve()),     // Ensure setItem returns a Promise
}));

describe('CadastrarRotina Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clears mocks before each test
  });

  // Test for required title field
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

  it("Mostra erro quando o título é muito longo", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<CadastrarRotina />);

    const titulo = getByPlaceholderText("Adicionar título");
    const salvar = getByText("Salvar");

    act(() => {
      fireEvent.changeText(titulo, "A".repeat(101));
      fireEvent.press(salvar);
    });

    const erroTitulo = getByTestId("Erro-titulo");
    expect(erroTitulo.props.children.props.text).toBe("O título deve ter no máximo 100 caracteres.");
  });

  // Test that input field and button render correctly
  test('should render input fields and save button', () => {
    const { getByPlaceholderText, getByText } = render(<CadastrarRotina />);
    expect(getByPlaceholderText('Adicionar título')).toBeTruthy();
    expect(getByText('Salvar')).toBeTruthy();
  });

  // Test to check if error is removed when valid input is given
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

  // Test for wrong format "data" field validation
  it("Mostra erro para o formato de data incorreta", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<CadastrarRotina />);

    const data = getByPlaceholderText("Data da rotina");
    const salvar = getByText("Salvar");

    act(() => {
      fireEvent.changeText(data, "2010");
      fireEvent.press(salvar);
    });

    const erroData = getByTestId("Erro-data");
    expect(erroData.props.children.props.text).toBe("Data deve ser no formato dd/mm/yyyy!");
  });

  // Test for empty "data" field validation
  it('Mostra erro para campo de data vazio', async () => {
    render(<CadastrarRotina />);
  
    // Get the data input field and the save button
    const dataInput = screen.getByPlaceholderText('Data da rotina');
    const saveButton = screen.getByText('Salvar');
  
    // Trigger the change in data input and press the save button
    fireEvent.changeText(dataInput, ''); // Leave the field empty
    fireEvent.press(saveButton);
  
    // Wait for the error message to be displayed
    await waitFor(() => {
      // Find the error message element and check its content
      const erroData = screen.getByTestId('Erro-data');
      expect(erroData.props.children.props.text).toBe('Campo obrigatório');
    });
  });

  //Test for wrong time format
  it("Mostra erro para o formato de tempo incorreto", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<CadastrarRotina />);

    const hora = getByPlaceholderText("Horário de início");
    const salvar = getByText("Salvar");

    act(() => {
      fireEvent.changeText(hora, "125:00");
      fireEvent.press(salvar);
    });

    const erroHora = getByTestId("Erro-hora");
    expect(erroHora.props.children.props.text).toBe("Hora deve ser no formato hh:mm!");
  });

  //Test for empty time format
  it("Mostra erro para o formato de tempo vazio", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<CadastrarRotina />);

    const hora = getByPlaceholderText("Horário de início");
    const salvar = getByText("Salvar");

    act(() => {
      fireEvent.changeText(hora, '');
      fireEvent.press(salvar);
    });

    const erroHora = getByTestId("Erro-hora");
    expect(erroHora.props.children.props.text).toBe("Campo obrigatório");
  });

  //Test for long too description
  it("Mostra erro quando descrição é muito longa", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<CadastrarRotina />);

    const descricao = getByPlaceholderText("Descrição");
    const salvar = getByText("Salvar");

    act(() => {
      fireEvent.changeText(descricao, "A".repeat(301));
      fireEvent.press(salvar);
    });

    const erroDescricao = getByTestId("Erro-descricao");
    expect(erroDescricao.props.children.props.text).toBe("A descrição deve ter no máximo 300 caracteres.");
  });
});

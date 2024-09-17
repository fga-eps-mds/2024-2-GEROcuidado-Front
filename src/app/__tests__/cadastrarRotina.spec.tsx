import React from 'react';
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react-native';
import CadastrarRotina from '../private/pages/cadastrarRotina'; // Adjust path as needed
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';


jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

describe('CadastrarRotina Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it("should show error if title is too long", async () => {
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
  it("should show error if date has the wrong format", async () => {
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
  it('should show error if date is empty', async () => {
    render(<CadastrarRotina />);
  
    const dataInput = screen.getByPlaceholderText('Data da rotina');
    const saveButton = screen.getByText('Salvar');
  
    fireEvent.changeText(dataInput, '');
    fireEvent.press(saveButton);
  
    await waitFor(() => {
      const erroData = screen.getByTestId('Erro-data');
      expect(erroData.props.children.props.text).toBe('Campo obrigatório');
    });
  });

  // Test for wrong format "hora" field validation
  it("should show error if time has the wrong format", async () => {
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

  // Test for empty "hora" field validation
  it("should show error if time is empty", async () => {
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

  // Test for too long "descrição" field validation
  it("should show error if description is too long", async () => {
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

  // Test for empty "categoria" field validation
  it("should show error if a category is not selected", async () => {
    const { getByText, getByTestId } = render(<CadastrarRotina />);
  
    const salvar = getByText("Salvar");
  
    act(() => {
      fireEvent.press(salvar);
    });
  
    const erroCategoria = getByTestId("Erro-categoria");
    expect(erroCategoria.props.children.props.text).toBe("Campo obrigatório");
  });

});

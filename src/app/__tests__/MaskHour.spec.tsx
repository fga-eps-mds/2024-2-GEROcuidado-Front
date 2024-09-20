import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MaskInput from "../components/MaskHour"; // ajuste o caminho se necessário
import MaskHour from "../components/MaskHour";

// Mock da função inputMaskChange
const mockInputMaskChange = jest.fn();

describe("MaskInput", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa chamadas anteriores dos mocks antes de cada teste
  });

  test("aplica a máscara corretamente", () => {
    const { getByTestId } = render(
      <MaskInput inputMaskChange={mockInputMaskChange} testID="mask-input" />
    );

    const input = getByTestId("mask-input");

    // Simula a mudança do texto
    fireEvent.changeText(input, "1234");

    // Verifica se inputMaskChange foi chamado com o valor mascarado correto
    expect(mockInputMaskChange).toHaveBeenCalledWith("12:34");
  });

  test("não permite horas inválidas", () => {
    const { getByTestId } = render(
      <MaskInput inputMaskChange={mockInputMaskChange} testID="mask-input" />
    );

    const input = getByTestId("mask-input");

    // Simula a mudança do texto
    fireEvent.changeText(input, "9999");

    // Verifica se inputMaskChange foi chamado com uma string vazia
    expect(mockInputMaskChange).toHaveBeenCalledWith("");
  });

  test("verifica se o valor do input é atualizado corretamente", () => {
    const { getByTestId } = render(
      <MaskInput inputMaskChange={mockInputMaskChange} testID="mask-input" />
    );

    const input = getByTestId("mask-input");

    // Simula a mudança do texto
    fireEvent.changeText(input, "0959");

    // Verifica se inputMaskChange foi chamado com o valor mascarado correto
    expect(mockInputMaskChange).toHaveBeenCalledWith("09:59");
  });

  test("não permite que o segundo dígito seja maior que 9", () => {
    const { getByTestId } = render(
      <MaskInput inputMaskChange={mockInputMaskChange} testID="mask-input" />
    );

    const input = getByTestId("mask-input");

    // Simula a mudança do texto
    fireEvent.changeText(input, "2990");

    // Verifica se inputMaskChange foi chamado apenas com o primeiro dígito
    expect(mockInputMaskChange).toHaveBeenCalledWith("29:");
  });

  test("não permite que o quarto dígito (minuto) seja maior que 5", () => {
    const { getByTestId } = render(
      <MaskInput inputMaskChange={mockInputMaskChange} testID="mask-input" />
    );

    const input = getByTestId("mask-input");

    // Simula a mudança do texto
    fireEvent.changeText(input, "2359");

    // Verifica se inputMaskChange foi chamado com o valor adequado (23:59)
    expect(mockInputMaskChange).toHaveBeenCalledWith("23:59");

    // Simula a mudança do texto para um valor inválido nos minutos
    fireEvent.changeText(input, "2369");

    // Verifica se inputMaskChange foi chamado apenas com os três primeiros dígitos
    expect(mockInputMaskChange).toHaveBeenCalledWith("23:");
  });

  test("mantém apenas o primeiro dígito quando o segundo dígito é maior que 9", () => {
    const { getByTestId } = render(
      <MaskInput inputMaskChange={mockInputMaskChange} testID="mask-input" />
    );

    const input = getByTestId("mask-input");

    // Simula a mudança do texto com um segundo dígito maior que 9
    fireEvent.changeText(input, "1990");

    // Verifica se inputMaskChange foi chamado apenas com o primeiro dígito
    expect(mockInputMaskChange).toHaveBeenCalledWith("19:");
  });
});
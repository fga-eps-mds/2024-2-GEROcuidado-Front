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
});
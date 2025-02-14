import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CardRotina from "../components/CardRotina"; // Ajuste o caminho conforme necessário
import { IRotina, ECategoriaRotina } from "../interfaces/rotina.interface"; // Ajuste o caminho conforme necessário
import { router } from "expo-router";

// Mock do router do Expo
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock do ícone
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");

// Mock do AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve("mock-token")),
}));

// Mock do database
jest.mock("../db", () => ({
  get: jest.fn(() => ({
    write: jest.fn(),
    get: jest.fn(() => ({
      find: jest.fn(() => ({
        update: jest.fn(),
      })),
    })),
  })),
}));

// Dados de exemplo para a rotina
const mockRotina: IRotina = {
  id: "1",
  titulo: "Rotina de Teste",
  descricao: "Descrição da rotina de teste",
  categoria: ECategoriaRotina.ALIMENTACAO,
  dias: [1, 3, 5],
  dataHora: "2023-10-10T10:00:00",
  dataHoraConcluidos: [],
  token: "mock-token",
  notificacao: true,
  idIdoso: "1",
};

// Mock da data
const mockDate = new Date("2023-10-10T09:00:00");

describe("CardRotina", () => {
  it("deve renderizar corretamente", () => {
    const { getByText, getByTestId } = render(
      <CardRotina item={mockRotina} index={0} date={mockDate} />
    );

    // Verifica se o título e a descrição estão sendo renderizados
    expect(getByText("Rotina de Teste")).toBeTruthy();
    expect(getByText("Descrição da rotina de teste")).toBeTruthy();

    // Verifica se a hora está sendo renderizada corretamente
    expect(getByText("10:00")).toBeTruthy();

    // Verifica se o ícone está sendo renderizado
    expect(getByTestId("icon")).toBeTruthy();
  });

  it("deve navegar para a tela de edição ao ser pressionado", () => {
    const { getByTestId } = render(
      <CardRotina item={mockRotina} index={0} date={mockDate} />
    );

    // Simula o pressionamento do card
    fireEvent.press(getByTestId("card-rotina"));

    // Verifica se o router.push foi chamado com os parâmetros corretos
    expect(require("expo-router").router.push).toHaveBeenCalledWith({
      pathname: "/private/pages/editarRotina",
      params: {
        rotina: JSON.stringify({
          id: "1",
          titulo: "Rotina de Teste",
          categoria: ECategoriaRotina.ALIMENTACAO,
          dias: [1, 3, 5],
          dataHora: "2023-10-10T10:00:00",
          descricao: "Descrição da rotina de teste",
          token: "mock-token",
          notificacao: true,
          dataHoraConcluidos: [],
          idIdoso: "1",
        }),
      },
    });
  });

  it("deve alternar a cor de fundo com base no índice", () => {
    const { getByTestId, rerender } = render(
      <CardRotina item={mockRotina} index={0} date={mockDate} />
    );

    // Verifica a cor de fundo para índice par
    const cardPar = getByTestId("card-rotina");
    expect(cardPar.props.style[1].backgroundColor).toBe("#B4FFE8");

    // Re-renderiza com índice ímpar
    rerender(<CardRotina item={mockRotina} index={1} date={mockDate} />);

    // Verifica a cor de fundo para índice ímpar
    const cardImpar = getByTestId("card-rotina");
    expect(cardImpar.props.style[1].backgroundColor).toBe("#FFC6C6");
  });

  it("deve marcar a rotina como concluída ao pressionar o checkbox", () => {
    const { getByTestId } = render(
      <CardRotina item={mockRotina} index={0} date={mockDate} />
    );

    // Simula o pressionamento do checkbox
    fireEvent.press(getByTestId("checkbox"));

    // Verifica se o ícone de check foi renderizado
    expect(getByTestId("check-icon")).toBeTruthy();
  });
});
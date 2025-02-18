import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import Rotinas from "../private/tabs/rotinas";
import AsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import { hasFoto } from "../shared/helpers/foto.helper";

describe("Rotinas", () => {
  // Simula chamadas da API antes de cada teste
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200, // Garante que o teste não falha por status inválido
      json: jest.fn().mockResolvedValue({
        message: "Sucesso", // Evita erro ao acessar json.message
        data: [], // Simula resposta esperada da API
      }),
    });
  });

  it("renderiza corretamente", async () => {
    await waitFor(() => render(<Rotinas />));
  });

  it("renderiza corretamente com user id", async () => {
    await AsyncStorage.setItem("usuario", JSON.stringify({ id: 1 }));

    await waitFor(() => render(<Rotinas />));
  });

  it("renderiza corretamente quando o idoso não está selecionado", async () => {
    // Define um usuário válido no AsyncStorage
    await AsyncStorage.setItem("usuario", JSON.stringify({ id: 1 }));
    // Remove a chave "idoso" para simular a situação onde o idoso não está selecionado
    await AsyncStorage.removeItem("idoso");

    const { getByText } = render(<Rotinas />);

    // Verifica se o texto "Idoso não selecionado" está presente
    await waitFor(() => {
      expect(getByText(/Idoso não selecionado/i)).toBeTruthy();
    });
  });

  it("renderiza corretamente quando todas as condições são atendidas", async () => {
    // Define um usuário e idoso válidos no AsyncStorage
    await AsyncStorage.setItem("usuario", JSON.stringify({ id: 1 }));
    await AsyncStorage.setItem("idoso", JSON.stringify({ id: 1, foto: null, nome: "João" }));

    const { getByText } = render(<Rotinas />);

    // Espera que o nome do idoso esteja na tela
    await waitFor(() => {
      expect(getByText(/João/i)).toBeTruthy();
    });
  });
});

describe("hasFoto", () => {
  it("should return false if foto is null or undefined", () => {
    expect(hasFoto(null)).toBe(false);
    expect(hasFoto(undefined)).toBe(false);
  });

  it("should return false if foto is an empty string", () => {
    expect(hasFoto("")).toBe(false);
  });

  it("should return true if foto contains valid base64 data", () => {
    const validFoto = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/LE5HwAAAABJRU5ErkJggg==";
    expect(hasFoto(validFoto)).toBe(true);
  });
});
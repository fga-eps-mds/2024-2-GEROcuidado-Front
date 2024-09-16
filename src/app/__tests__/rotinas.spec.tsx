import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import Rotinas from "../private/tabs/rotinas";
import AsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

describe("Rotinas", () => {
  it("renderiza corretamente", async () => {
    await waitFor(() => render(<Rotinas />));
  });

  it("renderiza corretamente com user id", async () => {
    AsyncStorage.setItem("usuario", JSON.stringify({ id: 1 }));

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
});

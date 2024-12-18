import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import Perfil from "../private/tabs/perfil";
import AsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import router from "expo-router";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

describe("Perfil", () => {
  it("renderiza corretamente", async () => {
    await waitFor(() => render(<Perfil />));
  });

  it("renderiza corretamente com user id", async () => {
    AsyncStorage.setItem("usuario", JSON.stringify({ id: 1 }));

    await waitFor(() => render(<Perfil />));
  });

  it("renderiza corretamente com user id e foto", async () => {
    AsyncStorage.setItem(
      "usuario",
      JSON.stringify({ id: 1, foto: "data:image/png;base64,1" }),
    );

    await waitFor(() => render(<Perfil />));
  });

  it("deve chamar logout", async () => {
    AsyncStorage.setItem("usuario", JSON.stringify({ id: 1 }));

    await waitFor(async () => {
      const { getByTestId } = render(<Perfil />);
      await new Promise((r) =>
        setTimeout(() => {
          const logoutBtn = getByTestId("logoutBtn");
          fireEvent.press(logoutBtn);
          r(true);
        }, 100),
      );
      expect(router.router.replace).toHaveBeenCalled();
    });
  });

  it("deve chamar navigate", async () => {
    AsyncStorage.setItem("usuario", JSON.stringify({ id: 1 }));

    await waitFor(async () => {
      const { getByTestId } = render(<Perfil />);
      await new Promise((r) =>
        setTimeout(() => {
          const logoutBtn = getByTestId("navigateBtn");
          fireEvent.press(logoutBtn);
          r(true);
        }, 100),
      );
      expect(router.router.push).toHaveBeenCalled();
    });
  });

  it("deve chamar navigateIdosos", async () => {
    // Simula o usuário com ID 1 no AsyncStorage
    AsyncStorage.setItem("usuario", JSON.stringify({ id: 1 }));
  
    await waitFor(async () => {
      // Renderiza o componente Perfil
      const { getByText } = render(<Perfil />);
  
      // Espera um momento para garantir que o componente esteja renderizado
      await new Promise((r) =>
        setTimeout(() => {
          // Encontra o botão "Idosos" pelo texto ou pelo testID (se você adicionar um)
          const navigateBtn = getByText("Idosos"); // ou use getByTestId("navigateIdososBtn") se tiver um testID
  
          // Simula o pressionamento do botão
          fireEvent.press(navigateBtn);
  
          r(true);
        }, 100),
      );
  
      // Verifica se a navegação foi chamada com os parâmetros corretos
      expect(router.router.push).toHaveBeenCalledWith({
        pathname: "/private/pages/listarIdosos",
        params: { id: 1 }, // Aqui, certifica-se de que está passando o usuário correto
      });
    });
  });
});

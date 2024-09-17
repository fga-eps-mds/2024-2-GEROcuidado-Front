import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EditarPerfil from "../private/pages/editarPerfil";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

// Mock do expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [
      {
        uri: 'file://path/to/photo.jpg',
        base64: 'base64string',
      }
    ],
  }),
  MediaTypeOptions: {
    Images: 'Images'
  }
}));

// Substituindo o módulo real do expo-router por uma versão mockada
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({
    id: "123",
    nome: "Nome Teste",
    foto: null,
  }),
  router: {
    push: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
    replace: jest.fn(),
  },
}));

describe("EditarPerfil component", () => {
  test("Atualiza nome com o input", async () => {
    const { getByPlaceholderText } = render(<EditarPerfil />);
    const nameInput = getByPlaceholderText("Nome completo");
    fireEvent.changeText(nameInput, "Gustavo A");

    await waitFor(() => {
      expect(nameInput.props.value).toBe("Gustavo A");
    });
  });

  test("Exibe mensagem de erro ao tentar salvar com nome vazio", async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<EditarPerfil />);
    const nameInput = getByPlaceholderText("Nome completo");
    fireEvent.changeText(nameInput, "");

    const saveButton = getByText("Salvar");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText("Campo obrigatório!")).toBeTruthy();
    });

    await waitFor(() => {
      expect(queryByText("O nome completo deve ter pelo menos 5 caractéres.")).toBeNull();
      expect(queryByText("O nome completo deve ter no máximo 60 caractéres.")).toBeNull();
    });
  });

  test("Exibe mensagem de erro ao tentar salvar com nome muito curto", async () => {
    const { getByText, getByPlaceholderText, findByText } = render(<EditarPerfil />);
    const nameInput = getByPlaceholderText("Nome completo");
    fireEvent.changeText(nameInput, "Jo");

    const saveButton = getByText("Salvar");
    fireEvent.press(saveButton);

    await waitFor(async () => {
      const errorMessage = await findByText("O nome completo deve ter pelo menos 5 caractéres.");
      expect(errorMessage).toBeTruthy();
    });
  });

  test("Exibe mensagem de erro ao tentar salvar com nome muito longo", async () => {
    const { getByText, getByPlaceholderText, findByText } = render(<EditarPerfil />);
    const nameInput = getByPlaceholderText("Nome completo");
    fireEvent.changeText(nameInput, "Lorem Ipsum é apenas um texto fictício da indústria de impressão e composição tipográfica.");

    const saveButton = getByText("Salvar");
    fireEvent.press(saveButton);

    await waitFor(async () => {
      const errorMessage = await findByText("O nome completo deve ter no máximo 60 caractéres.");
      expect(errorMessage).toBeTruthy();
    });
  });

  test("Não exibe mensagem de erro ao salvar com nome válido", async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<EditarPerfil />);
    const nameInput = getByPlaceholderText("Nome completo");
    fireEvent.changeText(nameInput, "Nome Válido");

    const saveButton = getByText("Salvar");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(queryByText("Campo obrigatório!")).toBeNull();
      expect(queryByText("O nome completo deve ter pelo menos 5 caractéres.")).toBeNull();
      expect(queryByText("O nome completo deve ter no máximo 60 caractéres.")).toBeNull();
    });
  });

  test("Exibe mensagem de confirmação ao apagar conta", async () => {
    const { getByText, findByText } = render(<EditarPerfil />);
    const apagarContaButton = getByText("Apagar Conta");

    fireEvent.press(apagarContaButton);

    await waitFor(async () => {
      const confirmationMessage = await findByText("Prosseguir com a exclusão da conta?");
      expect(confirmationMessage).toBeTruthy();
    });
  });

  test("Apaga a conta corretamente após confirmação", async () => {
    const { getByText, findByText } = render(<EditarPerfil />);
    const apagarContaButton = getByText("Apagar Conta");

    fireEvent.press(apagarContaButton);

    await waitFor(async () => {
      const confirmButton = getByText("Apagar");
      fireEvent.press(confirmButton);
    });

    await waitFor(async () => {
      expect(router.replace).toHaveBeenCalledWith('/');
    });
  });

  test("Navega para a tela anterior ao clicar no botão de voltar", async () => {
    const { getByTestId } = render(<EditarPerfil />);

    const backButton = getByTestId("back-button-pressable");

    fireEvent.press(backButton);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/private/tabs/perfil");
    });
  });

  // Novo teste para verificar a atualização da foto de perfil
  test("Atualiza foto de perfil corretamente", async () => {
    const { getByTestId, findByText, getByText } = render(<EditarPerfil />);

    // Simula a seleção de uma nova foto
    const selectPhotoButton = getByTestId("upload-image-botao");
    fireEvent.press(selectPhotoButton);

    // Espera a mudança de estado e a resposta do mock
    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
      });
    });

    // Simula a confirmação de atualização da foto
    const saveButton = getByText("Salvar");
    fireEvent.press(saveButton);

    // Verifica se a mensagem de sucesso é exibida após a atualização da foto
    await waitFor(async () => {
      const successMessage = await findByText("Foto atualizada com sucesso");
      expect(successMessage).toBeTruthy();
    });
  });
});

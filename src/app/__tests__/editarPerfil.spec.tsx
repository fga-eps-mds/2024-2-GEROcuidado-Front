import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EditarPerfil from "../private/pages/editarPerfil";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import Toast from "react-native-toast-message";

// Mock for expo-image-picker
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

// Mock for expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({
    id: "123",
    nome: "Nome Teste",
    foto: null,
  }),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
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
      expect(queryByText("O nome completo deve ter pelo menos 5 caractéres.")).toBeNull();
      expect(queryByText("O nome completo deve ter no máximo 60 caractéres.")).toBeNull();
    });
  });

  test("Exibe mensagem de erro ao tentar salvar com nome muito curto", async () => {
    const { getByText, getByPlaceholderText } = render(<EditarPerfil />);
    const nameInput = getByPlaceholderText("Nome completo");
    fireEvent.changeText(nameInput, "Jo");

    const saveButton = getByText("Salvar");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText("O nome completo deve ter pelo menos 5 caractéres.")).toBeTruthy();
    });
  });

  test("Exibe mensagem de erro ao tentar salvar com nome muito longo", async () => {
    const { getByText, getByPlaceholderText } = render(<EditarPerfil />);
    const nameInput = getByPlaceholderText("Nome completo");
    fireEvent.changeText(nameInput, "Lorem Ipsum é apenas um texto fictício da indústria de impressão e composição tipográfica.");

    const saveButton = getByText("Salvar");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText("O nome completo deve ter no máximo 60 caractéres.")).toBeTruthy();
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

    await waitFor(() => {
      expect(findByText("Prosseguir com a exclusão da conta?")).toBeTruthy();
    });
  });

  test("Apaga a conta corretamente após confirmação", async () => {
    const { getByText } = render(<EditarPerfil />);
    const apagarContaButton = getByText("Apagar Conta");

    fireEvent.press(apagarContaButton);
    const confirmButton = getByText("Apagar");
    fireEvent.press(confirmButton);

    await waitFor(() => {
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

  test("Perfil editado com sucesso", async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<EditarPerfil />);
    
    const nameInput = getByPlaceholderText("Nome completo");
    fireEvent.changeText(nameInput, "Gustavo A");

    const selectPhotoButton = getByTestId("upload-image-botao");
    fireEvent.press(selectPhotoButton);
    
    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
        quality: 0,
      });
    });

    const saveButton = getByText("Salvar");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Sucesso!",
        text2: "Perfil atualizado com sucesso.",
      });
    });

    expect(nameInput.props.value).toBe("Gustavo A");

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/private/tabs/perfil");
    });
  });

  test("Atualiza foto de perfil corretamente", async () => {
    const { getByTestId, getByText } = render(<EditarPerfil />);

    const selectPhotoButton = getByTestId("upload-image-botao");
    fireEvent.press(selectPhotoButton);

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });

    const saveButton = getByText("Salvar");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Sucesso!",
        text2: "Perfil atualizado com sucesso.",
      });
    });
  });
});

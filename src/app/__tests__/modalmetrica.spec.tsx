import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import ModalMetrica from "../components/ModalMetrica";
import { EMetricas, IMetrica } from "../interfaces/metricas.interface";
import { ETipoSanguineo } from "../interfaces/idoso.interface";

const mockItem = {
  id: 2,
  idIdoso: 123,
  nome: "João Silva",
  dataNascimento: "1950-01-01",
  idUsuario: 123,
  foto: "url_da_foto.jpg",
  tipoSanguineo: ETipoSanguineo.A_POSITIVO,
  telefoneResponsavel: "123456789",
  descricao: "Idoso com histórico de hipertensão",
  dataHora: new Date(),
  categoria: EMetricas.FREQ_CARDIACA,
  valor: 75,
};

const mockItem1 = {
  id: 1,
  idIdoso: 123,
  nome: "João Silva",
  dataNascimento: "1950-01-01",
  idUsuario: 123,
  foto: "url_da_foto.jpg",
  tipoSanguineo: ETipoSanguineo.A_POSITIVO,
  telefoneResponsavel: "123456789",
  descricao: "Idoso com histórico de hipertensão",
  dataHora: new Date(),
  categoria: EMetricas.GLICEMIA,
  valor: 75,
};

const mockItem2 = {
  id: 1,
  idIdoso: 123,
  nome: "João Silva",
  dataNascimento: "1950-01-01",
  idUsuario: 123,
  foto: "url_da_foto.jpg",
  tipoSanguineo: ETipoSanguineo.A_POSITIVO,
  telefoneResponsavel: "123456789",
  descricao: "Idoso com histórico de hipertensão",
  dataHora: new Date(),
  categoria: EMetricas.PESO,
  valor: 75,
};

const mockItem3 = {
  id: 1,
  idIdoso: 123,
  nome: "João Silva",
  dataNascimento: "1950-01-01",
  idUsuario: 1234,
  foto: "url_da_foto.jpg",
  tipoSanguineo: ETipoSanguineo.A_POSITIVO,
  telefoneResponsavel: "123456789",
  descricao: "Idoso com histórico de hipertensão",
  dataHora: new Date(),
  categoria: EMetricas.PRESSAO_SANGUINEA,
  valor: 75,
};

const mockItem4 = {
  id: 1,
  idIdoso: 1234,
  nome: "João Silva",
  dataNascimento: "1950-01-01",
  idUsuario: 123,
  foto: "url_da_foto.jpg",
  tipoSanguineo: ETipoSanguineo.A_POSITIVO,
  telefoneResponsavel: "123456789",
  descricao: "Idoso com histórico de hipertensão",
  dataHora: new Date(),
  categoria: EMetricas.SATURACAO_OXIGENIO,
  valor: 75,
};

const mockItem5 = {
  id: 1,
  idIdoso: 123,
  nome: "João Silva",
  dataNascimento: "1950-01-01",
  idUsuario: 123,
  foto: "url_da_foto.jpg",
  tipoSanguineo: ETipoSanguineo.A_POSITIVO,
  telefoneResponsavel: "123456789",
  descricao: "Idoso com histórico de hipertensão",
  dataHora: new Date(),
  categoria: EMetricas.TEMPERATURA,
  valor: 75,
};

const mockItem6 = {
  id: 1,
  idIdoso: 123,
  nome: "João Silva ",
  dataNascimento: "1950-01-01",
  idUsuario: 123,
  foto: "url_da_foto.jpg",
  tipoSanguineo: ETipoSanguineo.A_POSITIVO,
  telefoneResponsavel: "123456789",
  descricao: "Idoso com histórico de hipertensão",
  dataHora: new Date(),
  categoria: EMetricas.HORAS_DORMIDAS,
  valor: 75,
};

const mockItem7 = {
  id: 1,
  idIdoso: 123,
  nome: "João Silva",
  dataNascimento: "1950-01-01",
  idUsuario: 13,
  foto: "url_da_foto.jpg",
  tipoSanguineo: ETipoSanguineo.A_POSITIVO,
  telefoneResponsavel: "123456789",
  descricao: "Idoso com histórico de hipertensão",
  dataHora: new Date(),
  categoria: EMetricas.ALTURA,
  valor: 95,
};

const mockItem8 = {
  id: 1,
  idIdoso: 123,
  nome: "João Silva",
  dataNascimento: "1950-01-01",
  idUsuario: 12,
  foto: "url_da_foto.jpg",
  tipoSanguineo: ETipoSanguineo.A_POSITIVO,
  telefoneResponsavel: "123456789",
  descricao: "Idoso com histórico de hipertensão",
  dataHora: new Date(),
  categoria: EMetricas.IMC,
  valor: 70,
};

describe("ModalMetrica Component", () => {
  it("renderiza sem erros", () => {
    render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem}
      />,
    );
  });
  it("exibe as unidades corretas", () => {
    render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem1}
      />,
    );
  });
  it("exibe as unidades corretas 1", () => {
    render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem2}
      />,
    );
  });
  it("exibe as unidades corretas 2", () => {
    render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem3}
      />,
    );
  });
  it("exibe as unidades corretas 3", () => {
    render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem4}
      />,
    );
  });
  it("exibe as unidades corretas 4", () => {
    render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem5}
      />,
    );
  });

  it("exibe as unidades corretas 5", () => {
    render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem6}
      />,
    );
  });

  it("exibe as unidades corretas 6", () => {
    render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem6}
      />,
    );
  });

  it("exibe as unidades corretas 7", () => {
    render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem7}
      />,
    );
  });

  it("exibe as unidades corretas 8", () => {
    render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem8}
      />,
    );
  });

  test("Exibe mensagem de erro para valor vazio", () => {
    const minhaMetrica: IMetrica = {
      id: 1,
      idIdoso: 123,
      categoria: EMetricas.FREQ_CARDIACA,
    };

    const { getByTestId, getByText } = render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        message="Teste"
        metrica={{ mockItem }}
      />,
    );

    fireEvent.press(getByTestId("callbackBtn"));

    expect(getByText("Campo obrigatório!")).toBeTruthy();
  });

  it("fecha o modal ao pressionar o botão Cancelar", () => {
    const mockCloseModal = jest.fn();

    const { getByTestId } = render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={mockCloseModal}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem8}
      />,
    );

    fireEvent.press(getByTestId("cancelarBtn"));

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("exibe mensagem de erro ao tentar salvar com valor inválido", async () => {
    const { getByTestId, getByText } = render(
      <ModalMetrica
        visible={true}
        callbackFn={() => {}}
        closeModal={() => {}}
        callbackValor={() => {}}
        message="Teste"
        metrica={mockItem}
      />,
    );

    fireEvent.press(getByTestId("callbackBtn"));

    // Assuming you have an error message displayed
    const errorMessage = getByText("Campo obrigatório!");
    expect(errorMessage).toBeTruthy();
  });

  describe("ModalMetrica Component Error Handling", () => {
    it("should show error when valor is empty", async () => {
      const { getByText, rerender } = render(
        <ModalMetrica
          visible={true}
          callbackFn={() => {}}
          closeModal={() => {}}
          callbackValor={() => {}}
          message="Teste"
          metrica={{ ...mockItem, valor: "" }}
        />
      );
  
      await waitFor(() => {
        expect(getByText("Campo obrigatório!")).toBeTruthy();
      });
    });

    it("exibe mensagem de erro ao tentar salvar com formato inválido", async () => {
      const { getByTestId, getByText } = render(
        <ModalMetrica
          visible={true}
          callbackFn={() => {}}
          closeModal={() => {}}
          callbackValor={() => {}}
          message="Teste"
          metrica={mockItem}
        />,
      );
    
      // Supondo que haja um campo de entrada para o valor
      const input = getByTestId("valorInput"); // Altere para o seu testID real do input
      fireEvent.changeText(input, "abc123"); // Valor inválido
    
      fireEvent.press(getByTestId("callbackBtn")); // Pressiona o botão para salvar
    
      await waitFor(() => {
        expect(getByText("Formato inválido!")).toBeTruthy(); // Verifica se a mensagem de erro está visível
      });
    });

    it("chama callbackFn com o valor correto ao pressionar Salvar", () => {
      const mockCallbackFn = jest.fn(); // Cria uma função mock para o callback
      const { getByTestId } = render(
        <ModalMetrica
          visible={true}
          callbackFn={mockCallbackFn} // Passa a função mock
          closeModal={() => {}}
          callbackValor={() => {}}
          message="Teste"
          metrica={mockItem}
        />
      );
    
      const input = getByTestId("valorInput"); // Obtém o input pelo testID
      fireEvent.changeText(input, "123"); // Define um valor válido
      fireEvent.press(getByTestId("callbackBtn")); // Pressiona o botão Salvar
    
      expect(mockCallbackFn).toHaveBeenCalledWith("123"); // Verifica se a função foi chamada com o valor correto
    });
  });
});


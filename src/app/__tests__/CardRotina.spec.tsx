import React from "react";
import { act, render, fireEvent } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@react-native-async-storage/async-storage/jest/async-storage-mock";
import CardRotina from "../components/CardRotina";
import { ECategoriaRotina, EDiasSemana } from "../interfaces/rotina.interface";
import database from "../db";
import { Toast } from "react-native-toast-message/lib/src/Toast";
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));
jest.useFakeTimers();
const rotina = {
  id: "1",
  titulo: "Título de Exemplo",
  idIdoso: "123",
  categoria: ECategoriaRotina.ALIMENTACAO,
  descricao: "Descrição de Exemplo",
  token: "token",
  dataHoraConcluidos: [],
  dataHora: new Date(),
  dias: [EDiasSemana.Domingo],
  notificacao: true,
  createdAt: new Date(),
  updatedAt: new Date(),

};
const rotina_exercicios = {
  id: "2",
  titulo: "Card exercicio",
  idIdoso: "456",
  categoria: ECategoriaRotina.EXERCICIOS,
  descricao: "caminhada",
  dataHoraConcluidos: [],
  dataHora: new Date(),
  dias: [EDiasSemana.Domingo],
  notificacao: true,
};
const rotina_medicamentos = {
  id: "3",
  titulo: "Card medicamento",
  idIdoso: "789",
  categoria: ECategoriaRotina.MEDICAMENTO,
  descricao: "dipirona",
  dataHoraConcluidos: [],
  dataHora: new Date(),
  dias: [EDiasSemana.Domingo],
  notificacao: true,
};
describe("Teste Componente Card Rotina", () => {
  act(() => {
    test("Renderiza corretamente", () => {
      const { getByText } = render(
        <CardRotina item={rotina} index={0} date={new Date()} />,
      );
      expect(getByText("Título de Exemplo")).toBeTruthy();
      expect(getByText("Descrição de Exemplo")).toBeTruthy();
    });
    test("Renderiza corretamente Card de exercicios", () => {
      const { getByText } = render(
        <CardRotina item={rotina_exercicios} index={0} date={new Date()} />,
      );
      expect(getByText("Card exercicio")).toBeTruthy();
      expect(getByText("caminhada")).toBeTruthy();
    });
    test("Renderiza corretamente Card de Medicamentos", () => {
      const { getByText } = render(
        <CardRotina item={rotina_medicamentos} index={0} date={new Date()} />,
      );
      expect(getByText("Card medicamento")).toBeTruthy();
      expect(getByText("dipirona")).toBeTruthy();
    });
    test("Verifica se debounceConcluido funciona corretamente", () => {
      const { getByTestId, queryByTestId } = render(
        <CardRotina item={rotina} index={0} date={new Date()} />
      );

      const checkbox = getByTestId("checkbox");
      expect(queryByTestId("check-icon")).toBeNull();

      fireEvent.press(checkbox);

      act(() => {
        jest.runAllTimers();
      });

      expect(queryByTestId("check-icon")).toBeTruthy();
    });
  });
  it("deve obter o token do AsyncStorage", async () => {
    const mockToken = "mock-token";
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockToken);

    const { getByTestId } = render(
      <CardRotina item={rotina} index={0} date={new Date()} />
    );

    await act(async () => {
      jest.runAllTimers();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith("token");
  });
  /*it("deve definir o ícone corretamente para cada categoria", () => {
    const { getByTestId, rerender } = render(
      <CardRotina item={rotina} index={0} date={new Date()} />
    );

    expect(getByTestId("icon").props.children.props.name).toBe("food-apple-outline");

    rerender(<CardRotina item={rotina_exercicios} index={0} date={new Date()} />);
    expect(getByTestId("icon").props.children.props.name).toBe("dumbbell");

    rerender(<CardRotina item={rotina_medicamentos} index={0} date={new Date()} />);
    expect(getByTestId("icon").props.children.props.name).toBe("medical-bag");
  });
  it("deve remover a data de dataHoraConcluidos quando concluido é false", async () => {
    const rotinaComConclusao = {
      ...rotina,
      dataHoraConcluidos: ["10/10/2023"],
    };

    const { getByTestId } = render(
      <CardRotina item={rotinaComConclusao} index={0} date={new Date("2023-10-10")} />
    );

    const checkbox = getByTestId("checkbox");
    fireEvent.press(checkbox);

    await act(async () => {
      jest.runAllTimers();
    });

    expect(database.write).toHaveBeenCalled();
  });*/
  it("deve navegar para a tela de edição ao pressionar o card", () => {
    const { getByTestId } = render(
      <CardRotina item={rotina} index={0} date={new Date()} />
    );

    const card = getByTestId("card-rotina");
    fireEvent.press(card);

    expect(require("expo-router").router.push).toHaveBeenCalledWith({
      pathname: "/private/pages/editarRotina",
      params: {
        rotina: JSON.stringify({
          id: rotina.id,
          titulo: rotina.titulo,
          categoria: rotina.categoria,
          dias: rotina.dias,
          dataHora: rotina.dataHora,
          descricao: rotina.descricao,
          token: rotina.token,
          notificacao: rotina.notificacao,
          dataHoraConcluidos: rotina.dataHoraConcluidos,
          idIdoso: rotina.idIdoso,
          createdAt: rotina.createdAt,
          updatedAt: rotina.updatedAt,
        }),
      },
    });
  });
  
  it("deve definir check como false quando a data não está em dataHoraConcluidos", () => {
    const rotinaSemConclusao = {
      ...rotina,
      dataHoraConcluidos: [],
    };

    const { queryByTestId } = render(
      <CardRotina item={rotinaSemConclusao} index={0} date={new Date("2023-10-10")} />
    );

    expect(queryByTestId("check-icon")).toBeNull();
  });
  /*it("deve exibir um Toast de erro ao falhar ao atualizar a rotina", async () => {
    const mockError = new Error("Erro ao atualizar rotina");
    (database.write as jest.Mock).mockRejectedValue(mockError);

    const { getByTestId } = render(
      <CardRotina item={rotina} index={0} date={new Date()} />
    );

    const checkbox = getByTestId("checkbox");
    fireEvent.press(checkbox);

    await act(async () => {
      jest.runAllTimers();
    });

    expect(Toast.show).toHaveBeenCalledWith({
      type: "error",
      text1: "Erro!",
      text2: mockError.message,
    });
  });
  it("deve limpar o timer existente antes de definir um novo", async () => {
    const { getByTestId } = render(
      <CardRotina item={rotina} index={0} date={new Date()} />
    );

    const checkbox = getByTestId("checkbox");

    fireEvent.press(checkbox);

    fireEvent.press(checkbox);

    await act(async () => {
      jest.runAllTimers();
    });

    expect(getByTestId("check-icon")).toBeTruthy();
  });
  it("deve exibir um Toast de erro ao falhar ao buscar ou atualizar a rotina", async () => {
    const mockError = new Error("Erro ao buscar ou atualizar rotina");
    (database.get as jest.Mock).mockImplementation(() => ({
      write: jest.fn().mockRejectedValue(mockError),
    }));

    const { getByTestId } = render(
      <CardRotina item={rotina} index={0} date={new Date()} />
    );

    const checkbox = getByTestId("checkbox");
    fireEvent.press(checkbox);

    await act(async () => {
      jest.runAllTimers();
    });

    expect(Toast.show).toHaveBeenCalledWith({
      type: "error",
      text1: "Erro!",
      text2: mockError.message,
    });
  });
  it("deve configurar um setTimeout para chamar updateRotinaConcluido após 1 segundo", async () => {
    const { getByTestId } = render(
      <CardRotina item={rotina} index={0} date={new Date()} />
    );

    const checkbox = getByTestId("checkbox");

    fireEvent.press(checkbox);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(database.write).toHaveBeenCalled();
  });
  
  it("deve buscar e atualizar a rotina no banco de dados", async () => {
    const mockRotinaCollection = {
      find: jest.fn().mockResolvedValue({
        update: jest.fn(),
      }),
    };
  
    (database.get as jest.Mock).mockReturnValue(mockRotinaCollection);
  
    const { getByTestId } = render(
      <CardRotina item={rotina} index={0} date={new Date()} />
    );
  
    const checkbox = getByTestId("checkbox");
    fireEvent.press(checkbox);
  
    await act(async () => {
      jest.runAllTimers(); // Avança o tempo para garantir que a função seja executada
    });
  
    // Verifica se a função find foi chamada com o ID correto
    expect(mockRotinaCollection.find).toHaveBeenCalledWith(rotina.id);
  
    // Verifica se a função update foi chamada
    expect(mockRotinaCollection.find().update).toHaveBeenCalled();
  });*/
});
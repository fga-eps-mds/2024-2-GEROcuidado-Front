import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CardEvento from "../components/CardEvento"; // Ajuste o caminho conforme necessário
import { IEvento } from "../interfaces/evento.interface"; // Ajuste o caminho conforme necessário

// Mock do router do Expo
jest.mock("expo-router", () => ({
    router: {
        push: jest.fn(),
    },
}));

// Mock do ícone
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");

// Dados de exemplo para o evento
const mockEvento: IEvento = {
    id: "1",
    titulo: "Evento de Teste",
    descricao: "Descrição do evento de teste",
    dataHora: "2023-10-10T10:00:00",
    categoria: "Categoria de Teste",
    local: "Local de Teste",
    participantes: ["Participante 1", "Participante 2"],
    createdAt: "2023-10-01T00:00:00",
    updatedAt: "2023-10-01T00:00:00",
};

// Mock da data
const mockDate = new Date("2023-10-10T09:00:00");

describe("CardEvento", () => {
    it("deve renderizar corretamente", () => {
        const { getByText } = render(
            <CardEvento item={mockEvento} index={0} date={mockDate} />
        );

        // Verifica se o título e a descrição estão sendo renderizados
        expect(getByText("Evento de Teste")).toBeTruthy();
        expect(getByText("Descrição do evento de teste")).toBeTruthy();

        // Verifica se a hora está sendo renderizada corretamente
        expect(getByText("10:00")).toBeTruthy();
    });

    it("deve navegar para a tela de edição ao ser pressionado", () => {
        const { getByTestId } = render(
            <CardEvento item={mockEvento} index={0} date={mockDate} />
        );

        // Simula o pressionamento do card
        fireEvent.press(getByTestId("card-evento"));

        // Verifica se o router.push foi chamado com os parâmetros corretos
        expect(require("expo-router").router.push).toHaveBeenCalledWith({
            pathname: "/private/pages/editarEvento",
            params: {
                evento: JSON.stringify({
                    id: "1",
                    titulo: "Evento de Teste",
                    descricao: "Descrição do evento de teste",
                    dataHora: "2023-10-10T10:00:00",
                    categoria: "Categoria de Teste",
                    participantes: ["Participante 1", "Participante 2"],
                    local: "Local de Teste",
                    criadoEm: "2023-10-01T00:00:00",
                    atualizadoEm: "2023-10-01T00:00:00",
                }),
            },
        });
    });

    it("deve alternar a cor de fundo com base no índice", () => {
        const { getByTestId, rerender } = render(
            <CardEvento item={mockEvento} index={0} date={mockDate} />
        );

        // Verifica a cor de fundo para índice par
        const cardPar = getByTestId("card-evento");
        expect(cardPar.props.style[1].backgroundColor).toBe("#B4E1FF");

        // Re-renderiza com índice ímpar
        rerender(<CardEvento item={mockEvento} index={1} date={mockDate} />);

        // Verifica a cor de fundo para índice ímpar
        const cardImpar = getByTestId("card-evento");
        expect(cardImpar.props.style[1].backgroundColor).toBe("#FFD6B4");
    });
});
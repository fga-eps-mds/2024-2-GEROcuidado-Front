import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import Publicacao from "../components/Publicacao";
import { IPublicacao } from "../interfaces/forum.interface";
import { router } from "expo-router";
import { ECategoriaPublicacao } from "../interfaces/forum.interface"; // Adjust the import path as necessary

jest.mock("expo-router");

describe("Publicacao", () => {
    const mockPublicacao: IPublicacao = {
        id: 1,
        titulo: "Título da Publicação",
        descricao: "Descrição da publicação.",
        dataHora: new Date(),
        categoria: ECategoriaPublicacao.GERAL,
        idUsuario: 1,
        usuario: {
            id: 1,
            admin: false,
            data_nascimento: new Date(),
            email: "teste@gmail.com",
            senha: "123456",
            nome: "Nome do Usuário",
            foto: undefined,
            descricao: "Descrição do Usuário",
        },
    };

    it("renderiza o componente corretamente", () => {
        render(<Publicacao item={mockPublicacao} />);

        expect(screen.getByText("Título da Publicação")).toBeTruthy();
        expect(screen.getByText("Descrição da publicação.")).toBeTruthy();
        expect(screen.getByText("Nome do Usuário")).toBeTruthy();
    });

    it("renderiza a foto do usuário", () => {
        render(<Publicacao item={mockPublicacao} />);

        const imagem = screen.getByTestId("placeholder-icon");
        expect(imagem).toBeTruthy();
    });

    it("renderiza o placeholder da foto quando não há foto", () => {
        const publicacaoSemFoto = {...mockPublicacao, usuario: {...mockPublicacao.usuario, foto: null } };
        render(<Publicacao item={publicacaoSemFoto} />);

        expect(screen.getByTestId("placeholder-icon")).toBeTruthy();
    });

    it("formata a data corretamente", () => {
        render(<Publicacao item={mockPublicacao} />);

        const dataFormatada = mockPublicacao.dataHora.toLocaleString("pt-BR", { year: 'numeric', month: '2-digit', day: '2-digit' });
        expect(screen.getByText(dataFormatada)).toBeTruthy();
    });

    it("navega para a tela de denúncia ao clicar no ícone de denúncia", () => {
        render(<Publicacao item={mockPublicacao} />);

        fireEvent.press(screen.getByTestId("reportButton"));

        expect(router.push).toHaveBeenCalledWith({
        pathname: "/private/pages/criarDenuncia",
        params: {...mockPublicacao,...mockPublicacao.usuario, id: mockPublicacao.id },
        });
    });

    it("navega para a tela de visualização da publicação ao clicar na publicação", () => {
        render(<Publicacao item={mockPublicacao} />);

        fireEvent.press(screen.getByTestId("publicacaoCard"));

        expect(router.push).toHaveBeenCalledWith({
        pathname: "/private/pages/visualizarPublicacao",
        params: {
        ...mockPublicacao,
            id: mockPublicacao.id,
            foto: mockPublicacao.usuario?.foto,
            nome: mockPublicacao.usuario?.nome,
        },
        });
    });

    it("exibe o nome completo do usuário quando crop é false", () => {
        render(<Publicacao item={mockPublicacao} crop={false} />);

        expect(screen.getByText("Nome do Usuário")).toBeTruthy();
    });

    it("trunca o nome do usuário quando crop é true e o nome é muito longo", () => {
        const publicacaoNomeLongo = {...mockPublicacao, usuario: {...mockPublicacao.usuario, nome: "Nome do Usuário Muito Longo" } };
        render(<Publicacao item={publicacaoNomeLongo} crop={true} />);

        expect(screen.getByText("Nome do Usuário Muito Lon...")).toBeTruthy();
    });

    it("exibe o título completo da publicação quando crop é false", () => {
        render(<Publicacao item={mockPublicacao} crop={false} />);

        expect(screen.getByText("Título da Publicação")).toBeTruthy();
    });

    it("exibe a descrição completa da publicação quando crop é false", () => {
        render(<Publicacao item={mockPublicacao} crop={false} />);

        expect(screen.getByText("Descrição da publicação.")).toBeTruthy();
    });

    it("exibe a mensagem de usuários reportaram quando idUsuarioReporte não está vazio", () => {
        const publicacaoComReports = {...mockPublicacao, idUsuarioReporte: [1, 2]};
        render(<Publicacao item={publicacaoComReports} />);

        expect(screen.getByText("Usuários reportaram")).toBeTruthy();
    });
});
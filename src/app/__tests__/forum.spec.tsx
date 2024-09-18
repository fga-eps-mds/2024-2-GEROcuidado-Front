import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Forum from "../private/tabs/forum";
import { getAllPublicacao } from "../services/forum.service";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useNavigation } from '@react-navigation/native';

// Mockando as funções de serviço e navegação
jest.mock("../services/forum.service");
jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

// Mock da função de navegação
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock para a função que busca publicações
jest.mock("../services/forum.service", () => ({
  getAllPublicacao: jest.fn(() => Promise.resolve(mockPublicacoes)),
}));

const mockPublicacoes = [
  { id: 1, titulo: "Publicação 1", descricao: "Descrição 1", categoria: "Saúde" },
  { id: 2, titulo: "Publicação 2", descricao: "Descrição 2", categoria: "Geral" },
];

describe("Forum", () => {
  it("renderiza corretamente", async () => {
    await waitFor(() => render(<Forum />));
  });
});

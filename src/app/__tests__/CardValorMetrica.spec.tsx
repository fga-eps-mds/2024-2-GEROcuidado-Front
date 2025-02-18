import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import CardValorMetrica from "../components/CardValorMetrica";
import { EMetricas, IMetrica } from "../interfaces/metricas.interface";
import { IValorMetricaCategoria } from "../interfaces/metricas.interface";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import database from "../db";
import { Collection } from "@nozbe/watermelondb";
import ValorMetrica from "../model/ValorMetrica";

jest.mock("react-native-toast-message");
jest.mock("expo-router");
jest.mock("@react-native-async-storage/async-storage");
jest.mock("../db");

const createMockItem = (categoria: EMetricas, valor: string = "100"): IValorMetricaCategoria => ({
    id: 1,
    valor,
    dataHora: "2024-03-10T10:00:00.000Z",
    categoria,
    idMetrica: 1,
});

describe("CardValorMetrica", () => {

const mockValorMetricaInstance = {
    id: '1',
    destroyPermanently: jest.fn(),
    };
    
    const valorMetricasCollection = {
    find: jest.fn().mockResolvedValue(mockValorMetricaInstance), 
    destroyPermanently: jest.fn(),
    };

  const mockItem: IValorMetricaCategoria = {
    id: 1,
    valor: "120",
    dataHora: "2024-03-10T10:00:00.000Z",
    categoria: EMetricas.FREQ_CARDIACA,
    idMetrica: 1,
  };

  const mockMetrica: IMetrica = {
    id: 1,
    idIdoso: 1,
    categoria: EMetricas.FREQ_CARDIACA,
    valorMaximo: "200",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (database.get as jest.Mock).mockReturnValue(valorMetricasCollection);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("mockToken");
  });

  it("renderiza o componente corretamente", () => {
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);

    expect(screen.getByText("120")).toBeTruthy();
    expect(screen.getByText("bpm")).toBeTruthy();
  });

  /*it("exibe a data e hora formatadas", () => {
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);

    expect(screen.getByText("10/03/2024")).toBeTruthy();
    // Considerando aqui o fuso horário de Brasília (UTC-3)
    expect(screen.getByText("07:00")).toBeTruthy();
  });*/

  it("exibe o ícone correto para cada métrica", () => {
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);

    expect(screen.getByTestId("heartbeat")).toBeTruthy(); 
  });


  it("fecha o modal de confirmação ao clicar em cancelar", () => {
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);

    const apagarButton = screen.getByTestId("apagarButton");
    fireEvent.press(apagarButton);

    const cancelarButton = screen.getByText("Cancelar");
    fireEvent.press(cancelarButton);

    expect(screen.queryByText("Apagar")).toBeNull();
  });

  it("renderiza GLICEMIA corretamente", () => {
    const mockItem = createMockItem(EMetricas.GLICEMIA);
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);
    expect(screen.getByText("mg/dL")).toBeTruthy();
    expect(screen.getByTestId("cubes")).toBeTruthy();
  });

  it("renderiza PESO corretamente", () => {
    const mockItem = createMockItem(EMetricas.PESO);
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);
    expect(screen.getByText("kg")).toBeTruthy();
  });

  it("renderiza PRESSAO_SANGUINEA corretamente", () => {
    const mockItem = createMockItem(EMetricas.PRESSAO_SANGUINEA);
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);
    expect(screen.getByText("mmHg")).toBeTruthy();
    expect(screen.getByTestId("tint")).toBeTruthy();
  });

    it("renderiza SATURACAO_OXIGENIO corretamente", () => {
      const mockItem = createMockItem(EMetricas.SATURACAO_OXIGENIO);
      render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);
      expect(screen.getByText("%")).toBeTruthy();
      expect(screen.getByText("O2")).toBeTruthy();
  });

  it("renderiza TEMPERATURA corretamente", () => {
    const mockItem = createMockItem(EMetricas.TEMPERATURA);
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);
    expect(screen.getByText("°C")).toBeTruthy();
    expect(screen.getByTestId("thermometer")).toBeTruthy();
  });

  it("renderiza HORAS_DORMIDAS corretamente", () => {
    const mockItem = createMockItem(EMetricas.HORAS_DORMIDAS);
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);
    expect(screen.getByText("h")).toBeTruthy();
    expect(screen.getByTestId("bed")).toBeTruthy();
  });

  it("renderiza ALTURA corretamente", () => {
    const mockItem = createMockItem(EMetricas.ALTURA);
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);
    expect(screen.getByText("cm")).toBeTruthy();
  });

  it("renderiza IMC corretamente", () => {
    const mockItem = createMockItem(EMetricas.IMC);
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);
    expect(screen.getByText("kg/m²")).toBeTruthy();
    expect(screen.getByTestId("calculator")).toBeTruthy();

  });

  it("renderiza HIDRATACAO corretamente", () => {
    const mockItem = createMockItem(EMetricas.HIDRATACAO);
    render(<CardValorMetrica item={mockItem} metrica={mockMetrica} />);
    expect(screen.getByText("ml")).toBeTruthy();
    expect(screen.getByTestId("cup-water")).toBeTruthy();
  });
});
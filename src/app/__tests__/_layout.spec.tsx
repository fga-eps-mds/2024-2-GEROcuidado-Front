import React from "react";
import { render } from "@testing-library/react-native";
import AppLayout from "../_layout";
import TabsLayout from "../private/tabs/_layout";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";

// Mock do Stack
jest.mock("expo-router", () => ({
  Stack: jest.fn(({ screenOptions }) => (
    <>{screenOptions?.header?.()}</> // Renderiza o header se ele existir nas screenOptions
  )),
}));

// Mock do Toast
jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

// Mock das Notifications
jest.mock("expo-notifications", () => ({
  __esModule: true,
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  removeNotificationSubscription: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

describe("AppLayout Component", () => {

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restaurar o comportamento original
  });

  it("deve renderizar o layout com Toast e Stack", () => {
    const { getByTestId } = render(<AppLayout />);

    // Verifica se o Toast foi renderizado (mesmo que seja um mock)
    expect(Toast).toHaveBeenCalled();

    // Verifica se o Stack foi renderizado
    const toastView = getByTestId("toast-view");
    expect(toastView).toBeTruthy();

    // Verifica se o layout está configurado corretamente
    const layoutView = getByTestId("layout-view");
    expect(layoutView).toBeTruthy();
  });

  it("deve renderizar o header do Stack corretamente", () => {
    const { getByTestId } = render(<AppLayout />);
    const headerView = getByTestId("stack-header");
    expect(headerView).toBeTruthy();
  });

  it("deve lidar com notificações corretamente", async () => {
    const notification = { request: { content: { title: "Test Notification" } } };
    Notifications.addNotificationReceivedListener.mock.calls[0][0](notification);

    expect(Notifications.addNotificationReceivedListener).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(notification);

    const response = { actionIdentifier: "default" };
    Notifications.addNotificationResponseReceivedListener.mock.calls[0][0](response);

    expect(Notifications.addNotificationResponseReceivedListener).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(response);
  });

  it("deve configurar o handler de notificação corretamente", async () => {
    render(<AppLayout />);
  
    // Verifica se o setNotificationHandler foi chamado
    expect(Notifications.setNotificationHandler).toHaveBeenCalled();
  
    // Extrai a configuração passada para setNotificationHandler
    const handlerConfig = Notifications.setNotificationHandler.mock.calls[0][0];
  
    // Verifica se handleNotification retorna o objeto esperado
    const result = await handlerConfig.handleNotification();
    expect(result).toEqual({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    });
  });  
});

describe("TabsLayout", () => {
  it("deve importar o componente TabsLayout corretamente", () => {
    expect(TabsLayout).toBeDefined();
    expect(typeof TabsLayout).toBe('function');
  });

  /*
  it('deve renderizar o componente Tabs e seus filhos', () => {
    const { getByTestId } = render(<TabsLayout />);
    
    // Verifique a presença de um elemento específico no DOM
    expect(getByTestId('tabs-mock')).toBeTruthy();
  });
  */ 
});

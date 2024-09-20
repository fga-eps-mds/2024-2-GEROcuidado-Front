import React from "react";
import { render } from "@testing-library/react-native";
import AppLayout from "../_layout";
import TabsLayout from "../private/tabs/_layout";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";

// Mock do Stack
jest.mock("expo-router", () => ({
  Stack: (props: any) => <>{props.children}</>, // Mock simples que renderiza os filhos
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
  it("deve configurar os listeners de notificação", () => {
    render(<AppLayout />);
    expect(Notifications.addNotificationReceivedListener).toHaveBeenCalled();
    expect(Notifications.addNotificationResponseReceivedListener).toHaveBeenCalled();
  });
});

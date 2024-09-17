import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import AppLayout from "..";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";

// Mock de dependências externas
jest.mock("expo-notifications", () => ({
    addNotificationReceivedListener: jest.fn((callback) => {
      // Simula o comportamento do listener
      return { remove: jest.fn() };
    }),
    addNotificationResponseReceivedListener: jest.fn((callback) => {
      return { remove: jest.fn() };
    }),
    removeNotificationSubscription: jest.fn(),
}));
  

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

describe("AppLayout", () => {

    it("renderiza corretamente", () => {
        const { toJSON } = render(<AppLayout />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("deve registrar e remover listeners de notificações", () => {
        const addNotificationReceivedListenerMock = jest.spyOn(
          Notifications,
          "addNotificationReceivedListener"
        );
        const addNotificationResponseReceivedListenerMock = jest.spyOn(
          Notifications,
          "addNotificationResponseReceivedListener"
        );
        const removeNotificationSubscriptionMock = jest.spyOn(
          Notifications,
          "removeNotificationSubscription"
        );
      
        const { unmount } = render(<AppLayout />);
      
        // Verifica se os listeners foram registrados
        expect(addNotificationReceivedListenerMock).toHaveBeenCalledTimes(0);
        expect(addNotificationResponseReceivedListenerMock).toHaveBeenCalledTimes(0);
      
        // Desmonta o componente
        unmount();
      
        // Verifica se os listeners foram removidos
        expect(removeNotificationSubscriptionMock).toHaveBeenCalledTimes(0);
    });
      
});

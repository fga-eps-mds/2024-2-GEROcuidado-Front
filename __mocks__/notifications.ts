// __mocks__/notifications.ts
export type CustomPermissionStatus = {
    status: 'granted' | 'denied' | 'default';  // Adapte conforme os valores possíveis
    expires: string;
    granted: boolean;
    canAskAgain: boolean;
};
  
export type CustomExpoPushToken = {
data: string;
type: 'expo';  // Ou outro tipo que o seu código espera
};
  
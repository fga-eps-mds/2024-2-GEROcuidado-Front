export const getPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });
export const requestPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });
export const getExpoPushTokenAsync = jest.fn().mockResolvedValue({ data: 'mockToken' });
export const setNotificationChannelAsync = jest.fn();

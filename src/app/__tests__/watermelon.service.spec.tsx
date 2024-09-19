import { synchronize } from '@nozbe/watermelondb/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncDatabaseWithServer } from '../services/watermelon.service'; 

jest.mock('@nozbe/watermelondb/sync', () => ({
  synchronize: jest.fn()
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn()
}));

global.fetch = jest.fn();

describe('syncDatabaseWithServer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully synchronize database with server', async () => {
    const mockChanges = { some: 'changes' };
    const mockTimestamp = new Date().toISOString();
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          changes: mockChanges,
          timestamp: mockTimestamp
        },
        message: 'Success'
      })
    };
  });
});

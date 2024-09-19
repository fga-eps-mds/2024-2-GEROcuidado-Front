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
    
    const mockToken = 'mockToken';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockToken);
    (fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    (synchronize as jest.Mock).mockImplementation(async ({ pullChanges }) => {
      const result = await pullChanges({
        lastPulledAt: 0,
        schemaVersion: 1,
        migration: 1
      });
      return { changes: mockChanges, timestamp: mockTimestamp };
    });

    await syncDatabaseWithServer();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('token');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/usuario/sync/pull_users'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`
        })
      })
    );

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/usuario\/sync\/pull_users\?lastPulledAt=0&schemaVersion=1&migration=1/),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`
        })
      })
    );
  });
});

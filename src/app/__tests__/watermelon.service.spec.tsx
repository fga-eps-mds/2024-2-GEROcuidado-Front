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
});

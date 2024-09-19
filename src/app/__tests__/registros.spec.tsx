import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import Registros from '../private/tabs/registros';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IIdoso } from '../interfaces/idoso.interface';
import { IMetrica } from '../interfaces/metricas.interface';
import { Q } from '@nozbe/watermelondb';
import database from '../db';
import { getAllMetrica } from '../services/metrica.service';
import Toast from 'react-native-toast-message';

// Mocking the necessary components and services
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('../db', () => ({
  get: jest.fn().mockReturnValue({
    query: jest.fn().mockReturnValue({
      fetch: jest.fn(),
    }),
  }),
}));

jest.mock('react-native-toast-message');

describe('Registros', () => {
  const mockUser = { id: 'user1', nome: 'User Test' };
  const mockIdoso: IIdoso = { id: 'idoso1', nome: 'Idoso Test', foto: null };
  const mockMetricas: IMetrica[] = [{ _raw: { idoso_id: 'idoso1' } }];

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should render the user and idoso information when both are available', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(mockUser)) // Mocking user
      .mockResolvedValueOnce(JSON.stringify(mockIdoso)); // Mocking idoso

    const { getByText, getByTestId } = render(<Registros />);
  });
});
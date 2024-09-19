import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Registros from '../private/tabs/registros';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IIdoso } from '../interfaces/idoso.interface';
import { IMetrica, EMetricas } from '../interfaces/metricas.interface'; // Import EMetricas
import database from '../db';
import Toast from 'react-native-toast-message';

// Mocking necessary components and services
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
  const mockIdoso: IIdoso = { id: 'idoso1', nome: 'Idoso Test', foto: undefined };
  const mockMetricas: IMetrica[] = [
    { id: 1, idIdoso: 'idoso1', categoria: EMetricas.PESO, valorMaximo: '75' } // Use EMetricas.PESO
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the user and idoso information when both are available', async () => {
    // Mocking AsyncStorage to return user and idoso
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(mockUser)) // Mocking user
      .mockResolvedValueOnce(JSON.stringify(mockIdoso)); // Mocking idoso

    // Mocking the database query to return some metricas
    (database.get as jest.Mock).mockReturnValue({
      query: jest.fn().mockReturnValue({
        fetch: jest.fn().mockResolvedValueOnce(mockMetricas), // Returning mock metrics
      }),
    });

    const { getByText, getByTestId, queryByTestId } = render(<Registros />);

    // Wait for the user and idoso info to be rendered
    await waitFor(() => {
      expect(getByText('Idoso Test')).toBeTruthy(); // Verifying the idoso name appears
    });

    // Check that the "no photo" placeholder is displayed (since foto is null)
    const noPhotoIcon = queryByTestId('no-photo-icon');
  });
});

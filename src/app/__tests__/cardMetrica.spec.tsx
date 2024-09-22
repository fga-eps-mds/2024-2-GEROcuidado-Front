import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import CardMetrica from '../components/CardMetrica'; 
import { EMetricas, IMetrica } from '../interfaces/metricas.interface';
import database from '../db';

// Mock da função de consulta ao banco de dados
jest.mock('../db', () => ({
  get: jest.fn(() => ({
    query: jest.fn().mockReturnValue({
      fetch: jest.fn(() => Promise.resolve([{ valor: 80, dataHora: '2024-09-18T12:00:00-03:00' }])),
    }),
  })),
}));

describe('CardMetrica Component', () => {
  const mockItemFrequencia: IMetrica = {
    id: 1,
    idIdoso: 123,
    categoria: EMetricas.FREQ_CARDIACA,
  };

  const mockItemGlicemia: IMetrica = {
    id: 1,
    idIdoso: 123,
    categoria: EMetricas.GLICEMIA,
  };

  const mockItemPeso: IMetrica = {
    id: 1,
    idIdoso: 123,
    categoria: EMetricas.PESO,
  };

  const mockItemPressao: IMetrica = {
    id: 1,
    idIdoso: 123,
    categoria: EMetricas.PRESSAO_SANGUINEA,
  };

  const mockItemSaturacao: IMetrica = {
    id: 1,
    idIdoso: 123,
    categoria: EMetricas.SATURACAO_OXIGENIO,
  };

  const mockItemTemperatura: IMetrica = {
    id: 1,
    idIdoso: 123,
    categoria: EMetricas.TEMPERATURA,
  };

  const mockItemHoras: IMetrica = {
    id: 1,
    idIdoso: 123,
    categoria: EMetricas.HORAS_DORMIDAS,
  };

  const mockItemAltura: IMetrica = {
    id: 1,
    idIdoso: 123,
    categoria: EMetricas.ALTURA,
  };

  const mockItemIMC: IMetrica = {
    id: 1,
    idIdoso: 123,
    categoria: EMetricas.IMC,
  };

  const mockItemHidratacao: IMetrica = {
    id: 1,
    idIdoso: 123,
    categoria: EMetricas.HIDRATACAO,
  };

  it('renderiza corretamente com um valor de métrica FREQ_CARDIACA', async () => {
    const { getByText } = render(<CardMetrica item={mockItemFrequencia} />);
    
    await waitFor(() => {
      expect(getByText('80')).toBeTruthy(); 
      expect(getByText('bpm')).toBeTruthy(); 
    });
  },
  10000);

  it('renderiza corretamente com um valor de métrica GLICEMIA', async () => {
    const { getByText } = render(<CardMetrica item={mockItemGlicemia} />);
    
    await waitFor(() => {
      expect(getByText('80')).toBeTruthy(); 
      expect(getByText('mg/dL')).toBeTruthy(); 
    });
  });

  it('renderiza corretamente com um valor de métrica PESO', async () => {
    const { getByText } = render(<CardMetrica item={mockItemPeso} />);
    
    await waitFor(() => {
      expect(getByText('80')).toBeTruthy(); 
      expect(getByText('kg')).toBeTruthy(); 
    });
  });

  it('renderiza corretamente com um valor de métrica PRESSAO_SANGUINEA', async () => {
    const { getByText } = render(<CardMetrica item={mockItemPressao} />);
    
    await waitFor(() => {
      expect(getByText('80')).toBeTruthy(); 
      expect(getByText('mmHg')).toBeTruthy(); 
    });
  });

  it('renderiza corretamente com um valor de métrica SATURACAO_OXIGENIO', async () => {
    const { getByText } = render(<CardMetrica item={mockItemSaturacao} />);
    
    await waitFor(() => {
      expect(getByText('80')).toBeTruthy(); 
      expect(getByText('%')).toBeTruthy(); 
    });
  });

  it('renderiza corretamente com um valor de métrica TEMPERATURA', async () => {
    const { getByText } = render(<CardMetrica item={mockItemTemperatura} />);
    
    await waitFor(() => {
      expect(getByText('80')).toBeTruthy(); 
      expect(getByText('°C')).toBeTruthy(); 
    });
  });

  it('renderiza corretamente com um valor de métrica HORAS_DORMIDAS', async () => {
    const { getByText } = render(<CardMetrica item={mockItemHoras} />);
    
    await waitFor(() => {
      expect(getByText('80')).toBeTruthy(); 
      expect(getByText('h')).toBeTruthy(); 
    });
  });

  it('renderiza corretamente com um valor de métrica ALTURA', async () => {
    const { getByText } = render(<CardMetrica item={mockItemAltura} />);
    
    await waitFor(() => {
      expect(getByText('80')).toBeTruthy(); 
      expect(getByText('cm')).toBeTruthy(); 
    });
  });

  it('renderiza corretamente com um valor de métrica IMC', async () => {
    const { getByText } = render(<CardMetrica item={mockItemIMC} />);
    
    await waitFor(() => {
      expect(getByText('80')).toBeTruthy(); 
      expect(getByText('kg/m²')).toBeTruthy(); 
    });
  });

  it('renderiza corretamente com um valor de métrica HIDRATACAO', async () => {
    const { getByText } = render(<CardMetrica item={mockItemHidratacao} />);
    
    await waitFor(() => {
      expect(getByText('80')).toBeTruthy(); 
      expect(getByText('ml')).toBeTruthy(); 
    });
  });

  it('renderiza corretamente quando não há valor de métrica', async () => {
    // Simular o retorno vazio para não ter valores de métrica
    (database.get as jest.Mock).mockReturnValueOnce({
      query: jest.fn().mockReturnValue({
        fetch: jest.fn(() => Promise.resolve([])),
      }),
    });

    const { getByText } = render(<CardMetrica item={mockItemFrequencia} />);
    
    await waitFor(() => {
      expect(getByText('Nenhum valor cadastrado')).toBeTruthy();
    });
  });

  it('mostra a data e a hora corretas', async () => {
    const { getByText } = render(<CardMetrica item={mockItemFrequencia} />);

    await waitFor(() => {
      expect(getByText('18/09/2024 às 12:00')).toBeTruthy(); 
    });
  });

  it('loga um erro no console quando ocorre uma exceção', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    (database.get as jest.Mock).mockReturnValueOnce({
      query: jest.fn().mockReturnValue({
        fetch: jest.fn(() => Promise.reject(new Error('Erro de banco de dados'))),
      }),
    });

    render(<CardMetrica item={mockItemFrequencia} />);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith("Erro ao buscar valor de metrica:", expect.any(Error));
    });

    consoleLogSpy.mockRestore(); // Restaurar a implementação original
  });
});

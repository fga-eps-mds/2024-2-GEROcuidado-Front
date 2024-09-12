import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import FiltroDropdown from '../components/FiltroDropdown'; // ajuste o caminho conforme necessário

describe('FiltroDropdown Component', () => {
  it('should render the dropdown with default label', () => {
    render(<FiltroDropdown filtro={null} setFiltro={() => {}} />);
    expect(screen.getByText('Filtro')).toBeTruthy();
  });

  it('should display options when dropdown is clicked', () => {
    render(<FiltroDropdown filtro={null} setFiltro={() => {}} />);
    const dropdownButton = screen.getByText('Filtro');
    fireEvent.press(dropdownButton);

    expect(screen.getByText('Alimentação')).toBeTruthy();
    expect(screen.getByText('Exercícios')).toBeTruthy();
    expect(screen.getByText('Medicamentos')).toBeTruthy();
    expect(screen.getByText('Geral')).toBeTruthy();
  });


  it('should toggle dropdown visibility when dropdown button is clicked', () => {
    render(<FiltroDropdown filtro={null} setFiltro={() => {}} />);
    
    const dropdownButton = screen.getByText('Filtro');
    fireEvent.press(dropdownButton);
    
    expect(screen.getByText('Alimentação')).toBeTruthy();
    
    fireEvent.press(dropdownButton);
    
    expect(screen.queryByText('Alimentação')).toBeNull();
  });

  it('should show selected option when a filter is provided', () => {
    render(<FiltroDropdown filtro="Alimentação" setFiltro={() => {}} />);
    expect(screen.getByText('Alimentação')).toBeTruthy();
  });

});

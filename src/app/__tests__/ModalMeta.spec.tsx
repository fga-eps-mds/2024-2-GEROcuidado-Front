import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ModalMeta from '../components/ModalMeta'; 
import { EMetricas, IMetrica } from '../interfaces/metricas.interface';

describe('ModalMeta Component', () => {
    const mockCallbackFn = jest.fn();
    const mockCloseModal = jest.fn();
  
    const metrica: IMetrica = {
      id: 1,
      idIdoso: 1,
      categoria: EMetricas.HIDRATACAO,
      valorMaximo: '1000', 
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should render modal when visible prop is true', () => {
      render(
        <ModalMeta
          visible={true}
          callbackFn={mockCallbackFn}
          closeModal={mockCloseModal}
          metrica={metrica}
          message="Test message"
        />
      );
  
      expect(screen.getByText('Adicionar uma nova meta')).toBeTruthy();
    });
  
    it('should not render modal when visible prop is false', () => {
      render(
        <ModalMeta
          visible={false}
          callbackFn={mockCallbackFn}
          closeModal={mockCloseModal}
          metrica={metrica}
          message="Test message"
        />
      );
  
      expect(screen.queryByText('Adicionar uma nova meta')).toBeNull();
    });
  
    it('should show error message when input is empty and Save button is pressed', () => {
      render(
        <ModalMeta
          visible={true}
          callbackFn={mockCallbackFn}
          closeModal={mockCloseModal}
          metrica={metrica}
          message="Test message"
        />
      );
  
      fireEvent.press(screen.getByTestId('callbackBtn'));
  
      expect(screen.getByText('Campo obrigatório!')).toBeTruthy();
    });
  
    it('should show error message when input is invalid format and Save button is pressed', () => {
      render(
        <ModalMeta
          visible={true}
          callbackFn={mockCallbackFn}
          closeModal={mockCloseModal}
          metrica={metrica}
          message="Test message"
        />
      );
  
      fireEvent.changeText(screen.getByTestId('modal-input'), 'invalid');
      fireEvent.press(screen.getByTestId('callbackBtn'));
  
      expect(screen.getByText('Formato inválido!')).toBeTruthy();
    });
  
    it('should call callbackFn with input value when input is valid and Save button is pressed', () => {
      render(
        <ModalMeta
          visible={true}
          callbackFn={mockCallbackFn}
          closeModal={mockCloseModal}
          metrica={metrica}
          message="Test message"
        />
      );
  
      fireEvent.changeText(screen.getByTestId('modal-input'), '100');
      fireEvent.press(screen.getByTestId('callbackBtn'));
  
      expect(mockCallbackFn).toHaveBeenCalledWith('100');
    });
  
    it('should call closeModal when Cancel button is pressed', () => {
      render(
        <ModalMeta
          visible={true}
          callbackFn={mockCallbackFn}
          closeModal={mockCloseModal}
          metrica={metrica}
          message="Test message"
        />
      );
  
      fireEvent.press(screen.getByTestId('cancelarBtn'));
  
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

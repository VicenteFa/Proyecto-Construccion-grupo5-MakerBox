import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { ModalDetalles } from './ModalImpresion';
import type { IImpresion } from '../../constants/IImpresion';

// Simulamos una solicitud básica
const mockSolicitud = {
  idImpresion: 'req-001',
  solicitanteNombre: 'Juan',
  solicitanteApellido: 'Pérez',
  estado: 'PENDIENTE',
  observacionAyudante: '',
  tiempoEstimadoImpresion: '2 horas',
  nombreCurso: 'Diseño Industrial',
  urlModelo3d: '#',
  urlModeloStl: '#',
};

describe('Componente ModalDetalles', () => {
  it('debería llamar a onActualizar con los datos modificados al guardar', () => {
    // 1. Creamos funciones "espía" (mocks) para saber si el componente las llama
    const mockOnActualizar = vi.fn();
    const mockOnClose = vi.fn();

    // 2. Renderizamos el modal en el entorno de prueba
    render(
      <ModalDetalles
        isOpen={true}
        onClose={mockOnClose}
        data={mockSolicitud as unknown as IImpresion} // Usamos "as any" para evitar problemas de tipado en el test
        onActualizar={mockOnActualizar}
      />,
    );

    const selectEstado = screen.getByLabelText(/Actualizar Estado:/i);
    fireEvent.change(selectEstado, { target: { value: 'IMPRIMIENDO' } });

    const textareaObs = screen.getByLabelText(/Observación \/ Motivo:/i);
    fireEvent.change(textareaObs, { target: { value: 'Malla corregida y en proceso' } });

    const inputTiempo = screen.getByLabelText(/Tiempo Estimado:/i);
    fireEvent.change(inputTiempo, { target: { value: '3 horas' } });

    const botonGuardar = screen.getByText(/Guardar Cambios/i);
    fireEvent.click(botonGuardar);

    expect(mockOnActualizar).toHaveBeenCalledWith(
      'req-001',
      'IMPRIMIENDO',
      'Malla corregida y en proceso',
      '3 horas',
    );

    expect(mockOnClose).toHaveBeenCalled();
  });
});

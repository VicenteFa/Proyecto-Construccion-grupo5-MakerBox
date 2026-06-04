import { useState } from 'react';
import { useUsuarios } from '../features/usuarios/hooks/useUsuarios';

export const TestUsuarioPage = () => {
  const [id, setId] = useState('');
  const { usuario, loading, error, obtenerUsuario } = useUsuarios();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Buscar Usuario</h2>
      <input
        type="text"
        placeholder="Ingresa el ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{ marginRight: '8px', padding: '6px' }}
      />
      <button onClick={() => obtenerUsuario(id)}>Buscar</button>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {usuario && (
        <pre style={{ marginTop: '1rem', background: '#f4f4f4', padding: '1rem' }}>
          {JSON.stringify(usuario, null, 2)}
        </pre>
      )}
    </div>
  );
};

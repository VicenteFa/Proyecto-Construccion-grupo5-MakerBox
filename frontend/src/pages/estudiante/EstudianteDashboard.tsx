import { Link } from 'react-router-dom';

export const EstudianteDashboard = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Panel del Estudiante</h1>
      <p>Bienvenido a tu espacio en MakerBox. ¿Qué deseas hacer hoy?</p>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {/* Este botón lo llevará al formulario de impresión */}
        <Link
          to="/estudiante/nueva-impresion"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          Solicitar Nueva Impresión
        </Link>
        {/*ESPACIO RESERVADO PARA PODER AGREGAR MAS BOTONES O ALGUNOS ELEMENTOS VISUALES}
        <Link
          to="/estudiante/mis-cursos"
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          Ver Mis Cursos
        </Link>*/}{' '}
        {/* PARA EL FUTURO*/}
      </div>
    </div>
  );
};

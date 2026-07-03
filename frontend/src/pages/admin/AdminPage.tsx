import React from 'react';

const destinos_page = {
  'admin-estudiantes-button': '/admin/estudiantes',
  'admin-inventario-button': '/inventory/admin',
};

export const AdminPage = () => {
  // La función ahora recibe el evento del clic
  const handleRedirect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonId = e.currentTarget.id;

    // Buscamos la URL correspondiente en nuestro diccionario
    const url = destinos_page[buttonId as keyof typeof destinos_page];

    if (url) {
      window.location.href = url;
    } else {
      console.warn(`No se encontró una ruta para el ID: ${buttonId}`);
    }
  };
  return (
    <div style={styles.container}>
      <h1>Bienvenido Ayudante:</h1>

      <button id="admin-estudiantes-button" style={styles.button} onClick={handleRedirect}>
        Admin Estudiantes
      </button>

      <button id="admin-inventario-button" style={styles.button} onClick={handleRedirect}>
        Admin Inventario
      </button>
    </div>
  );
};

// Estilos básicos en línea para la presentación
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '15px',
    marginTop: '50px',
    fontFamily: 'sans-serif',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    width: '200px',
    transition: 'background-color 0.3s',
  },
};

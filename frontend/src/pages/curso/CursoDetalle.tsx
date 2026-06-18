import { useParams } from 'react-router-dom';
import { CargarEstudiantesCsv } from '../estudiante/CargarEstudiante';

export const CursoDetallePage = () => {
  const { idCurso } = useParams<{ idCurso: string }>();

  if (!idCurso) {
    return (
      <div className="p-6 text-red-500">Error: No se encontró el identificador del curso.</div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Gestión del Curso</h1>
      <p className="text-gray-600 mb-6">ID del curso actual: {idCurso}</p>

      {/* Aquí inyectamos el componente */}
      <CargarEstudiantesCsv idCurso={idCurso} />
    </div>
  );
};

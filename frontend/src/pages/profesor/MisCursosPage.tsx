import { useEffect, useState } from 'react';
import { Card, List, message, Tag, Popconfirm, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Curso {
  idCurso: string;
  nombre: string;
  refSemestre: string;
  creadoEn?: string;
}

export const MisCursosPage = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) return;

    axios
      .get('http://localhost:3000/api/cursos/mis-cursos', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCursos(res.data))
      .catch((error) => {
        console.error('Error al obtener cursos:', error);
        if (error.response?.status !== 401) {
          message.error('No se pudieron cargar los cursos.');
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleEliminarCurso = async (idCurso: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/cursos/${idCurso}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCursos((cursosActuales) => cursosActuales.filter((c) => c.idCurso !== idCurso));
      message.success('Curso eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      message.error('No se pudo eliminar el curso. Verifique si tiene dependencias activas.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mis Cursos Asignados</h1>
          <p className="text-gray-500 text-sm mt-1">
            Visualiza y gestiona las asignaturas en las que figuras como profesor titular.
          </p>
        </div>
      </div>

      <List
        loading={loading}
        dataSource={cursos}
        locale={{ emptyText: 'Actualmente no registras cursos asignados para este periodo.' }}
        renderItem={(curso) => (
          <Card
            key={curso.idCurso}
            className="mb-4 cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-blue-600 hover:border-l-blue-700"
            onClick={() => navigate(`/profesor/cursos/${curso.idCurso}`)}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-bold text-xl text-gray-800 hover:text-blue-600 transition-colors">
                  {curso.nombre}
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-mono">Código ID: {curso.idCurso}</p>
              </div>

              {/* Contenedor de acciones a la derecha */}
              <div className="flex items-center gap-4 ml-auto sm:ml-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Periodo:
                  </span>
                  <Tag color="blue" className="px-3 py-0.5 font-semibold text-sm rounded-md">
                    {curso.refSemestre}
                  </Tag>
                </div>

                {/* Botón de eliminación protegido con Popconfirm */}
                <div onClick={(e) => e.stopPropagation()}>
                  <Popconfirm
                    title="¿Estás seguro de eliminar este curso?"
                    description="Esta acción borrará el curso permanentemente del sistema."
                    onConfirm={() => handleEliminarCurso(curso.idCurso)}
                    okText="Sí, borrar"
                    cancelText="No, cancelar"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="text" danger size="small" className="font-medium">
                      Eliminar
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </Card>
        )}
      />
    </div>
  );
};

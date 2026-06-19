import { useEffect, useState } from 'react';
import { Button, Card, List, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/auth.store';

interface Curso {
  idCurso: string;
  nombre: string;
  refSemestre: string;
}

export const ProfesorDashboard = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    // Evitar peticiones si no hay token
    if (!token) return;

    axios
      .get('http://localhost:3000/api/cursos/mis-cursos', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCursos(res.data))
      .catch((error) => {
        // Solo mostramos el error si NO es un error de autorizacion
        if (error.response?.status !== 401) {
          message.error('Error al cargar los cursos');
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Cursos</h1>
        <Button type="primary" onClick={() => navigate('/profesor/nuevo-curso')}>
          + Crear Curso
        </Button>
      </div>

      <List
        loading={loading}
        dataSource={cursos}
        locale={{ emptyText: 'No tienes cursos aún' }}
        renderItem={(curso) => (
          <Card
            key={curso.idCurso}
            className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/profesor/cursos/${curso.idCurso}`)}
          >
            <p className="font-semibold text-lg">{curso.nombre}</p>
            <p className="text-gray-500 text-sm">Semestre: {curso.refSemestre}</p>
          </Card>
        )}
      />
    </div>
  );
};

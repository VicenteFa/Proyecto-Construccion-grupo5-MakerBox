import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const CrearCurso = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);

  const onFinish = async (values: { nombre: string; refSemestre: string }) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/cursos', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Curso creado exitosamente');
      form.resetFields();
      navigate(ROUTES.PROFESOR.path);
    } catch (error: unknown) {
      console.error(error);
      message.error('Error al crear el curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Curso</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nombre del Curso"
          name="nombre"
          rules={[{ required: true, message: 'El nombre es obligatorio' }]}
        >
          <Input placeholder="Ej. Arquitectura de Software" />
        </Form.Item>

        <Form.Item
          label="ID del Semestre"
          name="refSemestre"
          rules={[{ required: true, message: 'El semestre es obligatorio' }]}
        >
          <Input placeholder="UUID del semestre" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Crear Curso
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

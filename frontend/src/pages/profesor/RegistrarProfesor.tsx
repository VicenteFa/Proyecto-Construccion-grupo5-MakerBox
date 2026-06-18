import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useState } from 'react';

export const RegistrarProfesor = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Axios lanza un error automáticamente si el status no es 2xx
      await axios.post('http://localhost:3000/api/auth/registrar/profesor', values);
      message.success('Profesor registrado exitosamente');
      form.resetFields(); // Limpia el formulario
    } catch (error) {
      message.error('Error al registrar al profesor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border">
      <h2 className="text-2xl font-bold mb-6 text-center">Nuevo Profesor</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="RUT" name="rut" rules={[{ required: true, message: 'Ingresa el RUT' }]}>
          <Input placeholder="Ej: 12345678" />
        </Form.Item>

        <Form.Item
          label="Nombre"
          name="nombre"
          rules={[{ required: true, message: 'Ingresa el nombre' }]}
        >
          <Input placeholder="Nombre" />
        </Form.Item>

        <Form.Item
          label="Apellido"
          name="apellido"
          rules={[{ required: true, message: 'Ingresa el apellido' }]}
        >
          <Input placeholder="Apellido" />
        </Form.Item>

        <Form.Item
          label="Correo"
          name="correo"
          rules={[{ required: true, type: 'email', message: 'Correo inválido' }]}
        >
          <Input placeholder="correo@utalca.cl" />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="passUsuario"
          rules={[{ required: true, message: 'Ingresa una contraseña' }]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Registrar Profesor
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

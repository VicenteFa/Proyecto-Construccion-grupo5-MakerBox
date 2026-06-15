import { Form, Input, Button, Typography, Card, Alert, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../features/auth/hooks/useAuth';
import type { SubmitHandler } from 'react-hook-form';

const { Title } = Typography;

interface LoginFormInputs {
  correo: string;
  passUsuario: string;
}

const cardStyles = { width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const titleStyles = { textAlign: 'center', marginBottom: 24 } as const;

// Componente de la pagina de login
export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  // Se obtiene la funcion de login, el estado de carga y el error del hook de autenticacion
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const ok = await login(data.correo, data.passUsuario);
    if (ok) {
      message.success('¡Bienvenido! Has iniciado sesión exitosamente.');
      setTimeout(() => navigate(ROUTES.HOME.path), 1000); // redirige al home, no al admin
    }
  };

  return (
    <Card style={cardStyles}>
      <Title level={3} style={titleStyles}>
        Login
      </Title>

      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Email"
          validateStatus={errors.correo ? 'error' : ''}
          help={errors.correo?.message}
        >
          <Controller
            name="correo"
            control={control}
            rules={{ required: 'Se requiere Email' }}
            render={({ field }) => <Input {...field} placeholder="Email" />}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={errors.passUsuario ? 'error' : ''}
          help={errors.passUsuario?.message}
        >
          <Controller
            name="passUsuario"
            control={control}
            rules={{
              required: 'Se requiere Contraseña',
              minLength: { value: 6, message: 'Se requiere minimo 6 caracteres' },
            }}
            render={({ field }) => <Input.Password {...field} placeholder="Password" />}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

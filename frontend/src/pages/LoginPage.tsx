import { Form, Input, Button, Typography, Card, Alert, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../features/auth/hooks/useAuth';
import type { SubmitHandler } from 'react-hook-form';

const { Title } = Typography;

interface LoginFormInputs {
  correo: string;
  passUsuario: string;
}

interface JwtPayload {
  id: string;
  correo: string;
  rol: string;
}

const getRutaByRol = (rol: string): string => {
  switch (rol) {
    case 'AYUDANTE':
      return ROUTES.AYUDANTE.path;
    case 'PROFESOR':
      return ROUTES.PROFESOR.path;
    case 'ESTUDIANTE':
      return ROUTES.ESTUDIANTE.path;
    default:
      return ROUTES.HOME.path;
  }
};

const cardStyles = { width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const titleStyles = { textAlign: 'center', marginBottom: 24 } as const;

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const ok = await login(data.correo, data.passUsuario);
    if (ok) {
      message.success('¡Bienvenido! Has iniciado sesión exitosamente.');
      const token = localStorage.getItem('token');
      if (token) {
        const payload = jwtDecode<JwtPayload>(token);
        setTimeout(() => navigate(getRutaByRol(payload.rol)), 1000);
      }
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
              minLength: { value: 6, message: 'Se requiere mínimo 6 caracteres' },
            }}
            render={({ field }) => <Input.Password {...field} placeholder="Password" />}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          ¿No tienes cuenta?{' '}
          <Link to={ROUTES.SIGN_UP.path} style={{ color: '#1677ff' }}>
            Regístrate aquí
          </Link>
        </div>
      </Form>
    </Card>
  );
};

import { Form, Input, Button, Typography, Card, Alert, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../features/auth/hooks/useAuth';
import type { SubmitHandler } from 'react-hook-form';

const { Title } = Typography;

interface SignUpFormInputs {
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  passUsuario: string;
}

const cardStyles = { width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const titleStyles = { textAlign: 'center', marginBottom: 24 } as const;

export const SignUpPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>();
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    const ok = await register(data);
    if (ok) {
      message.success('¡Cuenta creada exitosamente!');
      setTimeout(() => navigate(ROUTES.LOGIN.path), 200); // espera 0.2s antes de redirigir
    }
  };

  return (
    <Card style={cardStyles}>
      <Title level={3} style={titleStyles}>
        Sign Up
      </Title>

      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="RUT"
          validateStatus={errors.rut ? 'error' : ''}
          help={errors.rut?.message}
        >
          <Controller
            name="rut"
            control={control}
            rules={{ required: 'RUT requerido' }}
            render={({ field }) => <Input {...field} placeholder="12345678-9" />}
          />
        </Form.Item>

        <Form.Item
          label="Nombre"
          validateStatus={errors.nombre ? 'error' : ''}
          help={errors.nombre?.message}
        >
          <Controller
            name="nombre"
            control={control}
            rules={{ required: 'Nombre requerido' }}
            render={({ field }) => <Input {...field} placeholder="Nombre" />}
          />
        </Form.Item>

        <Form.Item
          label="Apellido"
          validateStatus={errors.apellido ? 'error' : ''}
          help={errors.apellido?.message}
        >
          <Controller
            name="apellido"
            control={control}
            rules={{ required: 'Apellido requerido' }}
            render={({ field }) => <Input {...field} placeholder="Apellido" />}
          />
        </Form.Item>

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
            Sign Up
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          ¿Ya tienes cuenta?{' '}
          <Link to={ROUTES.LOGIN.path} style={{ color: '#1677ff' }}>
            Inicia sesión
          </Link>
        </div>
      </Form>
    </Card>
  );
};

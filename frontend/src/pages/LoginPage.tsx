import { Form, Input, Button, Typography, Card } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../shared/hooks/useAuth';
import type { SubmitHandler } from 'react-hook-form';

const { Title } = Typography;

interface LoginFormInputs {
  email: string;
  password: string;
}

const cardStyles = { width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const titleStyles = { textAlign: 'center', marginBottom: 24 } as const;

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const { login } = useAuth();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    console.log('Data', data);

    login();
    navigate(ROUTES.ADMIN.path);
  };

  return (
    <Card style={cardStyles}>
      <Title level={3} style={titleStyles}>
        Login
      </Title>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email is required' }}
            render={({ field }) => <Input {...field} placeholder="Email" />}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password required',
              minLength: { value: 6, message: 'Too short!' },
            }}
            render={({ field }) => <Input.Password {...field} placeholder="Password" />}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

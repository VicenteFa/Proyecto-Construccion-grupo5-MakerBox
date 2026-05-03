import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

interface LoginFormInputs {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  // 3. Typed onSubmit handler
  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    console.log('Typed Library Data:', data);
    // data.email and data.password are strictly strings here
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      <h2>Login (MakerBox)</h2>

      <input {...register('email', { required: 'Email is required' })} placeholder="Email" />
      {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}

      <input
        type="password"
        {...register('password', {
          required: 'Password required',
          minLength: { value: 6, message: 'Too short!' },
        })}
        placeholder="Password"
      />
      {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
};

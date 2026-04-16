import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginForm } from './LoginForm';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const { state, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (data: LoginFormData) => {
    try {
      const success = await login(data.username, data.password);
      if (success) {
        navigate('/');
      } else {
        setFormError('username', {
          type: 'manual',
          message: state.error || 'Invalid username or password',
        });
      }
    } catch (error) {
      setFormError('username', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Login failed',
      });
    }
  });

  return (
    <LoginForm
      register={register}
      errors={errors}
      isLoading={state.isLoading}
      onSubmit={onSubmit}
    />
  );
}

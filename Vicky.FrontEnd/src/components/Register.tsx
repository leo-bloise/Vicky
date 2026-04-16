import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterForm } from './RegisterForm';

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export function Register() {
  const { state, register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (data: RegisterFormData) => {
    try {
      const result = await registerUser(data.username, data.password);
      if (result.success) {
        navigate('/login');
      } else {
        setFormError('username', {
          type: 'manual',
          message: result.error || state.error || 'Registration failed',
        });
      }
    } catch (error) {
      setFormError('username', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  });

  return (
    <RegisterForm
      register={register}
      errors={errors}
      isLoading={state.isLoading}
      onSubmit={onSubmit}
    />
  );
}

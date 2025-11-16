import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.accessToken, response.refreshToken);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-darkgray mb-4">Sign in</h1>
          <p className="text-mediumgray">
            New to RemindMe ?{' '}
            <Link to="/register" className="text-darkgray font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-6 py-4 bg-taupe border-none text-darkgray placeholder-mediumgray rounded-full focus:outline-none focus:ring-2 focus:ring-darkgray"
              placeholder="Email adress or username *"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 px-4">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full px-6 py-4 bg-taupe border-none text-darkgray placeholder-mediumgray rounded-full focus:outline-none focus:ring-2 focus:ring-darkgray"
              placeholder="Password *"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 px-4">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-taupe text-darkgray font-semibold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity mt-6"
          >
            {isLoading ? 'Connexion...' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  );
}


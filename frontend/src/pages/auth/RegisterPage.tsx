import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      const response = await authService.register(registerData);
      setAuth(response.user, response.accessToken, response.refreshToken);
      toast.success('Inscription réussie ! Bienvenue');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-darkgray mb-4">Sign up</h1>
          <p className="text-sm text-mediumgray mb-2">Create your account</p>
          <p className="text-mediumgray">
            Already have an account ?{' '}
            <Link to="/login" className="text-darkgray font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                id="firstName"
                type="text"
                {...register('firstName')}
                className="w-full px-6 py-4 bg-taupe border-none text-darkgray placeholder-mediumgray rounded-full focus:outline-none focus:ring-2 focus:ring-darkgray"
                placeholder="Prénom"
              />
            </div>
            <div>
              <input
                id="lastName"
                type="text"
                {...register('lastName')}
                className="w-full px-6 py-4 bg-taupe border-none text-darkgray placeholder-mediumgray rounded-full focus:outline-none focus:ring-2 focus:ring-darkgray"
                placeholder="Nom"
              />
            </div>
          </div>

          <div>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-6 py-4 bg-taupe border-none text-darkgray placeholder-mediumgray rounded-full focus:outline-none focus:ring-2 focus:ring-darkgray"
              placeholder="Email Address *"
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

          <div>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="w-full px-6 py-4 bg-taupe border-none text-darkgray placeholder-mediumgray rounded-full focus:outline-none focus:ring-2 focus:ring-darkgray"
              placeholder="Confirm Your Password *"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 px-4">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-taupe text-darkgray font-semibold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity mt-6"
          >
            {isLoading ? 'Inscription...' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  );
}


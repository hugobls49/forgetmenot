import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { usersService, UserSettings } from '../services/usersService';
import { useAuthStore } from '../store/authStore';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['user-settings'],
    queryFn: usersService.getSettings,
  });

  const { register: registerProfile, handleSubmit: handleProfileSubmit } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  const { register: registerSettings, handleSubmit: handleSettingsSubmit } = useForm<Partial<UserSettings>>({
    values: settings || {},
  });

  const updateProfileMutation = useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: (data) => {
      updateUser(data);
      toast.success('Profil mis à jour');
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: usersService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast.success('Paramètres mis à jour');
    },
  });

  const onProfileSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  const onSettingsSubmit = (data: Partial<UserSettings>) => {
    updateSettingsMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-darkgray mb-8">Paramètres</h1>

      {/* Profil */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Informations du profil
        </h2>
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="input-field bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                {...registerProfile('firstName')}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                {...registerProfile('lastName')}
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="btn-primary"
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>

      {/* Paramètres de notification */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Notifications
        </h2>
        <form onSubmit={handleSettingsSubmit(onSettingsSubmit)} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Notifications par email
              </label>
              <p className="text-sm text-gray-500">
                Recevoir des rappels quotidiens par email
              </p>
            </div>
            <input
              type="checkbox"
              {...registerSettings('emailNotifications')}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heure du rappel quotidien
            </label>
            <input
              type="time"
              {...registerSettings('dailyReminderTime')}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objectif hebdomadaire (nombre de cartes)
            </label>
            <input
              type="number"
              {...registerSettings('weeklyGoal')}
              className="input-field"
              min="1"
              max="500"
            />
          </div>

          <button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="btn-primary"
          >
            Enregistrer les paramètres
          </button>
        </form>
      </div>

      {/* Zone de danger */}
      <div className="card border-2 border-red-200">
        <h2 className="text-xl font-semibold text-red-900 mb-4">
          Zone de danger
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
        </p>
        <button
          onClick={() => {
            if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
              usersService.deleteAccount().then(() => {
                toast.success('Compte supprimé');
                useAuthStore.getState().logout();
              });
            }
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}


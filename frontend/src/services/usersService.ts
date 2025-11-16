import api from '../lib/api';

export interface UserSettings {
  emailNotifications: boolean;
  dailyReminderTime: string;
  weeklyGoal: number;
  theme: string;
  language: string;
  timezone: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
}

export const usersService = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: UpdateUserData) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get('/users/settings');
    return response.data;
  },

  updateSettings: async (data: Partial<UserSettings>) => {
    const response = await api.put('/users/settings', data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/me');
    return response.data;
  },
};


import { api } from './api';
import { UserSettings, AppSettings } from '../types/setting';

// Get User Settings
export const getUserSettings = async (): Promise<UserSettings> => {
  try {
    const response = await api.get('/settings/user_settings');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user settings', error);
    throw error;
  }
};

// Update User Settings
export const updateUserSettings = async (settings: UserSettings): Promise<void> => {
  try {
    await api.put('/settings/user_settings', settings);
  } catch (error) {
    console.error('Failed to update user settings', error);
    throw error;
  }
};

// Get System Settings
export const getSystemSettings = async (): Promise<AppSettings> => {
  try {
    const response = await api.get('/settings/app_settings');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch system settings', error);
    throw error;
  }
};

// Update System Settings
export const updateSystemSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await api.put('/settings/app_settings', settings);
  } catch (error) {
    console.error('Failed to update system settings', error);
    throw error;
  }
};

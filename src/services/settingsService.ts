import { apiFetch } from './api';
import { User, AppNotification } from '../types';
import { MOCK_USERS, INITIAL_NOTIFICATIONS } from '../data/mockData';

export const settingsService = {
  async getUsers(): Promise<User[]> {
    try {
      return await apiFetch<User[]>('/api/settings/users');
    } catch (err) {
      console.warn('[settingsService] Failed to load users:', err);
      return MOCK_USERS;
    }
  },

  async getSettings(): Promise<Record<string, string>> {
    try {
      return await apiFetch<Record<string, string>>('/api/settings');
    } catch (err) {
      console.warn('[settingsService] Failed to load settings:', err);
      return { confidenceThreshold: '80', preferredCompute: 'NPU' };
    }
  },

  async saveSettings(settings: { confidenceThreshold?: number; preferredCompute?: string }): Promise<void> {
    try {
      await apiFetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify(settings)
      });
    } catch (err) {
      console.warn('[settingsService] Failed to save settings:', err);
    }
  },

  async resetDatabase(): Promise<void> {
    try {
      await apiFetch('/api/settings/reset', {
        method: 'POST'
      });
    } catch (err) {
      console.warn('[settingsService] Failed to reset database on API:', err);
    }
  },

  async getNotifications(): Promise<AppNotification[]> {
    try {
      return await apiFetch<AppNotification[]>('/api/settings/notifications');
    } catch (err) {
      console.warn('[settingsService] Failed to load notifications:', err);
      return INITIAL_NOTIFICATIONS;
    }
  },

  async markNotificationRead(id: string): Promise<void> {
    try {
      await apiFetch(`/api/settings/notifications/${id}/read`, {
        method: 'PATCH'
      });
    } catch (err) {
      console.warn(`[settingsService] Failed to mark notification ${id} as read:`, err);
    }
  },

  async clearNotifications(): Promise<void> {
    try {
      await apiFetch('/api/settings/notifications', {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('[settingsService] Failed to clear notifications:', err);
    }
  }
};

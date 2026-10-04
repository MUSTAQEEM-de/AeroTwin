import { apiFetch } from './api';
import { Aircraft, ComponentSummary } from '../types';
import { MOCK_AIRCRAFT, PRIMARY_COMPONENT } from '../data/mockData';

export const aircraftService = {
  async getAircraft(): Promise<Aircraft> {
    try {
      return await apiFetch<Aircraft>('/api/aircraft');
    } catch (err) {
      console.warn('[aircraftService] Failed to fetch aircraft from API, using fallback:', err);
      return MOCK_AIRCRAFT;
    }
  },

  async getComponent(id: string): Promise<ComponentSummary> {
    try {
      return await apiFetch<ComponentSummary>(`/api/aircraft/components/${id}`);
    } catch (err) {
      console.warn(`[aircraftService] Failed to fetch component ${id} from API, using fallback:`, err);
      return PRIMARY_COMPONENT;
    }
  },

  async updateComponent(id: string, updates: Partial<ComponentSummary>): Promise<ComponentSummary> {
    try {
      return await apiFetch<ComponentSummary>(`/api/aircraft/components/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.warn(`[aircraftService] Failed to update component ${id} on API:`, err);
      return { ...PRIMARY_COMPONENT, ...updates };
    }
  }
};

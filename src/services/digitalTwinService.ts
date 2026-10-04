import { apiFetch } from './api';
import { DigitalTwinState, RiskLevel } from '../types';
import { INITIAL_DIGITAL_TWIN } from '../data/mockData';

export const digitalTwinService = {
  async getTwinState(componentId: string = 'TB-007'): Promise<DigitalTwinState> {
    try {
      return await apiFetch<DigitalTwinState>(`/api/digital-twin/${componentId}`);
    } catch (err) {
      console.warn(`[digitalTwinService] Failed to fetch digital twin for ${componentId}:`, err);
      return INITIAL_DIGITAL_TWIN;
    }
  },

  async updateTwinState(
    componentId: string = 'TB-007',
    updates: {
      healthScore?: number;
      risk?: RiskLevel;
      status?: string;
      stressPoints?: any[];
      historyTimeline?: any[];
    }
  ): Promise<DigitalTwinState> {
    try {
      return await apiFetch<DigitalTwinState>(`/api/digital-twin/${componentId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.warn(`[digitalTwinService] Failed to update digital twin for ${componentId}:`, err);
      return INITIAL_DIGITAL_TWIN;
    }
  }
};

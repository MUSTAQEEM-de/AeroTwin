import { apiFetch } from './api';
import { MaintenanceRecommendation } from '../types';
import { INITIAL_RECOMMENDATION } from '../data/mockData';

export const recommendationService = {
  async getLatestRecommendation(): Promise<MaintenanceRecommendation> {
    try {
      return await apiFetch<MaintenanceRecommendation>('/api/recommendations/latest');
    } catch (err) {
      console.warn('[recommendationService] Failed to fetch latest recommendation:', err);
      return INITIAL_RECOMMENDATION;
    }
  },

  async recordDecision(
    recId: string,
    decision: 'ACCEPTED' | 'OVERRIDDEN' | 'REVIEW_REQUESTED',
    details: { reason?: string; notes?: string; technician: string },
    isOffline?: boolean
  ): Promise<MaintenanceRecommendation> {
    try {
      return await apiFetch<MaintenanceRecommendation>(`/api/recommendations/${recId}/decision`, {
        method: 'POST',
        body: JSON.stringify({ decision, details, isOffline })
      });
    } catch (err) {
      console.warn(`[recommendationService] Failed to record decision for ${recId}:`, err);
      return {
        ...INITIAL_RECOMMENDATION,
        id: recId,
        decisionState: decision,
        decisionDetails: {
          action: decision,
          reason: details.reason,
          notes: details.notes,
          technician: details.technician,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
        }
      };
    }
  }
};

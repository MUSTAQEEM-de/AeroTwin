import { MaintenanceRecommendation } from '../types';
import { INITIAL_RECOMMENDATION } from '../data/mockData';

export const mockRecommendationService = {
  getLatestRecommendation(): MaintenanceRecommendation {
    return JSON.parse(JSON.stringify(INITIAL_RECOMMENDATION));
  },

  async recordDecision(
    recId: string,
    decision: 'ACCEPTED' | 'OVERRIDDEN' | 'REVIEW_REQUESTED',
    details: { reason?: string; notes?: string; technician: string }
  ): Promise<MaintenanceRecommendation> {
    await new Promise((resolve) => setTimeout(resolve, 300));
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
};

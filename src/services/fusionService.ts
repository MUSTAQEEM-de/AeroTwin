import { apiFetch } from './api';
import { EvidenceScenario, FusionAnalysis } from '../types';
import { FUSION_SCENARIOS } from '../data/mockData';

export const fusionService = {
  async getAnalysisForScenario(scenario: EvidenceScenario): Promise<FusionAnalysis> {
    try {
      return await apiFetch<FusionAnalysis>(`/api/fusion?scenario=${scenario}`);
    } catch (err) {
      console.warn(`[fusionService] Failed to fetch fusion for scenario ${scenario}:`, err);
      return FUSION_SCENARIOS[scenario] || FUSION_SCENARIOS.MULTI_SOURCE;
    }
  },

  async runCorrelatedFusion(
    scenario: EvidenceScenario,
    customParams?: {
      visualConfidence?: number;
      defectSizeMm?: number;
      vibrationMmS?: number;
      temperatureC?: number;
      flightCycles?: number;
      operatingHours?: number;
    }
  ): Promise<FusionAnalysis> {
    try {
      return await apiFetch<FusionAnalysis>('/api/fusion/calculate', {
        method: 'POST',
        body: JSON.stringify({ scenario, customParams })
      });
    } catch (err) {
      console.warn('[fusionService] Failed to calculate correlated fusion:', err);
      return FUSION_SCENARIOS[scenario] || FUSION_SCENARIOS.MULTI_SOURCE;
    }
  }
};

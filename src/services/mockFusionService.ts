import { EvidenceScenario, FusionAnalysis } from '../types';
import { FUSION_SCENARIOS } from '../data/mockData';

export const mockFusionService = {
  getAnalysisForScenario(scenario: EvidenceScenario): FusionAnalysis {
    return FUSION_SCENARIOS[scenario] || FUSION_SCENARIOS.MULTI_SOURCE;
  },

  async runCorrelatedFusion(scenario: EvidenceScenario): Promise<FusionAnalysis> {
    // Simulates multi-source evidence fusion inference (~600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));
    return FUSION_SCENARIOS[scenario];
  }
};

import { DigitalTwinState, RiskLevel } from '../types';
import { INITIAL_DIGITAL_TWIN } from '../data/mockData';

export const mockDigitalTwinService = {
  getTwinState(healthScore: number, risk: RiskLevel): DigitalTwinState {
    const isHighRisk = healthScore < 75;
    return {
      ...INITIAL_DIGITAL_TWIN,
      healthScore,
      risk,
      status: isHighRisk ? 'ATTENTION REQUIRED' : 'NORMAL',
      stressPoints: isHighRisk
        ? INITIAL_DIGITAL_TWIN.stressPoints
        : INITIAL_DIGITAL_TWIN.stressPoints.map((sp) => ({
            ...sp,
            intensity: 'low' as const,
            label: sp.label.replace('4.2 mm crack', 'Nominal surface')
          }))
    };
  }
};

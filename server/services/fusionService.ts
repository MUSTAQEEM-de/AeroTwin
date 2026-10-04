import { EvidenceScenario, FusionAnalysis, RiskLevel } from '../../src/types';
import { FUSION_SCENARIOS } from '../../src/data/mockData';

export class FusionService {
  public calculateFusion(scenario: EvidenceScenario, customParams?: {
    visualConfidence?: number;
    defectSizeMm?: number;
    vibrationMmS?: number;
    temperatureC?: number;
    flightCycles?: number;
    operatingHours?: number;
  }): FusionAnalysis {
    if (!customParams && FUSION_SCENARIOS[scenario]) {
      return FUSION_SCENARIOS[scenario];
    }

    const vib = customParams?.vibrationMmS ?? (scenario === 'NORMAL' || scenario === 'VISUAL_ONLY' ? 4.1 : 7.4);
    const temp = customParams?.temperatureC ?? (scenario === 'NORMAL' || scenario === 'VISUAL_ONLY' ? 68 : 82);
    const conf = customParams?.visualConfidence ?? (scenario === 'NORMAL' || scenario === 'SENSOR_ONLY' ? 0.98 : 0.94);
    const defectSize = customParams?.defectSizeMm ?? (scenario === 'NORMAL' || scenario === 'SENSOR_ONLY' ? 0 : 4.2);
    const cycles = customParams?.flightCycles ?? 2941;
    const hours = customParams?.operatingHours ?? 3842;

    const isVisualCritical = defectSize > 3.0;
    const isSensorCritical = vib > 6.0 || temp > 80;

    let overallRisk: RiskLevel = 'LOW';
    let healthScore = 91;
    let rulMin = 450;
    let rulMax = 600;

    if (isVisualCritical && isSensorCritical) {
      overallRisk = 'HIGH';
      healthScore = 68;
      rulMin = 72;
      rulMax = 110;
    } else if (isVisualCritical && !isSensorCritical) {
      overallRisk = 'MEDIUM';
      healthScore = 78;
      rulMin = 180;
      rulMax = 260;
    } else if (!isVisualCritical && isSensorCritical) {
      overallRisk = 'HIGH';
      healthScore = 71;
      rulMin = 50;
      rulMax = 90;
    }

    const explanationPoints: string[] = [];
    if (isVisualCritical) {
      explanationPoints.push(`Structural crack detected on leading edge (${Math.round(conf * 100)}% model confidence)`);
    } else {
      explanationPoints.push('Visual examination clear of macro-structural flaws');
    }

    if (isSensorCritical) {
      const dev = Math.round(((vib - 4.1) / 4.1) * 1000) / 10;
      explanationPoints.push(`Vibration is ${dev}% above baseline (${vib.toFixed(1)} mm/s vs 4.1 mm/s)`);
      explanationPoints.push(`Temperature trend is increasing (${temp}°C vs 68°C baseline)`);
    } else {
      explanationPoints.push('Sensor vibration and thermal channels are stable and within spec');
    }

    explanationPoints.push(`Component operating exposure: ${cycles.toLocaleString()} cycles, ${hours.toLocaleString()} hrs`);
    if (isVisualCritical && isSensorCritical) {
      explanationPoints.push('Multiple independent evidence sources corroborate accelerated degradation');
    }

    return {
      scenario,
      visualEvidence: {
        level: isVisualCritical ? 'HIGH' : 'LOW',
        summary: isVisualCritical
          ? `Structural crack detected (${defectSize} mm) with micro-branching on leading edge`
          : 'Surface integrity intact, no anomalies detected',
        confidence: conf,
        findings: isVisualCritical
          ? [`AeroTwin-YOLO detected ${defectSize} mm fissure`, 'Leading edge stress zone', `Confidence: ${Math.round(conf * 100)}%`]
          : ['Thermal barrier uniform', 'No fissures or spallation']
      },
      sensorEvidence: {
        level: isSensorCritical ? 'HIGH' : 'LOW',
        summary: isSensorCritical
          ? `Vibration anomaly (${vib.toFixed(1)} mm/s) & thermal escalation (${temp}°C)`
          : 'All telemetry channels within calibrated baseline',
        findings: isSensorCritical
          ? [`Vibration: ${vib.toFixed(1)} mm/s vs 4.1 baseline`, `Temperature: ${temp}°C trending upward`, 'Harmonic drift detected']
          : ['Vibration 4.1 mm/s (Nominal)', 'Temperature 68°C (Nominal)', 'RPM 8,420 (Nominal)']
      },
      historicalContext: {
        level: cycles > 2500 ? 'MEDIUM' : 'LOW',
        summary: `${cycles.toLocaleString()} flight cycles & ${hours.toLocaleString()} operating hours evaluate thermal fatigue exposure`,
        flightCycles: cycles,
        operatingHours: hours,
        findings: ['Within scheduled mid-life overhaul envelope', 'Baseline calibration verified']
      },
      overallRisk,
      healthScore,
      fusionConfidence: 0.82,
      explanationPoints,
      pocWeights: {
        visual: isVisualCritical ? 35 : 20,
        sensor: isSensorCritical ? 35 : 20,
        historical: 20,
        recentInspection: 25
      },
      rulWindow: {
        minHours: rulMin,
        maxHours: rulMax,
        confidence: 0.82,
        risk: overallRisk,
        note: 'POC MODEL OUTPUT: Not a certified aerospace RUL measurement. Cross-correlated evidence estimate.'
      }
    };
  }
}

export const fusionService = new FusionService();

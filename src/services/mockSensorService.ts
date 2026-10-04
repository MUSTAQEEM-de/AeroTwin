import { SensorAnalyticsData } from '../types';
import { INITIAL_SENSOR_DATA } from '../data/mockData';

export const mockSensorService = {
  getBaselineReadings(): SensorAnalyticsData {
    return {
      isSimulating: false,
      vibration: {
        baseline: 4.1,
        current: 4.1,
        deviationPercent: 0,
        status: 'NORMAL',
        unit: 'mm/s',
        history: [
          { time: '14:20', value: 4.1, baseline: 4.1 },
          { time: '14:22', value: 4.1, baseline: 4.1 },
          { time: '14:24', value: 4.1, baseline: 4.1 },
          { time: '14:26', value: 4.2, baseline: 4.1 },
          { time: '14:28', value: 4.1, baseline: 4.1 },
          { time: '14:30', value: 4.1, baseline: 4.1 },
          { time: '14:32', value: 4.1, baseline: 4.1 }
        ]
      },
      temperature: {
        baseline: 68,
        current: 68,
        trend: 'STABLE',
        unit: '°C',
        history: [
          { time: '14:20', value: 68, baseline: 68 },
          { time: '14:22', value: 68, baseline: 68 },
          { time: '14:24', value: 69, baseline: 68 },
          { time: '14:26', value: 68, baseline: 68 },
          { time: '14:28', value: 68, baseline: 68 },
          { time: '14:30', value: 69, baseline: 68 },
          { time: '14:32', value: 68, baseline: 68 }
        ]
      },
      rpm: {
        current: 8420,
        status: 'NORMAL',
        unit: 'RPM'
      },
      flightCycles: 2941,
      operatingHours: 3842
    };
  },

  getAnomalousReadings(): SensorAnalyticsData {
    return JSON.parse(JSON.stringify(INITIAL_SENSOR_DATA));
  }
};

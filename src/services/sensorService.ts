import { apiFetch } from './api';
import { SensorAnalyticsData } from '../types';
import { INITIAL_SENSOR_DATA } from '../data/mockData';

export const sensorService = {
  async getSensorData(componentId: string = 'TB-007'): Promise<SensorAnalyticsData> {
    try {
      return await apiFetch<SensorAnalyticsData>(`/api/sensors?componentId=${componentId}`);
    } catch (err) {
      console.warn('[sensorService] Failed to fetch sensor data:', err);
      return INITIAL_SENSOR_DATA;
    }
  },

  async stepSimulation(
    componentId: string = 'TB-007',
    updates: { vibrationCurrent?: number; temperatureCurrent?: number; rpmCurrent?: number }
  ): Promise<SensorAnalyticsData> {
    try {
      return await apiFetch<SensorAnalyticsData>('/api/sensors/step', {
        method: 'POST',
        body: JSON.stringify({ componentId, ...updates })
      });
    } catch (err) {
      console.warn('[sensorService] Failed to post sensor step:', err);
      return INITIAL_SENSOR_DATA;
    }
  },

  async resetToBaseline(componentId: string = 'TB-007'): Promise<SensorAnalyticsData> {
    try {
      return await apiFetch<SensorAnalyticsData>('/api/sensors/reset', {
        method: 'POST',
        body: JSON.stringify({ componentId })
      });
    } catch (err) {
      console.warn('[sensorService] Failed to reset sensors to baseline:', err);
      return INITIAL_SENSOR_DATA;
    }
  }
};

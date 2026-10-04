import { apiFetch } from './api';
import { InspectionData } from '../types';
import { INITIAL_INSPECTION_DATA } from '../data/mockData';

export const inspectionService = {
  async inspectImage(
    imageUri: string,
    options?: {
      hasCrack?: boolean;
      imageBase64?: string;
      componentId?: string;
      technicianId?: string;
      isOffline?: boolean;
    }
  ): Promise<InspectionData> {
    try {
      return await apiFetch<InspectionData>('/api/inspections/run', {
        method: 'POST',
        body: JSON.stringify({
          imageUri,
          imageBase64: options?.imageBase64,
          componentId: options?.componentId || 'TB-007',
          technicianId: options?.technicianId || 'TECH-024',
          forceClean: options?.hasCrack === false,
          isOffline: options?.isOffline ?? false
        })
      });
    } catch (err) {
      console.warn('[inspectionService] API error during inspectImage, using local fallback:', err);
      // Fallback
      return {
        ...INITIAL_INSPECTION_DATA,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        imageUri: imageUri || INITIAL_INSPECTION_DATA.imageUri
      };
    }
  },

  async getInspectionHistory(): Promise<InspectionData[]> {
    try {
      return await apiFetch<InspectionData[]>('/api/inspections/history');
    } catch (err) {
      console.warn('[inspectionService] Failed to load inspection history:', err);
      return [INITIAL_INSPECTION_DATA];
    }
  }
};

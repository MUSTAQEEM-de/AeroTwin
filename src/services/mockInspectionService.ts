import { InspectionData, InspectionDefect } from '../types';
import { INITIAL_INSPECTION_DATA, TURBINE_IMAGE_URI } from '../data/mockData';

export const mockInspectionService = {
  async inspectImage(imageUri: string, options?: { hasCrack?: boolean }): Promise<InspectionData> {
    // Simulates Edge AI local inference latency (140-160ms)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const hasCrack = options?.hasCrack !== false;

    if (!hasCrack) {
      return {
        id: `INSP-${Math.floor(10000 + Math.random() * 90000)}`,
        componentId: 'TB-007',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        technicianId: 'TECH-024',
        status: 'COMPLETED',
        imageUri,
        defect: null,
        modelVersion: 'AeroTwin-YOLO-v1.2',
        inferenceTimeMs: 138,
        explainability: {
          title: 'WHY IS THE COMPONENT NOMINAL?',
          bullets: [
            'No crack-like linear discontinuities detected on aerofoil surface',
            'Thermal barrier coating reflectance is within normal calibration tolerance',
            'Leading and trailing edges show expected operational micro-finish',
            'Inference completed locally on AT-EDGE-07 neural accelerator'
          ],
          riskScore: 12
        }
      };
    }

    const defect: InspectionDefect = {
      type: 'Crack',
      confidence: 0.94,
      severity: 'HIGH',
      location: 'Leading Edge (Mid-span Section 4B)',
      sizeMm: 4.2,
      bbox: { x: 38, y: 32, width: 28, height: 34 }
    };

    return {
      id: `INSP-${Math.floor(10000 + Math.random() * 90000)}`,
      componentId: 'TB-007',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      technicianId: 'TECH-024',
      status: 'COMPLETED',
      imageUri: imageUri || TURBINE_IMAGE_URI,
      defect,
      modelVersion: 'AeroTwin-YOLO-v1.2',
      inferenceTimeMs: 143,
      explainability: {
        title: 'WHY DID THE AI FLAG THIS?',
        bullets: [
          'Crack-like structure detected on leading edge aerofoil',
          'Located in critical high-aerodynamic-stress region (Mid-span 4B)',
          'High visual confidence (94%) exceeds inspection safety threshold (80%)',
          'Estimated defect size 4.2 mm with branching morphology',
          'Local edge inference verified with on-device model integrity hash'
        ],
        riskScore: 88
      }
    };
  },

  getInspectionHistory() {
    return [INITIAL_INSPECTION_DATA];
  }
};

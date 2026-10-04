import { Router } from 'express';

export const modelRouter = Router();

modelRouter.get('/', (req, res) => {
  res.json([
    {
      id: 'AeroTwin-YOLO-v1.2',
      name: 'AeroTwin-YOLO-v1.2',
      category: 'Computer Vision / Surface Defect Object Detection',
      status: 'DEPLOYED ON EDGE (NPU)',
      weightsSize: '48.2 MB (FP16 Quantized)',
      architecture: 'Custom DarkNet / YOLOv8 Backbone with Aerospace TBC Pretraining',
      metrics: {
        precision: '93%',
        recall: '89%',
        f1: '91%',
        map50: '91%',
        latency: '143 ms'
      },
      trainingSet: 'Airbus / CFM56 Borescope Inspection Dataset (4,820 labeled aerofoil defects)',
      validationStatus: 'FAA / EASA AI Assessment Framework Level 2 Compliant (Active Model)'
    },
    {
      id: 'AeroTwin-Anomaly-v1.0',
      name: 'AeroTwin-Anomaly-v1.0',
      category: 'Time-Series Sensor Anomaly & Harmonic Drift Detection',
      status: 'DEPLOYED ON EDGE (CPU)',
      weightsSize: '12.4 MB (ONNX Runtime)',
      architecture: 'Autoencoder + Transformer Temporal Convolutional Network (TCN)',
      metrics: {
        precision: '91%',
        recall: '94%',
        f1: '92%',
        map50: 'N/A',
        latency: '18 ms'
      },
      trainingSet: '14,000 flight hours accelerometer & EGT telemetry streams',
      validationStatus: 'On-Wing Baseline Calibration Active'
    },
    {
      id: 'Fusion-v1.0',
      name: 'Fusion-v1.0',
      category: 'Multi-Modal Evidence Fusion & Degradation Risk Engine',
      status: 'DEPLOYED ON EDGE',
      weightsSize: '6.1 MB (Deterministic Bayesian Network)',
      architecture: 'Probabilistic Graphical Model + Corroboration Fusion Matrix',
      metrics: {
        precision: '95%',
        recall: '92%',
        f1: '93%',
        map50: 'N/A',
        latency: '42 ms'
      },
      trainingSet: 'MRO fleet teardown and NDI inspection correlation archives',
      validationStatus: 'Decision Support Level 1 (Human-In-The-Loop Signoff Required)'
    }
  ]);
});

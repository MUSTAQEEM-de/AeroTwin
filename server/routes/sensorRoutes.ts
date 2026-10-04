import { Router } from 'express';
import { sensorService } from '../services/sensorService';

export const sensorRouter = Router();

sensorRouter.get('/', (req, res) => {
  try {
    const componentId = (req.query.componentId as string) || 'TB-007';
    const data = sensorService.getSensorData(componentId);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

sensorRouter.post('/step', (req, res) => {
  try {
    const { componentId = 'TB-007', vibrationCurrent, temperatureCurrent, rpmCurrent } = req.body;
    const data = sensorService.updateTelemetry(componentId, {
      vibrationCurrent,
      temperatureCurrent,
      rpmCurrent
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

sensorRouter.post('/reset', (req, res) => {
  try {
    const { componentId = 'TB-007' } = req.body;
    const data = sensorService.resetToBaseline(componentId);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

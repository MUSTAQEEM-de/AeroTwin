import { Router } from 'express';
import { fusionService } from '../services/fusionService';
import { EvidenceScenario } from '../../src/types';

export const fusionRouter = Router();

fusionRouter.get('/', (req, res) => {
  try {
    const scenario = (req.query.scenario as EvidenceScenario) || 'MULTI_SOURCE';
    const analysis = fusionService.calculateFusion(scenario);
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

fusionRouter.post('/calculate', (req, res) => {
  try {
    const { scenario = 'MULTI_SOURCE', customParams } = req.body;
    const analysis = fusionService.calculateFusion(scenario, customParams);
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

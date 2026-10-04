import { Router } from 'express';
import { auditService } from '../services/auditService';

export const auditRouter = Router();

auditRouter.get('/', (req, res) => {
  try {
    const { search, risk, syncStatus } = req.query as { search?: string; risk?: string; syncStatus?: string };
    const logs = auditService.getLogs({ search, risk, syncStatus });
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

auditRouter.post('/', (req, res) => {
  try {
    const record = auditService.recordLog(req.body);
    res.status(201).json(record);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

auditRouter.get('/export.csv', (req, res) => {
  try {
    const csvContent = auditService.generateCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="aerotwin-mro-audit-trail.csv"');
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

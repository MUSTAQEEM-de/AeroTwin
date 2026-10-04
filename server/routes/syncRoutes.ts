import { Router } from 'express';
import { syncService } from '../services/syncService';

export const syncRouter = Router();

syncRouter.get('/queue', (req, res) => {
  try {
    const queue = syncService.getQueue(true);
    res.json(queue);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

syncRouter.post('/enqueue', (req, res) => {
  try {
    const item = syncService.enqueueItem(req.body);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

syncRouter.post('/process', async (req, res) => {
  try {
    const result = await syncService.processSync();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

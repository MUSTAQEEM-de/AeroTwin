import { Router } from 'express';
import { db } from '../db';
import { DigitalTwinState, RiskLevel } from '../../src/types';

export const digitalTwinRouter = Router();

digitalTwinRouter.get('/:componentId', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM digital_twin_states WHERE component_id = ?').get(req.params.componentId) as any;
    if (!row) {
      return res.status(404).json({ error: 'Digital twin state not found' });
    }

    const state: DigitalTwinState = {
      componentId: row.component_id,
      name: row.name,
      healthScore: row.health_score,
      risk: row.risk as RiskLevel,
      status: row.status,
      defectLocation: row.defect_location,
      stressPoints: JSON.parse(row.stress_points_json || '[]'),
      historyTimeline: JSON.parse(row.history_timeline_json || '[]')
    };

    res.json(state);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

digitalTwinRouter.patch('/:componentId', (req, res) => {
  try {
    const { healthScore, risk, status, stressPoints, historyTimeline } = req.body;
    db.prepare(`
      UPDATE digital_twin_states
      SET health_score = COALESCE(?, health_score),
          risk = COALESCE(?, risk),
          status = COALESCE(?, status),
          stress_points_json = COALESCE(?, stress_points_json),
          history_timeline_json = COALESCE(?, history_timeline_json),
          updated_at = ?
      WHERE component_id = ?
    `).run(
      healthScore,
      risk,
      status,
      stressPoints ? JSON.stringify(stressPoints) : null,
      historyTimeline ? JSON.stringify(historyTimeline) : null,
      new Date().toISOString(),
      req.params.componentId
    );

    const row = db.prepare('SELECT * FROM digital_twin_states WHERE component_id = ?').get(req.params.componentId) as any;
    const state: DigitalTwinState = {
      componentId: row.component_id,
      name: row.name,
      healthScore: row.health_score,
      risk: row.risk as RiskLevel,
      status: row.status,
      defectLocation: row.defect_location,
      stressPoints: JSON.parse(row.stress_points_json || '[]'),
      historyTimeline: JSON.parse(row.history_timeline_json || '[]')
    };

    res.json(state);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

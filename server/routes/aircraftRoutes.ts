import { Router } from 'express';
import { db } from '../db';
import { Aircraft, ComponentSummary, EngineStructure } from '../../src/types';

export const aircraftRouter = Router();

aircraftRouter.get('/', (req, res) => {
  try {
    const aircraftRow = db.prepare('SELECT * FROM aircraft LIMIT 1').get() as any;
    if (!aircraftRow) {
      return res.status(404).json({ error: 'Aircraft not found' });
    }

    const engines = db.prepare('SELECT * FROM engines WHERE aircraft_id = ?').all(aircraftRow.id) as any[];
    const engineStructures: EngineStructure[] = engines.map((eng) => {
      const stages = db.prepare('SELECT * FROM engine_stages WHERE engine_id = ?').all(eng.id) as any[];
      return {
        id: eng.id,
        code: eng.code,
        name: eng.name,
        stages: stages.map((stg) => {
          const comps = db.prepare('SELECT * FROM components WHERE stage_id = ?').all(stg.id) as any[];
          return {
            name: stg.name,
            components: comps.map((c) => ({
              id: c.id,
              code: c.code,
              name: c.name,
              health: c.health,
              risk: c.risk,
              status: c.status,
              cycles: c.cycles,
              hours: c.hours
            }))
          };
        })
      };
    });

    const result: Aircraft = {
      id: aircraftRow.id,
      model: aircraftRow.model,
      tailNumber: aircraftRow.tail_number,
      operator: aircraftRow.operator,
      status: aircraftRow.status,
      flightHours: aircraftRow.flight_hours,
      flightCycles: aircraftRow.flight_cycles,
      lastCheckDate: aircraftRow.last_check_date,
      engines: engineStructures
    };

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

aircraftRouter.get('/components/:id', (req, res) => {
  try {
    const comp = db.prepare('SELECT * FROM components WHERE id = ?').get(req.params.id) as any;
    if (!comp) {
      return res.status(404).json({ error: 'Component not found' });
    }
    const result: ComponentSummary = {
      id: comp.id,
      code: comp.code,
      name: comp.name,
      health: comp.health,
      risk: comp.risk,
      status: comp.status,
      cycles: comp.cycles,
      hours: comp.hours
    };
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

aircraftRouter.patch('/components/:id', (req, res) => {
  try {
    const { health, risk, status } = req.body;
    db.prepare(`
      UPDATE components
      SET health = COALESCE(?, health),
          risk = COALESCE(?, risk),
          status = COALESCE(?, status)
      WHERE id = ?
    `).run(health, risk, status, req.params.id);

    const updated = db.prepare('SELECT * FROM components WHERE id = ?').get(req.params.id) as any;
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

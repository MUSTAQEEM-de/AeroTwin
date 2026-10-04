import { Router } from 'express';
import { db } from '../db';
import { aiVisionService } from '../services/aiVisionService';
import { auditService } from '../services/auditService';
import { syncService } from '../services/syncService';
import { InspectionData } from '../../src/types';

export const inspectionRouter = Router();

inspectionRouter.post('/run', async (req, res) => {
  try {
    const { componentId = 'TB-007', technicianId = 'TECH-024', forceClean, imageUri, imageBase64, isOffline } = req.body;

    const inspection = await aiVisionService.analyzeImage({
      componentId,
      technicianId,
      forceClean,
      imageUri,
      imageBase64
    });

    // Save inspection into SQLite
    db.prepare(`
      INSERT INTO inspections (id, component_id, timestamp, technician_id, status, image_uri, is_custom_image, defect_json, model_version, inference_time_ms, explainability_json, provider)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      inspection.id,
      inspection.componentId,
      inspection.timestamp,
      inspection.technicianId,
      inspection.status,
      inspection.imageUri,
      inspection.isCustomImage ? 1 : 0,
      inspection.defect ? JSON.stringify(inspection.defect) : null,
      inspection.modelVersion,
      inspection.inferenceTimeMs,
      JSON.stringify(inspection.explainability),
      inspection.modelVersion.includes('Gemini') ? 'gemini-2.5-flash' : 'edge-deterministic'
    );

    // If defect detected, update component health and twin state
    if (inspection.defect) {
      db.prepare(`
        UPDATE components
        SET health = 68, risk = 'HIGH', status = 'ATTENTION REQUIRED'
        WHERE id = ?
      `).run(componentId);

      db.prepare(`
        UPDATE digital_twin_states
        SET health_score = 68, risk = 'HIGH', status = 'ATTENTION REQUIRED', updated_at = ?
        WHERE component_id = ?
      `).run(new Date().toISOString(), componentId);

      // Log audit entry
      auditService.recordLog({
        inspectionId: inspection.id,
        componentId,
        technician: `${technicianId}`,
        finding: `Crack detected (${inspection.defect.sizeMm} mm, ${inspection.defect.location})`,
        risk: 'HIGH',
        recommendation: 'Detailed NDI inspection required',
        decision: 'PENDING',
        modelVersion: inspection.modelVersion,
        syncStatus: isOffline ? 'QUEUED' : 'SYNCED'
      });

      if (isOffline) {
        syncService.enqueueItem({
          type: 'INSPECTION',
          entityId: inspection.id,
          summary: `${componentId} Edge Borescope AI Inference Record & Crack Bounding Box`,
          payload: inspection
        });
      }
    } else {
      // Nominal inspection
      auditService.recordLog({
        inspectionId: inspection.id,
        componentId,
        technician: `${technicianId}`,
        finding: 'Nominal surface condition (no fissures detected)',
        risk: 'LOW',
        recommendation: 'Release for scheduled flight operations',
        decision: 'ACCEPTED',
        modelVersion: inspection.modelVersion,
        syncStatus: isOffline ? 'QUEUED' : 'SYNCED'
      });
    }

    res.json(inspection);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

inspectionRouter.get('/history', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM inspections ORDER BY rowid DESC').all() as any[];
    const result: InspectionData[] = rows.map((r) => ({
      id: r.id,
      componentId: r.component_id,
      timestamp: r.timestamp,
      technicianId: r.technician_id,
      status: r.status,
      imageUri: r.image_uri,
      isCustomImage: r.is_custom_image === 1,
      defect: r.defect_json ? JSON.parse(r.defect_json) : null,
      modelVersion: r.model_version,
      inferenceTimeMs: r.inference_time_ms,
      explainability: JSON.parse(r.explainability_json || '{}')
    }));

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

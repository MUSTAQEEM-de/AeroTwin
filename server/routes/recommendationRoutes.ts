import { Router } from 'express';
import { db } from '../db';
import { auditService } from '../services/auditService';
import { syncService } from '../services/syncService';
import { MaintenanceRecommendation } from '../../src/types';

export const recommendationRouter = Router();

recommendationRouter.get('/latest', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM recommendations ORDER BY rowid DESC LIMIT 1').get() as any;
    if (!row) {
      return res.status(404).json({ error: 'No recommendations found' });
    }

    const rec: MaintenanceRecommendation = {
      id: row.id,
      componentId: row.component_id,
      priority: row.priority,
      title: row.title,
      evidence: JSON.parse(row.evidence_json || '[]'),
      action: row.action,
      reason: row.reason,
      operationalImpact: row.operational_impact,
      decisionState: row.decision_state,
      decisionDetails: row.decision_details_json ? JSON.parse(row.decision_details_json) : undefined
    };

    res.json(rec);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

recommendationRouter.post('/:id/decision', (req, res) => {
  try {
    const { decision, details, isOffline } = req.body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const decisionDetails = {
      action: decision,
      reason: details?.reason,
      notes: details?.notes,
      technician: details?.technician || 'TECH-024 (Alex Morgan)',
      timestamp: now
    };

    db.prepare(`
      UPDATE recommendations
      SET decision_state = ?,
          decision_details_json = ?,
          updated_at = ?
      WHERE id = ?
    `).run(decision, JSON.stringify(decisionDetails), now, req.params.id);

    const updatedRow = db.prepare('SELECT * FROM recommendations WHERE id = ?').get(req.params.id) as any;

    // Look up the latest inspection for this component to accurately populate finding, risk, and modelVersion
    const latestInsp = db.prepare('SELECT * FROM inspections WHERE component_id = ? ORDER BY rowid DESC LIMIT 1').get(updatedRow.component_id) as any;
    
    let findingText = 'Nominal surface condition';
    let riskLevel = updatedRow.priority === 'HIGH' ? 'HIGH' : updatedRow.priority === 'MEDIUM' ? 'MEDIUM' : 'LOW';
    let modelVersion = 'AeroTwin-YOLO-v1.2';
    let inspectionId = '';

    if (latestInsp) {
      inspectionId = latestInsp.id;
      modelVersion = latestInsp.model_version;
      if (latestInsp.defect_json) {
        try {
          const defect = JSON.parse(latestInsp.defect_json);
          findingText = `${defect.type || 'Defect'} detected (${defect.sizeMm ? defect.sizeMm + ' mm' : 'Dimension unmeasured'}, ${defect.location || 'Surface'}${defect.severity ? ` - Severity: ${defect.severity}` : ''})`;
          riskLevel = defect.severity === 'CRITICAL' || defect.severity === 'HIGH' ? 'HIGH' : defect.severity === 'MEDIUM' ? 'MEDIUM' : 'LOW';
        } catch {
          findingText = 'Defect detected in inspection';
        }
      } else {
        findingText = 'Nominal component surface condition (No defects)';
        riskLevel = 'LOW';
      }
    }

    // Log in Audit Trail
    auditService.recordLog({
      inspectionId,
      componentId: updatedRow.component_id,
      technician: decisionDetails.technician,
      finding: findingText,
      risk: riskLevel as any,
      recommendation: updatedRow.action,
      decision: `${decision}${details?.reason ? ` (${details.reason})` : ''}`,
      modelVersion,
      syncStatus: isOffline ? 'QUEUED' : 'SYNCED'
    });

    if (isOffline) {
      syncService.enqueueItem({
        type: 'AUDIT_RECORD',
        entityId: req.params.id,
        summary: `Technician Decision Signoff [${decision}] for Component ${updatedRow.component_id}`,
        payload: { recommendationId: req.params.id, decision, details: decisionDetails }
      });
    }

    const rec: MaintenanceRecommendation = {
      id: updatedRow.id,
      componentId: updatedRow.component_id,
      priority: updatedRow.priority,
      title: updatedRow.title,
      evidence: JSON.parse(updatedRow.evidence_json || '[]'),
      action: updatedRow.action,
      reason: updatedRow.reason,
      operationalImpact: updatedRow.operational_impact,
      decisionState: updatedRow.decision_state,
      decisionDetails: updatedRow.decision_details_json ? JSON.parse(updatedRow.decision_details_json) : undefined
    };

    res.json(rec);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

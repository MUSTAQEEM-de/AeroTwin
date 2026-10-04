import crypto from 'crypto';
import { db } from '../db';
import { AuditRecord, RiskLevel, SyncStatus } from '../../src/types';

export class AuditService {
  public getLogs(filters?: { search?: string; risk?: string; syncStatus?: string }): AuditRecord[] {
    let sql = 'SELECT * FROM audit_records WHERE 1=1';
    const params: any[] = [];

    if (filters?.risk && filters.risk !== 'ALL') {
      sql += ' AND risk = ?';
      params.push(filters.risk);
    }

    if (filters?.syncStatus && filters.syncStatus !== 'ALL') {
      sql += ' AND sync_status = ?';
      params.push(filters.syncStatus);
    }

    sql += ' ORDER BY rowid DESC';
    const rows = db.prepare(sql).all(...params) as any[];

    let mapped: AuditRecord[] = rows.map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      inspectionId: r.inspection_id || '',
      componentId: r.component_id,
      technician: r.technician,
      finding: r.finding,
      risk: r.risk as RiskLevel,
      recommendation: r.recommendation,
      decision: r.decision,
      modelVersion: r.model_version,
      syncStatus: r.sync_status as SyncStatus
    }));

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      mapped = mapped.filter(
        (l) =>
          l.componentId.toLowerCase().includes(q) ||
          l.finding.toLowerCase().includes(q) ||
          l.technician.toLowerCase().includes(q) ||
          l.inspectionId.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
      );
    }

    return mapped;
  }

  public recordLog(entry: {
    inspectionId?: string;
    componentId: string;
    technician: string;
    finding: string;
    risk: RiskLevel;
    recommendation: string;
    decision: string;
    modelVersion: string;
    syncStatus?: SyncStatus;
  }): AuditRecord {
    const id = `AUD-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const syncStatus = entry.syncStatus || 'SYNCED';

    // Get previous hash for hash chain
    const lastRow = db.prepare('SELECT hash FROM audit_records ORDER BY rowid DESC LIMIT 1').get() as { hash?: string } | undefined;
    const prevHash = lastRow?.hash || '0000000000000000000000000000000000000000000000000000000000000000';

    const rawData = `${id}|${timestamp}|${entry.componentId}|${entry.technician}|${entry.finding}|${entry.decision}|${prevHash}`;
    const hash = crypto.createHash('sha256').update(rawData).digest('hex');

    const insert = db.prepare(`
      INSERT INTO audit_records (id, timestamp, inspection_id, component_id, technician, finding, risk, recommendation, decision, model_version, sync_status, hash, prev_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      timestamp,
      entry.inspectionId || null,
      entry.componentId,
      entry.technician,
      entry.finding,
      entry.risk,
      entry.recommendation,
      entry.decision,
      entry.modelVersion,
      syncStatus,
      hash,
      prevHash
    );

    return {
      id,
      timestamp,
      inspectionId: entry.inspectionId || '',
      componentId: entry.componentId,
      technician: entry.technician,
      finding: entry.finding,
      risk: entry.risk,
      recommendation: entry.recommendation,
      decision: entry.decision,
      modelVersion: entry.modelVersion,
      syncStatus
    };
  }

  public generateCsv(): string {
    const logs = this.getLogs();
    const headers = ['"Audit ID"', '"Timestamp"', '"Component ID"', '"Technician"', '"Inspection ID"', '"Finding"', '"Risk Level"', '"Recommendation"', '"Decision"', '"Model Version"', '"Sync Status"'];
    const rows = logs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.componentId}"`,
      `"${l.technician}"`,
      `"${l.inspectionId}"`,
      `"${l.finding.replace(/"/g, '""')}"`,
      `"${l.risk}"`,
      `"${l.recommendation.replace(/"/g, '""')}"`,
      `"${l.decision.replace(/"/g, '""')}"`,
      `"${l.modelVersion}"`,
      `"${l.syncStatus}"`
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const auditService = new AuditService();

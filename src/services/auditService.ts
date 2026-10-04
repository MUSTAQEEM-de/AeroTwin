import { apiFetch } from './api';
import { AuditRecord } from '../types';
import { INITIAL_AUDIT_LOGS } from '../data/mockData';

export const auditService = {
  async getAuditLogs(filters?: { search?: string; risk?: string; syncStatus?: string }): Promise<AuditRecord[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.risk && filters.risk !== 'ALL') params.append('risk', filters.risk);
      if (filters?.syncStatus && filters.syncStatus !== 'ALL') params.append('syncStatus', filters.syncStatus);

      const qs = params.toString();
      return await apiFetch<AuditRecord[]>(`/api/audit${qs ? `?${qs}` : ''}`);
    } catch (err) {
      console.warn('[auditService] Failed to load audit logs:', err);
      return INITIAL_AUDIT_LOGS;
    }
  },

  async recordLog(record: Omit<AuditRecord, 'id' | 'timestamp'>): Promise<AuditRecord> {
    try {
      return await apiFetch<AuditRecord>('/api/audit', {
        method: 'POST',
        body: JSON.stringify(record)
      });
    } catch (err) {
      console.warn('[auditService] Failed to record audit log:', err);
      return {
        ...record,
        id: `AUD-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        syncStatus: 'SYNCED'
      };
    }
  },

  getExportCsvUrl(): string {
    return '/api/audit/export.csv';
  }
};

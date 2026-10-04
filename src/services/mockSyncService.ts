import { SyncQueueItem } from '../types';

export const mockSyncService = {
  async processSync(
    items: SyncQueueItem[],
    onProgress: (progress: number, phase: string) => void
  ): Promise<{ syncedCount: number; durationMs: number }> {
    onProgress(15, 'Validating record schema & SHA-256 cryptographic signatures...');
    await new Promise((r) => setTimeout(r, 600));

    onProgress(45, 'Establishing TLS mutual authentication with Central MRO Cloud...');
    await new Promise((r) => setTimeout(r, 600));

    onProgress(75, 'Transmitting delta payloads & delta conflict resolution...');
    await new Promise((r) => setTimeout(r, 700));

    onProgress(95, 'Finalizing central ledger commit and audit log sync...');
    await new Promise((r) => setTimeout(r, 500));

    onProgress(100, 'Synchronization verified. Central repository up to date.');
    return {
      syncedCount: items.length,
      durationMs: 2400
    };
  }
};

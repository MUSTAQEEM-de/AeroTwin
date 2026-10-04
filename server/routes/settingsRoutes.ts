import { Router } from 'express';
import { db, resetDatabase } from '../db';

export const settingsRouter = Router();

settingsRouter.get('/users', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM users').all() as any[];
    const users = rows.map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      employeeId: u.employee_id,
      avatar: u.avatar,
      department: u.department
    }));
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

settingsRouter.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM device_settings').all() as any[];
    const settings: Record<string, string> = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

settingsRouter.post('/', (req, res) => {
  try {
    const { confidenceThreshold, preferredCompute } = req.body;
    if (confidenceThreshold !== undefined) {
      db.prepare('INSERT OR REPLACE INTO device_settings (key, value) VALUES (?, ?)').run('confidenceThreshold', String(confidenceThreshold));
    }
    if (preferredCompute !== undefined) {
      db.prepare('INSERT OR REPLACE INTO device_settings (key, value) VALUES (?, ?)').run('preferredCompute', String(preferredCompute));
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

settingsRouter.post('/reset', (req, res) => {
  try {
    resetDatabase();
    res.json({ success: true, message: 'Database reset and seeded with nominal initial dataset' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

settingsRouter.get('/notifications', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM notifications ORDER BY rowid DESC').all() as any[];
    const notifs = rows.map((r) => ({
      id: r.id,
      title: r.title,
      message: r.message,
      type: r.type,
      timestamp: r.timestamp,
      read: r.read === 1,
      targetTab: r.target_tab
    }));
    res.json(notifs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

settingsRouter.patch('/notifications/:id/read', (req, res) => {
  try {
    db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

settingsRouter.delete('/notifications', (req, res) => {
  try {
    db.prepare('DELETE FROM notifications').run();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

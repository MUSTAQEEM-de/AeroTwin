import express from 'express';
import dotenv from 'dotenv';
import { initDatabase } from './db';
import { aircraftRouter } from './routes/aircraftRoutes';
import { inspectionRouter } from './routes/inspectionRoutes';
import { sensorRouter } from './routes/sensorRoutes';
import { fusionRouter } from './routes/fusionRoutes';
import { digitalTwinRouter } from './routes/digitalTwinRoutes';
import { recommendationRouter } from './routes/recommendationRoutes';
import { auditRouter } from './routes/auditRoutes';
import { syncRouter } from './routes/syncRoutes';
import { modelRouter } from './routes/modelRoutes';
import { settingsRouter } from './routes/settingsRoutes';

dotenv.config();

// Initialize SQLite schema and initial data
initDatabase();

export const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/aircraft', aircraftRouter);
app.use('/api/inspections', inspectionRouter);
app.use('/api/sensors', sensorRouter);
app.use('/api/fusion', fusionRouter);
app.use('/api/digital-twin', digitalTwinRouter);
app.use('/api/recommendations', recommendationRouter);
app.use('/api/audit', auditRouter);
app.use('/api/sync', syncRouter);
app.use('/api/models', modelRouter);
app.use('/api/settings', settingsRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    edgeNode: 'AT-EDGE-07',
    database: 'SQLite (WAL Mode)',
    aiEngine: process.env.GEMINI_API_KEY ? 'Gemini 3.8 Flash + Local NPU' : 'Local NPU / Deterministic',
    timestamp: new Date().toISOString()
  });
});

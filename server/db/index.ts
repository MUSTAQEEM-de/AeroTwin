import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'aerotwin_edge.db');

export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode and foreign keys for performance and integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      employee_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT NOT NULL,
      department TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS aircraft (
      id TEXT PRIMARY KEY,
      model TEXT NOT NULL,
      tail_number TEXT NOT NULL,
      operator TEXT NOT NULL,
      status TEXT NOT NULL,
      flight_hours INTEGER NOT NULL,
      flight_cycles INTEGER NOT NULL,
      last_check_date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS engines (
      id TEXT PRIMARY KEY,
      aircraft_id TEXT NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY(aircraft_id) REFERENCES aircraft(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS engine_stages (
      id TEXT PRIMARY KEY,
      engine_id TEXT NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY(engine_id) REFERENCES engines(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS components (
      id TEXT PRIMARY KEY,
      stage_id TEXT NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      health INTEGER NOT NULL,
      risk TEXT NOT NULL,
      status TEXT NOT NULL,
      cycles INTEGER NOT NULL,
      hours INTEGER NOT NULL,
      FOREIGN KEY(stage_id) REFERENCES engine_stages(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inspections (
      id TEXT PRIMARY KEY,
      component_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      technician_id TEXT NOT NULL,
      status TEXT NOT NULL,
      image_uri TEXT NOT NULL,
      is_custom_image INTEGER DEFAULT 0,
      defect_json TEXT,
      model_version TEXT NOT NULL,
      inference_time_ms INTEGER NOT NULL,
      explainability_json TEXT NOT NULL,
      provider TEXT NOT NULL,
      FOREIGN KEY(component_id) REFERENCES components(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sensor_telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      component_id TEXT NOT NULL,
      vibration_baseline REAL NOT NULL,
      vibration_current REAL NOT NULL,
      vibration_status TEXT NOT NULL,
      vibration_history_json TEXT NOT NULL,
      temperature_baseline REAL NOT NULL,
      temperature_current REAL NOT NULL,
      temperature_trend TEXT NOT NULL,
      temperature_history_json TEXT NOT NULL,
      rpm_current INTEGER NOT NULL,
      rpm_status TEXT NOT NULL,
      flight_cycles INTEGER NOT NULL,
      operating_hours INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS digital_twin_states (
      component_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      health_score INTEGER NOT NULL,
      risk TEXT NOT NULL,
      status TEXT NOT NULL,
      defect_location TEXT NOT NULL,
      stress_points_json TEXT NOT NULL,
      history_timeline_json TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(component_id) REFERENCES components(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      component_id TEXT NOT NULL,
      priority TEXT NOT NULL,
      title TEXT NOT NULL,
      evidence_json TEXT NOT NULL,
      action TEXT NOT NULL,
      reason TEXT NOT NULL,
      operational_impact TEXT NOT NULL,
      decision_state TEXT NOT NULL,
      decision_details_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(component_id) REFERENCES components(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_records (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      inspection_id TEXT,
      component_id TEXT NOT NULL,
      technician TEXT NOT NULL,
      finding TEXT NOT NULL,
      risk TEXT NOT NULL,
      recommendation TEXT NOT NULL,
      decision TEXT NOT NULL,
      model_version TEXT NOT NULL,
      sync_status TEXT NOT NULL,
      hash TEXT NOT NULL,
      prev_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      summary TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      payload_size_kb INTEGER NOT NULL,
      payload_json TEXT NOT NULL,
      sha256_hash TEXT NOT NULL,
      synced INTEGER DEFAULT 0,
      synced_at TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      target_tab TEXT
    );

    CREATE TABLE IF NOT EXISTS device_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) {
    return; // Already seeded
  }

  // Seed Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, employee_id, name, role, avatar, department)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertUser.run('user-01', 'TECH-024', 'Alex Morgan', 'Maintenance Technician', 'AM', 'MRO Powerplant Line 3');
  insertUser.run('user-02', 'ENG-108', 'Sarah Chen', 'MRO Propulsion Engineer', 'SC', 'Fleet Reliability Engineering');
  insertUser.run('user-03', 'SUP-012', 'Daniel Brooks', 'Maintenance Supervisor', 'DB', 'Airframe & Powerplant Base');

  // Seed Aircraft
  const insertAircraft = db.prepare(`
    INSERT INTO aircraft (id, model, tail_number, operator, status, flight_hours, flight_cycles, last_check_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertAircraft.run('A320-001', 'Airbus A320-200', 'N320AT', 'AeroFleet Global', 'MAINTENANCE_REQUIRED', 14820, 9410, '2026-09-21');

  // Seed Engines
  const insertEngine = db.prepare(`
    INSERT INTO engines (id, aircraft_id, code, name)
    VALUES (?, ?, ?, ?)
  `);
  insertEngine.run('ENG-01', 'A320-001', 'ENG-01', 'CFM56-5B Turbofan (Left)');
  insertEngine.run('ENG-02', 'A320-001', 'ENG-02', 'CFM56-5B Turbofan (Right)');

  // Seed Stages
  const insertStage = db.prepare(`
    INSERT INTO engine_stages (id, engine_id, name)
    VALUES (?, ?, ?)
  `);
  insertStage.run('STAGE-FAN', 'ENG-01', 'Fan Stage');
  insertStage.run('STAGE-HPC', 'ENG-01', 'High Pressure Compressor');
  insertStage.run('STAGE-HPT', 'ENG-01', 'High Pressure Turbine (HPT)');
  insertStage.run('STAGE-ENG2-HPT', 'ENG-02', 'Turbine Stage');

  // Seed Components
  const insertComp = db.prepare(`
    INSERT INTO components (id, stage_id, code, name, health, risk, status, cycles, hours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertComp.run('FAN-01', 'STAGE-FAN', 'FAN-01', 'Fan Blade Set A', 96, 'LOW', 'NORMAL', 2941, 3842);
  insertComp.run('FAN-02', 'STAGE-FAN', 'FAN-02', 'Inlet Guide Vane #04', 92, 'LOW', 'NORMAL', 2941, 3842);
  insertComp.run('HPC-01', 'STAGE-HPC', 'HPC-01', 'Compressor Rotor Stage 3', 88, 'LOW', 'NORMAL', 2941, 3842);
  insertComp.run('HPC-02', 'STAGE-HPC', 'HPC-02', 'Bleed Air Valve Actuator', 84, 'MEDIUM', 'MONITORING', 2941, 3842);
  insertComp.run('TB-001', 'STAGE-HPT', 'TB-001', 'Turbine Blade #01', 91, 'LOW', 'NORMAL', 2941, 3842);
  insertComp.run('TB-002', 'STAGE-HPT', 'TB-002', 'Turbine Blade #02', 89, 'LOW', 'NORMAL', 2941, 3842);
  insertComp.run('TB-003', 'STAGE-HPT', 'TB-003', 'Turbine Blade #03', 90, 'LOW', 'NORMAL', 2941, 3842);
  insertComp.run('TB-004', 'STAGE-HPT', 'TB-004', 'Turbine Blade #04', 87, 'LOW', 'NORMAL', 2941, 3842);
  insertComp.run('TB-005', 'STAGE-HPT', 'TB-005', 'Turbine Blade #05', 93, 'LOW', 'NORMAL', 2941, 3842);
  insertComp.run('TB-006', 'STAGE-HPT', 'TB-006', 'Turbine Blade #06', 85, 'MEDIUM', 'MONITORING', 2941, 3842);
  insertComp.run('TB-007', 'STAGE-HPT', 'TB-007', 'Turbine Blade #07', 68, 'HIGH', 'ATTENTION REQUIRED', 2941, 3842);
  insertComp.run('TB-201', 'STAGE-ENG2-HPT', 'TB-201', 'Turbine Blade #01 (ENG-02)', 94, 'LOW', 'NORMAL', 2810, 3670);

  // Seed Initial Inspection
  const insertInsp = db.prepare(`
    INSERT INTO inspections (id, component_id, timestamp, technician_id, status, image_uri, is_custom_image, defect_json, model_version, inference_time_ms, explainability_json, provider)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertInsp.run(
    'INSP-00482',
    'TB-007',
    '2026-09-25 14:32:08 UTC',
    'TECH-024',
    'COMPLETED',
    '/src/assets/images/turbine_blade_inspection_1790340783862.jpg',
    0,
    JSON.stringify({
      type: 'Crack',
      confidence: 0.94,
      severity: 'HIGH',
      location: 'Leading Edge (Mid-span Section 4B)',
      sizeMm: 4.2,
      bbox: { x: 38, y: 32, width: 28, height: 34 }
    }),
    'AeroTwin-YOLO-v1.2',
    143,
    JSON.stringify({
      title: 'WHY DID THE AI FLAG THIS?',
      bullets: [
        'Crack-like linear discontinuity detected across thermal barrier coating',
        'Defect located in critical aerodynamic stress region (Leading Edge mid-span)',
        'Pixel morphometry estimates length at 4.2 mm with micro-branching',
        'Thermal gradient variance indicates localized barrier delamination',
        'Confidence score (94%) exceeds mandatory inspection alert threshold (80%)'
      ],
      riskScore: 88
    }),
    'edge-deterministic-morphometry'
  );

  // Seed Telemetry
  const insertTelemetry = db.prepare(`
    INSERT INTO sensor_telemetry (component_id, vibration_baseline, vibration_current, vibration_status, vibration_history_json, temperature_baseline, temperature_current, temperature_trend, temperature_history_json, rpm_current, rpm_status, flight_cycles, operating_hours, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertTelemetry.run(
    'TB-007',
    4.1,
    7.4,
    'ANOMALOUS',
    JSON.stringify([
      { time: '14:20', value: 4.1, baseline: 4.1 },
      { time: '14:22', value: 4.2, baseline: 4.1 },
      { time: '14:24', value: 4.4, baseline: 4.1 },
      { time: '14:26', value: 4.8, baseline: 4.1 },
      { time: '14:28', value: 5.3, baseline: 4.1 },
      { time: '14:30', value: 6.2, baseline: 4.1 },
      { time: '14:32', value: 7.4, baseline: 4.1 }
    ]),
    68,
    82,
    'INCREASING',
    JSON.stringify([
      { time: '14:20', value: 68, baseline: 68 },
      { time: '14:22', value: 69, baseline: 68 },
      { time: '14:24', value: 71, baseline: 68 },
      { time: '14:26', value: 74, baseline: 68 },
      { time: '14:28', value: 77, baseline: 68 },
      { time: '14:30', value: 80, baseline: 68 },
      { time: '14:32', value: 82, baseline: 68 }
    ]),
    8420,
    'NORMAL',
    2941,
    3842,
    new Date().toISOString()
  );

  // Seed Digital Twin State
  const insertTwin = db.prepare(`
    INSERT INTO digital_twin_states (component_id, name, health_score, risk, status, defect_location, stress_points_json, history_timeline_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertTwin.run(
    'TB-007',
    'Turbine Blade #07 (HPT Stage 1)',
    68,
    'HIGH',
    'ATTENTION REQUIRED',
    'Leading Edge Mid-Span (Section 4B)',
    JSON.stringify([
      { id: 'sp-1', x: 42, y: 36, label: 'Leading Edge Defect Zone (4.2 mm crack)', intensity: 'high' },
      { id: 'sp-2', x: 55, y: 22, label: 'Cooling Duct Orifice #3 (Thermal Gradient)', intensity: 'medium' },
      { id: 'sp-3', x: 48, y: 78, label: 'Dovetail Blade Root (Mechanical Vibration)', intensity: 'high' },
      { id: 'sp-4', x: 28, y: 50, label: 'Trailing Edge Aerofoil (Nominal)', intensity: 'low' }
    ]),
    JSON.stringify([
      {
        id: 'dt-1',
        title: 'Baseline In-Service Condition',
        time: '120 Flight Cycles Ago',
        state: 'HEALTH 91 / NORMAL',
        type: 'baseline',
        description: 'Factory baseline calibration; vibration 4.1 mm/s; zero thermal barrier degradation.'
      },
      {
        id: 'dt-2',
        title: 'Scheduled Borescope Inspection',
        time: 'Today 14:30 UTC',
        state: 'EDGE INFERENCE TRIGGERED',
        type: 'inspection',
        description: 'High-res borescope capture ingested by on-device AeroTwin-YOLO-v1.2 model.'
      },
      {
        id: 'dt-3',
        title: 'Structural Crack Detected',
        time: 'Today 14:32 UTC',
        state: 'DEFECT CONFIRMED (4.2 mm)',
        type: 'anomaly',
        description: 'Crack identified on leading edge aerofoil; confidence 94%; severity High.'
      },
      {
        id: 'dt-4',
        title: 'Health Score Re-evaluated',
        time: 'Today 14:32 UTC',
        state: 'HEALTH: 91 → 68 / HIGH RISK',
        type: 'anomaly',
        description: 'Evidence fusion combined visual crack with +80.5% vibration deviation.'
      },
      {
        id: 'dt-5',
        title: 'Maintenance Recommendation Dispatched',
        time: 'Today 14:33 UTC',
        state: 'DETAILED INSPECTION REQUIRED',
        type: 'decision',
        description: 'Pending human-in-the-loop signoff before next flight dispatch window.'
      }
    ]),
    new Date().toISOString()
  );

  // Seed Recommendations
  const insertRec = db.prepare(`
    INSERT INTO recommendations (id, component_id, priority, title, evidence_json, action, reason, operational_impact, decision_state, decision_details_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertRec.run(
    'REC-2026-0925-07',
    'TB-007',
    'HIGH',
    'HIGH MAINTENANCE PRIORITY: PERFORM DETAILED INSPECTION BEFORE NEXT OPERATIONAL CYCLE',
    JSON.stringify([
      'Structural crack detected on leading edge (4.2 mm, 94% confidence)',
      'Vibration anomaly detected: 7.4 mm/s (+80.5% over 4.1 mm/s baseline)',
      'Temperature trend increasing: 82°C (+14°C escalation over baseline)',
      'Elevated operating exposure: 2,941 flight cycles, 3,842 total hours'
    ]),
    'PERFORM DETAILED NON-DESTRUCTIVE INSPECTION (NDI) & EDDY CURRENT VERIFICATION BEFORE NEXT OPERATIONAL CYCLE',
    'Multiple independent evidence sources indicate elevated component risk. Immediate verification prevents in-flight blade liberation.',
    'Aircraft A320-001 flagged for ground hold pending signoff. Estimated inspection downtime: 2.5 hours.',
    'PENDING',
    null,
    '2026-09-25 14:33:00 UTC',
    '2026-09-25 14:33:00 UTC'
  );

  // Seed Audit Records
  const insertAudit = db.prepare(`
    INSERT INTO audit_records (id, timestamp, inspection_id, component_id, technician, finding, risk, recommendation, decision, model_version, sync_status, hash, prev_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
  const initialAudits = [
    {
      id: 'AUD-0924-004',
      timestamp: 'Yesterday 10:20',
      inspectionId: 'INSP-00459',
      componentId: 'HPC-02',
      technician: 'ENG-108 (Sarah Chen)',
      finding: 'Actuator travel variance',
      risk: 'MEDIUM',
      recommendation: 'Recalibrate sensor',
      decision: 'OVERRIDDEN',
      modelVersion: 'AeroTwin-Anomaly-v1.0',
      syncStatus: 'SYNCED'
    },
    {
      id: 'AUD-0924-003',
      timestamp: 'Yesterday 16:45',
      inspectionId: 'INSP-00465',
      componentId: 'FAN-01',
      technician: 'TECH-024 (Alex Morgan)',
      finding: 'Nominal surface condition',
      risk: 'LOW',
      recommendation: 'Release for service',
      decision: 'ACCEPTED',
      modelVersion: 'AeroTwin-YOLO-v1.2',
      syncStatus: 'SYNCED'
    },
    {
      id: 'AUD-0925-002',
      timestamp: '11:15:40',
      inspectionId: 'INSP-00478',
      componentId: 'TB-006',
      technician: 'TECH-024 (Alex Morgan)',
      finding: 'Minor leading edge erosion',
      risk: 'MEDIUM',
      recommendation: 'Monitor next A-check',
      decision: 'ACCEPTED',
      modelVersion: 'AeroTwin-YOLO-v1.2',
      syncStatus: 'SYNCED'
    },
    {
      id: 'AUD-0925-001',
      timestamp: '14:32:08',
      inspectionId: 'INSP-00482',
      componentId: 'TB-007',
      technician: 'TECH-024 (Alex Morgan)',
      finding: 'Crack detected (4.2 mm)',
      risk: 'HIGH',
      recommendation: 'Detailed NDI inspection',
      decision: 'PENDING',
      modelVersion: 'AeroTwin-YOLO-v1.2',
      syncStatus: 'SYNCED'
    }
  ];

  for (const item of initialAudits) {
    const rawData = `${item.id}|${item.timestamp}|${item.componentId}|${item.technician}|${item.finding}|${item.decision}|${prevHash}`;
    const hash = crypto.createHash('sha256').update(rawData).digest('hex');
    insertAudit.run(
      item.id,
      item.timestamp,
      item.inspectionId,
      item.componentId,
      item.technician,
      item.finding,
      item.risk,
      item.recommendation,
      item.decision,
      item.modelVersion,
      item.syncStatus,
      hash,
      prevHash
    );
    prevHash = hash;
  }

  // Seed Sync Queue
  const insertQueue = db.prepare(`
    INSERT INTO sync_queue (id, type, entity_id, summary, timestamp, payload_size_kb, payload_json, sha256_hash, synced, synced_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const queueItems = [
    {
      id: 'SYNC-Q-101',
      type: 'INSPECTION',
      entityId: 'INSP-00482',
      summary: 'TB-007 Borescope Vision Inference Record & Crack Bounding Box',
      timestamp: '14:32:10 UTC',
      payloadSizeKb: 412,
      payloadJson: JSON.stringify({ inspectionId: 'INSP-00482', componentId: 'TB-007', defect: 'Crack (4.2mm)' })
    },
    {
      id: 'SYNC-Q-102',
      type: 'INSPECTION',
      entityId: 'INSP-00481',
      summary: 'TB-006 Leading Edge Optical Surface Capture',
      timestamp: '14:15:22 UTC',
      payloadSizeKb: 388,
      payloadJson: JSON.stringify({ inspectionId: 'INSP-00481', componentId: 'TB-006' })
    },
    {
      id: 'SYNC-Q-103',
      type: 'INSPECTION',
      entityId: 'INSP-00480',
      summary: 'FAN-01 Blade Root Acoustic Emission Trace',
      timestamp: '13:58:04 UTC',
      payloadSizeKb: 290,
      payloadJson: JSON.stringify({ inspectionId: 'INSP-00480', componentId: 'FAN-01' })
    },
    {
      id: 'SYNC-Q-104',
      type: 'SENSOR_BURST',
      entityId: 'SENS-0824',
      summary: 'HPT Stage 1 Accelerometer 10-Minute High-Rate Burst (7.4 mm/s)',
      timestamp: '14:32:00 UTC',
      payloadSizeKb: 1040,
      payloadJson: JSON.stringify({ sensorId: 'SENS-0824', vibration: 7.4 })
    },
    {
      id: 'SYNC-Q-105',
      type: 'SENSOR_BURST',
      entityId: 'SENS-0823',
      summary: 'Turbine Exhaust Gas Temperature (EGT) Log (82°C)',
      timestamp: '14:30:00 UTC',
      payloadSizeKb: 540,
      payloadJson: JSON.stringify({ sensorId: 'SENS-0823', egt: 82 })
    },
    {
      id: 'SYNC-Q-106',
      type: 'TWIN_STATE',
      entityId: 'TWIN-TB-007',
      summary: 'Digital Twin State Transition: Health 91 → 68, Risk Level: HIGH',
      timestamp: '14:32:12 UTC',
      payloadSizeKb: 124,
      payloadJson: JSON.stringify({ twinId: 'TB-007', health: 68, risk: 'HIGH' })
    },
    {
      id: 'SYNC-Q-107',
      type: 'AUDIT_RECORD',
      entityId: 'AUD-0925-001',
      summary: 'Technician Decision Log & Edge Signature Verification',
      timestamp: '14:32:15 UTC',
      payloadSizeKb: 48,
      payloadJson: JSON.stringify({ auditId: 'AUD-0925-001', status: 'PENDING' })
    }
  ];

  for (const q of queueItems) {
    const hash = crypto.createHash('sha256').update(q.payloadJson).digest('hex');
    insertQueue.run(q.id, q.type, q.entityId, q.summary, q.timestamp, q.payloadSizeKb, q.payloadJson, hash, 0, null);
  }

  // Seed Notifications
  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, title, message, type, timestamp, read, target_tab)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertNotif.run(
    'notif-1',
    'HIGH RISK COMPONENT',
    'Turbine Blade #07 requires attention — crack detected with sensor correlation.',
    'ALERT',
    '14:32 UTC',
    0,
    'evidence-fusion'
  );
  insertNotif.run(
    'notif-2',
    'AI INSPECTION COMPLETE',
    'AeroTwin-YOLO-v1.2 detected 4.2 mm crack with 94% confidence.',
    'WARNING',
    '14:32 UTC',
    0,
    'inspection'
  );
  insertNotif.run(
    'notif-3',
    'EDGE AI ENGINE READY',
    'Local models loaded on AT-EDGE-07. Offline inference operational.',
    'INFO',
    '14:00 UTC',
    1,
    'settings'
  );

  // Seed Settings
  const insertSetting = db.prepare(`
    INSERT INTO device_settings (key, value)
    VALUES (?, ?)
  `);
  insertSetting.run('confidenceThreshold', '80');
  insertSetting.run('preferredCompute', 'NPU');
  insertSetting.run('deviceId', 'AT-EDGE-07');
  insertSetting.run('firmware', 'v2.4.1');
}

export function resetDatabase() {
  db.exec(`
    DROP TABLE IF EXISTS device_settings;
    DROP TABLE IF EXISTS notifications;
    DROP TABLE IF EXISTS sync_queue;
    DROP TABLE IF EXISTS audit_records;
    DROP TABLE IF EXISTS recommendations;
    DROP TABLE IF EXISTS digital_twin_states;
    DROP TABLE IF EXISTS sensor_telemetry;
    DROP TABLE IF EXISTS inspections;
    DROP TABLE IF EXISTS components;
    DROP TABLE IF EXISTS engine_stages;
    DROP TABLE IF EXISTS engines;
    DROP TABLE IF EXISTS aircraft;
    DROP TABLE IF EXISTS users;
  `);
  initDatabase();
}

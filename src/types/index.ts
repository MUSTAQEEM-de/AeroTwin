export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ComponentStatus = 'NORMAL' | 'ATTENTION REQUIRED' | 'GROUNDED' | 'MONITORING';
export type SyncStatus = 'SYNCED' | 'QUEUED' | 'PENDING';

export interface User {
  id: string;
  name: string;
  role: string;
  employeeId: string;
  avatar: string;
  department: string;
}

export interface Aircraft {
  id: string;
  model: string;
  tailNumber: string;
  operator: string;
  status: 'FLIGHT_READY' | 'MAINTENANCE_REQUIRED' | 'IN_HANGAR';
  flightHours: number;
  flightCycles: number;
  lastCheckDate: string;
  engines: EngineStructure[];
}

export interface EngineStructure {
  id: string;
  code: string;
  name: string;
  stages: {
    name: string;
    components: ComponentSummary[];
  }[];
}

export interface ComponentSummary {
  id: string;
  code: string;
  name: string;
  health: number;
  risk: RiskLevel;
  status: ComponentStatus;
  cycles: number;
  hours: number;
}

export interface InspectionDefect {
  type: string;
  confidence: number;
  severity: RiskLevel;
  location: string;
  sizeMm: number;
  bbox: { x: number; y: number; width: number; height: number };
}

export interface InspectionData {
  id: string;
  componentId: string;
  timestamp: string;
  technicianId: string;
  status: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  imageUri: string;
  isCustomImage?: boolean;
  defect: InspectionDefect | null;
  modelVersion: string;
  inferenceTimeMs: number;
  explainability: {
    title: string;
    bullets: string[];
    riskScore: number;
  };
}

export interface SensorPoint {
  time: string;
  value: number;
  baseline: number;
}

export interface SensorAnalyticsData {
  isSimulating: boolean;
  vibration: {
    baseline: number;
    current: number;
    deviationPercent: number;
    status: 'NORMAL' | 'ANOMALOUS' | 'CRITICAL';
    unit: string;
    history: SensorPoint[];
  };
  temperature: {
    baseline: number;
    current: number;
    trend: 'STABLE' | 'INCREASING' | 'OVERHEAT';
    unit: string;
    history: SensorPoint[];
  };
  rpm: {
    current: number;
    status: 'NORMAL' | 'FLUCTUATING';
    unit: string;
  };
  flightCycles: number;
  operatingHours: number;
}

export type EvidenceScenario = 'NORMAL' | 'VISUAL_ONLY' | 'SENSOR_ONLY' | 'MULTI_SOURCE';

export interface FusionAnalysis {
  scenario: EvidenceScenario;
  visualEvidence: {
    level: RiskLevel;
    summary: string;
    confidence: number;
    findings: string[];
  };
  sensorEvidence: {
    level: RiskLevel;
    summary: string;
    findings: string[];
  };
  historicalContext: {
    level: RiskLevel;
    summary: string;
    flightCycles: number;
    operatingHours: number;
    findings: string[];
  };
  overallRisk: RiskLevel;
  healthScore: number;
  fusionConfidence: number;
  explanationPoints: string[];
  pocWeights: {
    visual: number;
    sensor: number;
    historical: number;
    recentInspection: number;
  };
  rulWindow: {
    minHours: number;
    maxHours: number;
    confidence: number;
    risk: RiskLevel;
    note: string;
  };
}

export interface DigitalTwinState {
  componentId: string;
  name: string;
  healthScore: number;
  risk: RiskLevel;
  status: ComponentStatus;
  defectLocation: string;
  stressPoints: { id: string; x: number; y: number; label: string; intensity: 'low' | 'medium' | 'high' }[];
  historyTimeline: {
    id: string;
    title: string;
    time: string;
    state: string;
    type: 'baseline' | 'inspection' | 'anomaly' | 'decision';
    description: string;
  }[];
}

export interface MaintenanceRecommendation {
  id: string;
  componentId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  evidence: string[];
  action: string;
  reason: string;
  operationalImpact: string;
  decisionState: 'PENDING' | 'ACCEPTED' | 'OVERRIDDEN' | 'REVIEW_REQUESTED';
  decisionDetails?: {
    action: string;
    reason?: string;
    notes?: string;
    technician: string;
    timestamp: string;
  };
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  inspectionId: string;
  componentId: string;
  technician: string;
  finding: string;
  risk: RiskLevel;
  recommendation: string;
  decision: string;
  modelVersion: string;
  syncStatus: SyncStatus;
}

export interface SyncQueueItem {
  id: string;
  type: 'INSPECTION' | 'SENSOR_BURST' | 'TWIN_STATE' | 'AUDIT_RECORD';
  entityId: string;
  summary: string;
  timestamp: string;
  payloadSizeKb: number;
  synced: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'SUCCESS' | 'WARNING';
  timestamp: string;
  read: boolean;
  targetTab?: string;
}

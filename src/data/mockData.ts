import {
  User,
  Aircraft,
  ComponentSummary,
  InspectionData,
  SensorAnalyticsData,
  FusionAnalysis,
  DigitalTwinState,
  MaintenanceRecommendation,
  AuditRecord,
  SyncQueueItem,
  AppNotification,
  EvidenceScenario
} from '../types';

export const TURBINE_IMAGE_URI = '/src/assets/images/turbine_blade_inspection_1790340783862.jpg';
export const ENGINE_IMAGE_URI = '/src/assets/images/turbine_engine_assembly_1790340800849.jpg';

export const MOCK_USERS: User[] = [
  {
    id: 'user-01',
    name: 'Alex Morgan',
    role: 'Maintenance Technician',
    employeeId: 'TECH-024',
    avatar: 'AM',
    department: 'MRO Powerplant Line 3'
  },
  {
    id: 'user-02',
    name: 'Sarah Chen',
    role: 'MRO Propulsion Engineer',
    employeeId: 'ENG-108',
    avatar: 'SC',
    department: 'Fleet Reliability Engineering'
  },
  {
    id: 'user-03',
    name: 'Daniel Brooks',
    role: 'Maintenance Supervisor',
    employeeId: 'SUP-012',
    avatar: 'DB',
    department: 'Airframe & Powerplant Base'
  }
];

export const PRIMARY_COMPONENT: ComponentSummary = {
  id: 'TB-007',
  code: 'TB-007',
  name: 'Turbine Blade #07',
  health: 68,
  risk: 'HIGH',
  status: 'ATTENTION REQUIRED',
  cycles: 2941,
  hours: 3842
};

export const MOCK_AIRCRAFT: Aircraft = {
  id: 'A320-001',
  model: 'Airbus A320-200',
  tailNumber: 'N320AT',
  operator: 'AeroFleet Global',
  status: 'MAINTENANCE_REQUIRED',
  flightHours: 14820,
  flightCycles: 9410,
  lastCheckDate: '2026-09-21',
  engines: [
    {
      id: 'ENG-01',
      code: 'ENG-01',
      name: 'CFM56-5B Turbofan (Left)',
      stages: [
        {
          name: 'Fan Stage',
          components: [
            { id: 'FAN-01', code: 'FAN-01', name: 'Fan Blade Set A', health: 96, risk: 'LOW', status: 'NORMAL', cycles: 2941, hours: 3842 },
            { id: 'FAN-02', code: 'FAN-02', name: 'Inlet Guide Vane #04', health: 92, risk: 'LOW', status: 'NORMAL', cycles: 2941, hours: 3842 }
          ]
        },
        {
          name: 'High Pressure Compressor',
          components: [
            { id: 'HPC-01', code: 'HPC-01', name: 'Compressor Rotor Stage 3', health: 88, risk: 'LOW', status: 'NORMAL', cycles: 2941, hours: 3842 },
            { id: 'HPC-02', code: 'HPC-02', name: 'Bleed Air Valve Actuator', health: 84, risk: 'MEDIUM', status: 'MONITORING', cycles: 2941, hours: 3842 }
          ]
        },
        {
          name: 'High Pressure Turbine (HPT)',
          components: [
            { id: 'TB-001', code: 'TB-001', name: 'Turbine Blade #01', health: 91, risk: 'LOW', status: 'NORMAL', cycles: 2941, hours: 3842 },
            { id: 'TB-002', code: 'TB-002', name: 'Turbine Blade #02', health: 89, risk: 'LOW', status: 'NORMAL', cycles: 2941, hours: 3842 },
            { id: 'TB-003', code: 'TB-003', name: 'Turbine Blade #03', health: 90, risk: 'LOW', status: 'NORMAL', cycles: 2941, hours: 3842 },
            { id: 'TB-004', code: 'TB-004', name: 'Turbine Blade #04', health: 87, risk: 'LOW', status: 'NORMAL', cycles: 2941, hours: 3842 },
            { id: 'TB-005', code: 'TB-005', name: 'Turbine Blade #05', health: 93, risk: 'LOW', status: 'NORMAL', cycles: 2941, hours: 3842 },
            { id: 'TB-006', code: 'TB-006', name: 'Turbine Blade #06', health: 85, risk: 'MEDIUM', status: 'MONITORING', cycles: 2941, hours: 3842 },
            { id: 'TB-007', code: 'TB-007', name: 'Turbine Blade #07', health: 68, risk: 'HIGH', status: 'ATTENTION REQUIRED', cycles: 2941, hours: 3842 }
          ]
        }
      ]
    },
    {
      id: 'ENG-02',
      code: 'ENG-02',
      name: 'CFM56-5B Turbofan (Right)',
      stages: [
        {
          name: 'Turbine Stage',
          components: [
            { id: 'TB-201', code: 'TB-201', name: 'Turbine Blade #01 (ENG-02)', health: 94, risk: 'LOW', status: 'NORMAL', cycles: 2810, hours: 3670 }
          ]
        }
      ]
    }
  ]
};

export const INITIAL_INSPECTION_DATA: InspectionData = {
  id: 'INSP-00482',
  componentId: 'TB-007',
  timestamp: '2026-09-25 14:32:08 UTC',
  technicianId: 'TECH-024',
  status: 'COMPLETED',
  imageUri: TURBINE_IMAGE_URI,
  defect: {
    type: 'Crack',
    confidence: 0.94,
    severity: 'HIGH',
    location: 'Leading Edge (Mid-span)',
    sizeMm: 4.2,
    bbox: { x: 38, y: 32, width: 28, height: 34 }
  },
  modelVersion: 'AeroTwin-YOLO-v1.2',
  inferenceTimeMs: 143,
  explainability: {
    title: 'WHY DID THE AI FLAG THIS?',
    bullets: [
      'Crack-like linear discontinuity detected across thermal barrier coating',
      'Defect located in critical aerodynamic stress region (Leading Edge mid-span)',
      'Pixel morphometry estimates length at 4.2 mm with micro-branching',
      'Thermal gradient variance indicates localized barrier delamination',
      'Confidence score (94%) exceeds mandatory inspection alert threshold (80%)'
    ],
    riskScore: 88
  }
};

export const INITIAL_SENSOR_DATA: SensorAnalyticsData = {
  isSimulating: false,
  vibration: {
    baseline: 4.1,
    current: 7.4,
    deviationPercent: 80.5,
    status: 'ANOMALOUS',
    unit: 'mm/s',
    history: [
      { time: '14:20', value: 4.1, baseline: 4.1 },
      { time: '14:22', value: 4.2, baseline: 4.1 },
      { time: '14:24', value: 4.4, baseline: 4.1 },
      { time: '14:26', value: 4.8, baseline: 4.1 },
      { time: '14:28', value: 5.3, baseline: 4.1 },
      { time: '14:30', value: 6.2, baseline: 4.1 },
      { time: '14:32', value: 7.4, baseline: 4.1 }
    ]
  },
  temperature: {
    baseline: 68,
    current: 82,
    trend: 'INCREASING',
    unit: '°C',
    history: [
      { time: '14:20', value: 68, baseline: 68 },
      { time: '14:22', value: 69, baseline: 68 },
      { time: '14:24', value: 71, baseline: 68 },
      { time: '14:26', value: 74, baseline: 68 },
      { time: '14:28', value: 77, baseline: 68 },
      { time: '14:30', value: 80, baseline: 68 },
      { time: '14:32', value: 82, baseline: 68 }
    ]
  },
  rpm: {
    current: 8420,
    status: 'NORMAL',
    unit: 'RPM'
  },
  flightCycles: 2941,
  operatingHours: 3842
};

export const FUSION_SCENARIOS: Record<EvidenceScenario, FusionAnalysis> = {
  MULTI_SOURCE: {
    scenario: 'MULTI_SOURCE',
    visualEvidence: {
      level: 'HIGH',
      summary: 'Structural crack detected (4.2 mm) with micro-branching on leading edge',
      confidence: 0.94,
      findings: ['YOLO-v1.2 detected 4.2 mm fissure', 'Leading edge stress zone', 'Confidence: 94%']
    },
    sensorEvidence: {
      level: 'HIGH',
      summary: 'Vibration anomaly (+80.5% above baseline) & thermal escalation (+14°C)',
      findings: ['Vibration: 7.4 mm/s vs 4.1 baseline', 'Temperature: 82°C trending upward', 'Harmonic drift detected']
    },
    historicalContext: {
      level: 'MEDIUM',
      summary: '2,941 flight cycles & 3,842 operating hours indicate elevated thermal fatigue exposure',
      flightCycles: 2941,
      operatingHours: 3842,
      findings: ['Within 85% of scheduled mid-life overhaul window', 'Previous inspection: surface wear noted']
    },
    overallRisk: 'HIGH',
    healthScore: 68,
    fusionConfidence: 0.82,
    explanationPoints: [
      'Structural crack detected on leading edge (94% model confidence)',
      'Vibration is 80.5% above baseline (7.4 mm/s vs 4.1 mm/s)',
      'Temperature trend is increasing (+14°C thermal escalation)',
      'Component has elevated operating exposure (2,941 cycles, 3,842 hrs)',
      'Multiple independent evidence sources corroborate accelerated degradation'
    ],
    pocWeights: {
      visual: 25,
      sensor: 30,
      historical: 20,
      recentInspection: 25
    },
    rulWindow: {
      minHours: 72,
      maxHours: 110,
      confidence: 0.82,
      risk: 'HIGH',
      note: 'POC MODEL OUTPUT: Not a certified aerospace RUL measurement. Prediction depends on available validation data.'
    }
  },
  VISUAL_ONLY: {
    scenario: 'VISUAL_ONLY',
    visualEvidence: {
      level: 'HIGH',
      summary: 'Crack detected on leading edge (4.0 mm, 91% confidence)',
      confidence: 0.91,
      findings: ['Visual defect confirmed by camera', 'No sensor corroboration yet']
    },
    sensorEvidence: {
      level: 'LOW',
      summary: 'Telemetry signals within baseline operational limits',
      findings: ['Vibration 4.2 mm/s (Normal)', 'Temperature 69°C (Stable)', 'RPM 8,420 (Nominal)']
    },
    historicalContext: {
      level: 'LOW',
      summary: '2,941 flight cycles, nominal exposure curve',
      flightCycles: 2941,
      operatingHours: 3842,
      findings: ['Cycle count within normal envelope']
    },
    overallRisk: 'MEDIUM',
    healthScore: 78,
    fusionConfidence: 0.74,
    explanationPoints: [
      'Visual defect observed, but telemetry is currently normal',
      'Crack may be superficial or in early propagation stage',
      'Correlated sensor signals do not yet exhibit harmonic resonance',
      'Non-destructive testing (NDT) recommended prior to teardown'
    ],
    pocWeights: {
      visual: 40,
      sensor: 20,
      historical: 20,
      recentInspection: 20
    },
    rulWindow: {
      minHours: 180,
      maxHours: 260,
      confidence: 0.74,
      risk: 'MEDIUM',
      note: 'POC MODEL OUTPUT: Not a certified aerospace RUL measurement. Visual defect without sensor harmonic escalation.'
    }
  },
  SENSOR_ONLY: {
    scenario: 'SENSOR_ONLY',
    visualEvidence: {
      level: 'LOW',
      summary: 'No visible surface defect detected on optical inspection',
      confidence: 0.89,
      findings: ['Optical camera reveals clean thermal barrier surface', 'No macro-cracks detected']
    },
    sensorEvidence: {
      level: 'HIGH',
      summary: 'Severe vibration anomaly (8.1 mm/s, +97.5% deviation)',
      findings: ['Vibration spike detected across 3 telemetry cycles', 'Temperature rising sharply to 86°C']
    },
    historicalContext: {
      level: 'MEDIUM',
      summary: '2,941 flight cycles, high duty cycle',
      flightCycles: 2941,
      operatingHours: 3842,
      findings: ['Component approaching scheduled stator shroud check']
    },
    overallRisk: 'HIGH',
    healthScore: 71,
    fusionConfidence: 0.78,
    explanationPoints: [
      'High telemetry anomaly without visible external blade fissure',
      'Indicates potential internal cooling duct blockage or subsurface root stress',
      'Potential blade root dovetail fretting or bearing cage harmonic resonance',
      'Immediate borescope probe and eddy current sensor check advised'
    ],
    pocWeights: {
      visual: 15,
      sensor: 45,
      historical: 20,
      recentInspection: 20
    },
    rulWindow: {
      minHours: 50,
      maxHours: 90,
      confidence: 0.78,
      risk: 'HIGH',
      note: 'POC MODEL OUTPUT: Not a certified aerospace RUL measurement. Subsurface or internal cooling risk suspected.'
    }
  },
  NORMAL: {
    scenario: 'NORMAL',
    visualEvidence: {
      level: 'LOW',
      summary: 'Surface integrity intact, no anomalies detected',
      confidence: 0.98,
      findings: ['Thermal barrier uniform', 'No fissures or spallation']
    },
    sensorEvidence: {
      level: 'LOW',
      summary: 'All telemetry channels within calibrated baseline',
      findings: ['Vibration 4.1 mm/s (Nominal)', 'Temperature 68°C (Nominal)', 'RPM 8,420 (Nominal)']
    },
    historicalContext: {
      level: 'LOW',
      summary: 'Nominal operational hours, satisfactory compliance',
      flightCycles: 2941,
      operatingHours: 3842,
      findings: ['All scheduled service intervals fulfilled']
    },
    overallRisk: 'LOW',
    healthScore: 91,
    fusionConfidence: 0.96,
    explanationPoints: [
      'Visual examination clear of microstructural flaws',
      'Sensor vibration and heat channels are stable and within spec',
      'No evidence of creep or thermal mechanical fatigue',
      'Component fully cleared for normal flight dispatch'
    ],
    pocWeights: {
      visual: 25,
      sensor: 30,
      historical: 20,
      recentInspection: 25
    },
    rulWindow: {
      minHours: 450,
      maxHours: 600,
      confidence: 0.94,
      risk: 'LOW',
      note: 'POC MODEL OUTPUT: Component operates within nominal certified limits.'
    }
  }
};

export const INITIAL_DIGITAL_TWIN: DigitalTwinState = {
  componentId: 'TB-007',
  name: 'Turbine Blade #07 (HPT Stage 1)',
  healthScore: 68,
  risk: 'HIGH',
  status: 'ATTENTION REQUIRED',
  defectLocation: 'Leading Edge Mid-Span (Section 4B)',
  stressPoints: [
    { id: 'sp-1', x: 42, y: 36, label: 'Leading Edge Defect Zone (4.2 mm crack)', intensity: 'high' },
    { id: 'sp-2', x: 55, y: 22, label: 'Cooling Duct Orifice #3 (Thermal Gradient)', intensity: 'medium' },
    { id: 'sp-3', x: 48, y: 78, label: 'Dovetail Blade Root (Mechanical Vibration)', intensity: 'high' },
    { id: 'sp-4', x: 28, y: 50, label: 'Trailing Edge Aerofoil (Nominal)', intensity: 'low' }
  ],
  historyTimeline: [
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
  ]
};

export const INITIAL_RECOMMENDATION: MaintenanceRecommendation = {
  id: 'REC-2026-0925-07',
  componentId: 'TB-007',
  priority: 'HIGH',
  title: 'HIGH MAINTENANCE PRIORITY: PERFORM DETAILED INSPECTION BEFORE NEXT OPERATIONAL CYCLE',
  evidence: [
    'Structural crack detected on leading edge (4.2 mm, 94% confidence)',
    'Vibration anomaly detected: 7.4 mm/s (+80.5% over 4.1 mm/s baseline)',
    'Temperature trend increasing: 82°C (+14°C escalation over baseline)',
    'Elevated operating exposure: 2,941 flight cycles, 3,842 total hours'
  ],
  action: 'PERFORM DETAILED NON-DESTRUCTIVE INSPECTION (NDI) & EDDY CURRENT VERIFICATION BEFORE NEXT OPERATIONAL CYCLE',
  reason: 'Multiple independent evidence sources indicate elevated component risk. Immediate verification prevents in-flight blade liberation.',
  operationalImpact: 'Aircraft A320-001 flagged for ground hold pending signoff. Estimated inspection downtime: 2.5 hours.',
  decisionState: 'PENDING'
};

export const INITIAL_AUDIT_LOGS: AuditRecord[] = [
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
  }
];

export const INITIAL_SYNC_QUEUE: SyncQueueItem[] = [
  {
    id: 'SYNC-Q-101',
    type: 'INSPECTION',
    entityId: 'INSP-00482',
    summary: 'TB-007 Borescope Vision Inference Record & Crack Bounding Box',
    timestamp: '14:32:10 UTC',
    payloadSizeKb: 412,
    synced: false
  },
  {
    id: 'SYNC-Q-102',
    type: 'INSPECTION',
    entityId: 'INSP-00481',
    summary: 'TB-006 Leading Edge Optical Surface Capture',
    timestamp: '14:15:22 UTC',
    payloadSizeKb: 388,
    synced: false
  },
  {
    id: 'SYNC-Q-103',
    type: 'INSPECTION',
    entityId: 'INSP-00480',
    summary: 'FAN-01 Blade Root Acoustic Emission Trace',
    timestamp: '13:58:04 UTC',
    payloadSizeKb: 290,
    synced: false
  },
  {
    id: 'SYNC-Q-104',
    type: 'SENSOR_BURST',
    entityId: 'SENS-0824',
    summary: 'HPT Stage 1 Accelerometer 10-Minute High-Rate Burst (7.4 mm/s)',
    timestamp: '14:32:00 UTC',
    payloadSizeKb: 1040,
    synced: false
  },
  {
    id: 'SYNC-Q-105',
    type: 'SENSOR_BURST',
    entityId: 'SENS-0823',
    summary: 'Turbine Exhaust Gas Temperature (EGT) Log (82°C)',
    timestamp: '14:30:00 UTC',
    payloadSizeKb: 540,
    synced: false
  },
  {
    id: 'SYNC-Q-106',
    type: 'TWIN_STATE',
    entityId: 'TWIN-TB-007',
    summary: 'Digital Twin State Transition: Health 91 → 68, Risk Level: HIGH',
    timestamp: '14:32:12 UTC',
    payloadSizeKb: 124,
    synced: false
  },
  {
    id: 'SYNC-Q-107',
    type: 'AUDIT_RECORD',
    entityId: 'AUD-0925-001',
    summary: 'Technician Decision Log & Edge Signature Verification',
    timestamp: '14:32:15 UTC',
    payloadSizeKb: 48,
    synced: false
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'HIGH RISK COMPONENT',
    message: 'Turbine Blade #07 requires attention — crack detected with sensor correlation.',
    type: 'ALERT',
    timestamp: '14:32 UTC',
    read: false,
    targetTab: 'evidence-fusion'
  },
  {
    id: 'notif-2',
    title: 'AI INSPECTION COMPLETE',
    message: 'AeroTwin-YOLO-v1.2 detected 4.2 mm crack with 94% confidence.',
    type: 'WARNING',
    timestamp: '14:32 UTC',
    read: false,
    targetTab: 'inspection'
  },
  {
    id: 'notif-3',
    title: 'EDGE AI ENGINE READY',
    message: 'Local models loaded on AT-EDGE-07. Offline inference operational.',
    type: 'INFO',
    timestamp: '14:00 UTC',
    read: true,
    targetTab: 'settings'
  }
];

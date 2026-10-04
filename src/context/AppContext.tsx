import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
import {
  MOCK_USERS,
  MOCK_AIRCRAFT,
  PRIMARY_COMPONENT,
  INITIAL_INSPECTION_DATA,
  INITIAL_SENSOR_DATA,
  FUSION_SCENARIOS,
  INITIAL_DIGITAL_TWIN,
  INITIAL_RECOMMENDATION,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYNC_QUEUE,
  INITIAL_NOTIFICATIONS,
  TURBINE_IMAGE_URI
} from '../data/mockData';
import { aircraftService } from '../services/aircraftService';
import { inspectionService } from '../services/inspectionService';
import { sensorService } from '../services/sensorService';
import { fusionService } from '../services/fusionService';
import { digitalTwinService } from '../services/digitalTwinService';
import { recommendationService } from '../services/recommendationService';
import { auditService } from '../services/auditService';
import { syncService } from '../services/syncService';
import { settingsService } from '../services/settingsService';

export interface DemoStepItem {
  id: number;
  label: string;
  tab: string;
  status: 'pending' | 'active' | 'completed';
  description: string;
}

interface AppContextType {
  // Auth & Navigation
  currentUser: User;
  setCurrentUser: (u: User) => void;
  isAuthenticated: boolean;
  login: (employeeId?: string, pass?: string) => boolean;
  logout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Selected Entities
  selectedAircraft: Aircraft;
  selectedComponent: ComponentSummary;
  setSelectedComponent: (c: ComponentSummary) => void;

  // Offline & Connectivity
  isOffline: boolean;
  toggleOffline: () => void;
  syncQueue: SyncQueueItem[];
  isSyncing: boolean;
  syncProgress: number;
  syncPhase: string;
  runSync: () => Promise<void>;

  // Inspection
  inspectionData: InspectionData;
  isInspecting: boolean;
  inspectionStepText: string;
  runInspection: (customImage?: string, forceClean?: boolean, imageBase64?: string) => Promise<void>;

  // Sensors
  sensorData: SensorAnalyticsData;
  isSensorSimulating: boolean;
  toggleSensorSimulation: () => void;
  resetSensorsToBaseline: () => void;

  // Evidence Fusion & Health
  fusionData: FusionAnalysis;
  evidenceScenario: EvidenceScenario;
  setScenario: (scenario: EvidenceScenario) => void;

  // Digital Twin
  digitalTwin: DigitalTwinState;

  // Recommendations & Human-in-the-loop
  recommendation: MaintenanceRecommendation;
  acceptRecommendation: () => Promise<void>;
  overrideRecommendation: (reason: string, notes: string) => Promise<void>;
  requestReviewRecommendation: (priority: string, message: string) => Promise<void>;

  // Audit Logs & Notifications
  auditLogs: AuditRecord[];
  refreshAuditLogs: () => Promise<void>;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Demo Walkthrough Mode
  isDemoRunning: boolean;
  currentDemoStepIndex: number;
  demoSteps: DemoStepItem[];
  startCompleteDemo: () => void;
  stopCompleteDemo: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_STEPS_DEF: Omit<DemoStepItem, 'status'>[] = [
  { id: 1, label: 'Initial Nominal Condition', tab: 'overview', description: 'Turbine Blade #07 at health 91/100, risk LOW' },
  { id: 2, label: 'Capture Borescope Image', tab: 'inspection', description: 'Edge camera feed loaded for visual inspection' },
  { id: 3, label: 'Local AI Inference & Detection', tab: 'inspection', description: 'AeroTwin-YOLO flags 4.2 mm crack (94% conf)' },
  { id: 4, label: 'Real-Time Sensor Telemetry', tab: 'sensors', description: 'Vibration escalates to 7.4 mm/s (+80.5% anomaly)' },
  { id: 5, label: 'Multi-Source Evidence Fusion', tab: 'evidence-fusion', description: 'Visual + Sensor + Exposure correlated' },
  { id: 6, label: 'Component Risk Elevated', tab: 'evidence-fusion', description: 'Health re-evaluated to 68/100 (HIGH RISK)' },
  { id: 7, label: 'Digital Twin State Transition', tab: 'digital-twin', description: 'Stress hotspots mapped to blade leading edge' },
  { id: 8, label: 'Explainable Maintenance Action', tab: 'recommendations', description: 'Detailed NDI inspection recommended' },
  { id: 9, label: 'Technician Decision Signoff', tab: 'recommendations', description: 'Alex Morgan (TECH-024) records acceptance' },
  { id: 10, label: 'Simulate Offline Operation', tab: 'sync', description: 'Local edge queue stores 7 uncommitted records' },
  { id: 11, label: 'Cloud Ledger Synchronization', tab: 'sync', description: '100% cryptographic sync restored to central MRO' },
  { id: 12, label: 'Audit Trail Verification', tab: 'audit', description: 'Tamper-proof compliance log verified' }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [activeTab, setActiveTabState] = useState<string>(() => {
    return sessionStorage.getItem('aerotwin_active_tab') || 'overview';
  });

  const setActiveTab = (tab: string) => {
    sessionStorage.setItem('aerotwin_active_tab', tab);
    setActiveTabState(tab);
  };

  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft>(MOCK_AIRCRAFT);
  const [selectedComponent, setSelectedComponent] = useState<ComponentSummary>(PRIMARY_COMPONENT);

  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(INITIAL_SYNC_QUEUE);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncPhase, setSyncPhase] = useState<string>('');

  const [inspectionData, setInspectionData] = useState<InspectionData>(INITIAL_INSPECTION_DATA);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [inspectionStepText, setInspectionStepText] = useState<string>('');

  const [sensorData, setSensorData] = useState<SensorAnalyticsData>(INITIAL_SENSOR_DATA);
  const [isSensorSimulating, setIsSensorSimulating] = useState<boolean>(false);

  const [evidenceScenario, setEvidenceScenario] = useState<EvidenceScenario>('MULTI_SOURCE');
  const [fusionData, setFusionData] = useState<FusionAnalysis>(FUSION_SCENARIOS.MULTI_SOURCE);

  const [digitalTwin, setDigitalTwin] = useState<DigitalTwinState>(INITIAL_DIGITAL_TWIN);
  const [recommendation, setRecommendation] = useState<MaintenanceRecommendation>(INITIAL_RECOMMENDATION);

  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Demo Walkthrough
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [currentDemoStepIndex, setCurrentDemoStepIndex] = useState<number>(0);
  const [demoSteps, setDemoSteps] = useState<DemoStepItem[]>(
    DEMO_STEPS_DEF.map((step) => ({ ...step, status: 'pending' }))
  );
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sensorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial load from real backend API
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [aircraft, sensorRes, recRes, auditRes, queueRes, notifRes, usersRes] = await Promise.all([
          aircraftService.getAircraft(),
          sensorService.getSensorData('TB-007'),
          recommendationService.getLatestRecommendation(),
          auditService.getAuditLogs(),
          syncService.getQueue(),
          settingsService.getNotifications(),
          settingsService.getUsers()
        ]);

        if (aircraft) setSelectedAircraft(aircraft);
        if (sensorRes) setSensorData(sensorRes);
        if (recRes) setRecommendation(recRes);
        if (auditRes) setAuditLogs(auditRes);
        if (queueRes) setSyncQueue(queueRes);
        if (notifRes) setNotifications(notifRes);
        if (usersRes && usersRes.length > 0) setCurrentUser(usersRes[0]);
      } catch (err) {
        console.warn('[AppContext] Initial load from API had partial error, continuing with fallback:', err);
      }
    }

    loadInitialData();
  }, []);

  const refreshAuditLogs = async () => {
    try {
      const logs = await auditService.getAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.warn('[AppContext] Failed to refresh audit logs:', err);
    }
  };

  // Authentication
  const login = (employeeId?: string) => {
    const user = MOCK_USERS.find((u) => u.employeeId === employeeId) || MOCK_USERS[0];
    setCurrentUser(user);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Offline toggle
  const toggleOffline = () => {
    setIsOffline((prev) => {
      const next = !prev;
      addNotification({
        title: next ? 'OFFLINE MODE ENGAGED' : 'ONLINE CONNECTIVITY RESTORED',
        message: next
          ? 'Edge AI and local inference fully active. Remote cloud commits deferred to local queue.'
          : 'High-speed encrypted link established with central airline MRO server.',
        type: next ? 'WARNING' : 'SUCCESS',
        targetTab: 'sync'
      });
      return next;
    });
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Run inspection with real backend API & AI
  const runInspection = async (customImage?: string, forceClean?: boolean, imageBase64?: string) => {
    setIsInspecting(true);
    setInspectionStepText('Analyzing inspection image...');

    try {
      const result = await inspectionService.inspectImage(customImage || TURBINE_IMAGE_URI, {
        hasCrack: !forceClean,
        imageBase64,
        componentId: selectedComponent.code,
        technicianId: currentUser.employeeId,
        isOffline
      });

      setInspectionData(result);
      setIsInspecting(false);
      setInspectionStepText('');

      if (result.defect) {
        setSelectedComponent((prev) => ({
          ...prev,
          health: 68,
          risk: 'HIGH',
          status: 'ATTENTION REQUIRED'
        }));

        setDigitalTwin((prev) => ({
          ...prev,
          healthScore: 68,
          risk: 'HIGH',
          status: 'ATTENTION REQUIRED'
        }));

        addNotification({
          title: 'CRACK DETECTED BY EDGE AI',
          message: `${result.modelVersion} detected ${result.defect.sizeMm} mm crack on ${selectedComponent.name} with ${Math.round(result.defect.confidence * 100)}% confidence.`,
          type: 'ALERT',
          targetTab: 'inspection'
        });

        refreshAuditLogs();

        if (isOffline) {
          setSyncQueue((prev) => [
            {
              id: `SYNC-Q-${Date.now()}`,
              type: 'INSPECTION',
              entityId: result.id,
              summary: `${selectedComponent.code} Edge Borescope AI Inference Record & Crack Bounding Box`,
              timestamp: result.timestamp,
              payloadSizeKb: 412,
              synced: false
            },
            ...prev
          ]);
        }
      } else {
        setSelectedComponent((prev) => ({
          ...prev,
          health: 94,
          risk: 'LOW',
          status: 'NORMAL'
        }));

        setDigitalTwin((prev) => ({
          ...prev,
          healthScore: 94,
          risk: 'LOW',
          status: 'NORMAL'
        }));

        addNotification({
          title: 'NOMINAL INSPECTION RECORDED',
          message: `${result.modelVersion} verified component surface integrity within tolerance.`,
          type: 'SUCCESS',
          targetTab: 'inspection'
        });

        refreshAuditLogs();
      }
    } catch (err) {
      console.error('[AppContext] Inspection failed:', err);
    } finally {
      setIsInspecting(false);
      setInspectionStepText('');
    }
  };

  // Sensor simulation
  const toggleSensorSimulation = () => {
    if (isSensorSimulating) {
      if (sensorIntervalRef.current) clearInterval(sensorIntervalRef.current);
      setIsSensorSimulating(false);
      setSensorData((prev) => ({ ...prev, isSimulating: false }));
    } else {
      setIsSensorSimulating(true);
      let step = 0;
      const vibSteps = [4.1, 4.6, 5.2, 6.1, 7.4];
      const tempSteps = [68, 71, 74, 78, 82];

      sensorIntervalRef.current = setInterval(async () => {
        step = (step + 1) % vibSteps.length;
        const currentVib = vibSteps[step];
        const currentTemp = tempSteps[step];
        const deviation = Math.round(((currentVib - 4.1) / 4.1) * 1000) / 10;

        const updated = await sensorService.stepSimulation(selectedComponent.code, {
          vibrationCurrent: currentVib,
          temperatureCurrent: currentTemp
        });

        setSensorData({
          ...updated,
          isSimulating: true,
          vibration: {
            ...updated.vibration,
            deviationPercent: deviation
          }
        });
      }, 1000);
    }
  };

  const resetSensorsToBaseline = async () => {
    if (sensorIntervalRef.current) clearInterval(sensorIntervalRef.current);
    setIsSensorSimulating(false);
    const baseline = await sensorService.resetToBaseline(selectedComponent.code);
    setSensorData(baseline);
  };

  // Evidence Fusion Scenario change
  const setScenario = async (scenario: EvidenceScenario) => {
    setEvidenceScenario(scenario);
    const analysis = await fusionService.getAnalysisForScenario(scenario);
    setFusionData(analysis);

    setSelectedComponent((prev) => ({
      ...prev,
      health: analysis.healthScore,
      risk: analysis.overallRisk,
      status: analysis.overallRisk === 'HIGH' ? 'ATTENTION REQUIRED' : analysis.overallRisk === 'MEDIUM' ? 'MONITORING' : 'NORMAL'
    }));

    const isHighRisk = analysis.healthScore < 75;
    setDigitalTwin((prev) => ({
      ...prev,
      healthScore: analysis.healthScore,
      risk: analysis.overallRisk,
      status: isHighRisk ? 'ATTENTION REQUIRED' : 'NORMAL'
    }));
  };

  // Recommendation actions
  const acceptRecommendation = async () => {
    const updated = await recommendationService.recordDecision(
      recommendation.id,
      'ACCEPTED',
      { technician: `${currentUser.employeeId} (${currentUser.name})` },
      isOffline
    );
    setRecommendation(updated);
    refreshAuditLogs();

    addNotification({
      title: 'RECOMMENDATION ACCEPTED',
      message: 'Decision recorded successfully. Ground inspection work order WO-8842 dispatched.',
      type: 'SUCCESS',
      targetTab: 'audit'
    });
  };

  const overrideRecommendation = async (reason: string, notes: string) => {
    const updated = await recommendationService.recordDecision(
      recommendation.id,
      'OVERRIDDEN',
      { reason, notes, technician: `${currentUser.employeeId} (${currentUser.name})` },
      isOffline
    );
    setRecommendation(updated);
    refreshAuditLogs();

    addNotification({
      title: 'AI RECOMMENDATION OVERRIDDEN',
      message: `Technician override recorded with rationale: "${reason}". Logged in audit trail.`,
      type: 'WARNING',
      targetTab: 'audit'
    });
  };

  const requestReviewRecommendation = async (priority: string, message: string) => {
    const updated = await recommendationService.recordDecision(
      recommendation.id,
      'REVIEW_REQUESTED',
      { notes: `[Priority: ${priority}] ${message}`, technician: `${currentUser.employeeId} (${currentUser.name})` },
      isOffline
    );
    setRecommendation(updated);
    refreshAuditLogs();

    addNotification({
      title: 'ENGINEERING REVIEW ESCALATED',
      message: `Supervisor alert dispatched with ${priority} priority to MRO Engineering lead.`,
      type: 'INFO',
      targetTab: 'recommendations'
    });
  };

  // Sync execution
  const runSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(0);

    await syncService.processSync(syncQueue, (prog, phase) => {
      setSyncProgress(prog);
      setSyncPhase(phase);
    });

    setSyncQueue([]);
    refreshAuditLogs();
    setIsSyncing(false);
    setIsOffline(false);

    addNotification({
      title: 'SYNCHRONIZATION COMPLETE',
      message: 'All local records successfully verified and committed to airline central MRO database.',
      type: 'SUCCESS',
      targetTab: 'sync'
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    settingsService.markNotificationRead(id);
  };

  const clearNotifications = () => {
    setNotifications([]);
    settingsService.clearNotifications();
  };

  // Complete Demo Orchestrator
  const startCompleteDemo = () => {
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    setIsDemoRunning(true);
    setCurrentDemoStepIndex(0);

    const runStep = (index: number) => {
      if (index >= DEMO_STEPS_DEF.length) {
        setIsDemoRunning(false);
        setActiveTab('audit');
        return;
      }

      setCurrentDemoStepIndex(index);
      setDemoSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < index ? 'completed' : idx === index ? 'active' : 'pending'
        }))
      );

      const targetStep = DEMO_STEPS_DEF[index];
      setActiveTab(targetStep.tab);

      switch (index) {
        case 0:
          setSelectedComponent(PRIMARY_COMPONENT);
          setScenario('NORMAL');
          break;
        case 1:
          break;
        case 2:
          runInspection(TURBINE_IMAGE_URI);
          break;
        case 3:
          setSensorData(INITIAL_SENSOR_DATA);
          break;
        case 4:
          setScenario('MULTI_SOURCE');
          break;
        case 5:
          break;
        case 6:
          setDigitalTwin(INITIAL_DIGITAL_TWIN);
          break;
        case 7:
          break;
        case 8:
          acceptRecommendation();
          break;
        case 9:
          setIsOffline(true);
          break;
        case 10:
          runSync();
          break;
        case 11:
          break;
      }

      demoTimerRef.current = setTimeout(() => {
        runStep(index + 1);
      }, 3500);
    };

    runStep(0);
  };

  const stopCompleteDemo = () => {
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    setIsDemoRunning(false);
  };

  const resetAllData = async () => {
    stopCompleteDemo();
    if (sensorIntervalRef.current) clearInterval(sensorIntervalRef.current);
    await settingsService.resetDatabase();
    setIsOffline(false);
    setIsSyncing(false);
    setIsInspecting(false);
    setIsSensorSimulating(false);
    setSyncQueue(INITIAL_SYNC_QUEUE);
    setInspectionData(INITIAL_INSPECTION_DATA);
    setSensorData(INITIAL_SENSOR_DATA);
    setFusionData(FUSION_SCENARIOS.MULTI_SOURCE);
    setEvidenceScenario('MULTI_SOURCE');
    setDigitalTwin(INITIAL_DIGITAL_TWIN);
    setRecommendation(INITIAL_RECOMMENDATION);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedComponent(PRIMARY_COMPONENT);
    setActiveTab('overview');
  };

  useEffect(() => {
    return () => {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
      if (sensorIntervalRef.current) clearInterval(sensorIntervalRef.current);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        activeTab,
        setActiveTab,
        selectedAircraft,
        selectedComponent,
        setSelectedComponent,
        isOffline,
        toggleOffline,
        syncQueue,
        isSyncing,
        syncProgress,
        syncPhase,
        runSync,
        inspectionData,
        isInspecting,
        inspectionStepText,
        runInspection,
        sensorData,
        isSensorSimulating,
        toggleSensorSimulation,
        resetSensorsToBaseline,
        fusionData,
        evidenceScenario,
        setScenario,
        digitalTwin,
        recommendation,
        acceptRecommendation,
        overrideRecommendation,
        requestReviewRecommendation,
        auditLogs,
        refreshAuditLogs,
        notifications,
        markNotificationRead,
        clearNotifications,
        isDemoRunning,
        currentDemoStepIndex,
        demoSteps,
        startCompleteDemo,
        stopCompleteDemo,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { DemoFloatingPanel } from './components/layout/DemoFloatingPanel';
import { LoginScreen } from './pages/LoginScreen';
import { OverviewPage } from './pages/OverviewPage';
import { AircraftPage } from './pages/AircraftPage';
import { ComponentDetailPage } from './pages/ComponentDetailPage';
import { InspectionPage } from './pages/InspectionPage';
import { SensorsPage } from './pages/SensorsPage';
import { EvidenceFusionPage } from './pages/EvidenceFusionPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { HistoryPage } from './pages/HistoryPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { SyncCenterPage } from './pages/SyncCenterPage';
import { EngineeringDashboardPage } from './pages/EngineeringDashboardPage';
import { ModelRegistryPage } from './pages/ModelRegistryPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeTab } = useApp();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'aircraft':
        return <AircraftPage />;
      case 'components':
        return <ComponentDetailPage />;
      case 'inspection':
        return <InspectionPage />;
      case 'sensors':
        return <SensorsPage />;
      case 'evidence-fusion':
        return <EvidenceFusionPage />;
      case 'digital-twin':
        return <DigitalTwinPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'history':
        return <HistoryPage />;
      case 'audit':
        return <AuditTrailPage />;
      case 'sync':
        return <SyncCenterPage />;
      case 'engineering':
        return <EngineeringDashboardPage />;
      case 'model-registry':
        return <ModelRegistryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex h-screen bg-[#07090E] text-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Persistent Top Navigation Bar */}
        <TopBar />

        {/* Offline Simulation Notification Banner */}
        <OfflineBanner />

        {/* Scrollable Viewport Stage */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6 bg-[#07090E]">
          <div className="max-w-7xl mx-auto pb-12">
            {renderActiveScreen()}
          </div>
        </main>
      </div>

      {/* Floating Demo Walkthrough Status Widget */}
      <DemoFloatingPanel />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

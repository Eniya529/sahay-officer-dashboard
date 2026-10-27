import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { WhySahayModal } from './components/common/WhySahayModal';
import { ResponsibleAiModal } from './components/common/ResponsibleAiModal';
import { FinalDemoSummary } from './components/common/FinalDemoSummary';

// Firebase
import { db } from './services/firebase';

// Public / Victim Pages
import { HomePage } from './components/victim/HomePage';
import { LiveAssessmentModule } from './components/victim/LiveAssessmentModule';
import { ScenarioLibraryPage } from './components/victim/ScenarioLibraryPage';
import { TrackComplaintPage } from './components/victim/TrackComplaintPage';
import { HelpSupportPage } from './components/victim/HelpSupportPage';

// Officer Pages & Layout
import { OfficerLayout } from './components/officer/OfficerLayout';
import { OfficerDashboard } from './components/officer/OfficerDashboard';
import { CaseManagementPage } from './components/officer/CaseManagementPage';
import { CaseIntelligencePage } from './components/officer/CaseIntelligencePage';
import { OfficerAllocationPage } from './components/officer/OfficerAllocationPage';
import { FollowUpsView } from './components/officer/FollowUpsView';
import { AnalyticsPage } from './components/officer/AnalyticsPage';
import { AuditLogsPage } from './components/officer/AuditLogsPage';

const MainContainer: React.FC = () => {
  const { currentRoute, setSelectedCaseId, setCurrentRoute } = useApp();

  // Firebase connection test
  console.log('Firebase Firestore connected:', db);

  const isOfficerArea = currentRoute.startsWith('officer');

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentRoute('officer-case-detail');
  };

  if (isOfficerArea) {
    return (
      <OfficerLayout>
        {/* Global Modals */}
        <WhySahayModal />
        <ResponsibleAiModal />

        {/* OFFICER ROUTES */}
        {currentRoute === 'officer-dash' && (
          <OfficerDashboard onSelectCase={handleSelectCase} />
        )}

        {currentRoute === 'officer-cases' && (
          <CaseManagementPage onSelectCase={handleSelectCase} />
        )}

        {currentRoute === 'officer-case-detail' && (
          <CaseIntelligencePage
            onBackToDashboard={() => setCurrentRoute('officer-cases')}
          />
        )}

        {currentRoute === 'officer-allocation' && (
          <OfficerAllocationPage />
        )}

        {currentRoute === 'officer-followups' && (
          <FollowUpsView />
        )}

        {currentRoute === 'officer-analytics' && (
          <AnalyticsPage />
        )}

        {currentRoute === 'officer-audit-logs' && (
          <AuditLogsPage />
        )}

        {/* Responsible AI System Philosophy Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <FinalDemoSummary />
        </div>
      </OfficerLayout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      
      {/* Top Header */}
      <Header />

      {/* Global Modals */}
      <WhySahayModal />
      <ResponsibleAiModal />

      {/* Main Page Area Matching Current Route */}
      <main className="flex-1 pb-12">
        
        {/* PUBLIC / VICTIM SIDE ROUTES */}
        {currentRoute === 'home' && <HomePage />}

        {currentRoute === 'victim-report' && (
          <LiveAssessmentModule />
        )}

        {currentRoute === 'victim-scenarios' && (
          <ScenarioLibraryPage />
        )}

        {currentRoute === 'victim-status' && (
          <TrackComplaintPage />
        )}

        {currentRoute === 'victim-help' && (
          <HelpSupportPage />
        )}

        {/* Responsible AI System Philosophy Banner */}
        <FinalDemoSummary />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">
          SAHAY — Smart AI-Assisted Human Support & Response System
        </p>

        <p>
          Developed by Team HUMANOVA for NHAA (14566) Ecosystem Decision-Support Layer
        </p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContainer />
    </AppProvider>
  );
}

export default App;
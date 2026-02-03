import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { LibraryView } from './components/LibraryView';
import { AnalyzeView } from './components/AnalyzeView';
import { PlannerView } from './components/PlannerView';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { Sidebar, MobileNav } from './components/Sidebar';
import { AnalysisModal } from './components/AnalysisModal';
import { Toast, useToast } from './components/Toast';

export default function App() {
  const [appMode, setAppMode] = useState<'dark' | 'light'>('dark'); // Start with dark mode
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Light theme states (legacy)
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [analyzingResourceId, setAnalyzingResourceId] = useState<string | null>(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    // Apply theme class to body
    if (appMode === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [appMode]);

  const handleLogin = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsTransitioning(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsTransitioning(false);
    }, 500);
  };

  // Legacy light theme handlers
  const handleGetStarted = () => {
    setIsSignedIn(true);
    setActiveView('analyze');
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const handleAnalyze = (id: string) => {
    setAnalyzingResourceId(id);
  };

  const handleAddToPlan = (id: string) => {
    showToast('Material added to study plan', 'success');
  };

  const handleAnalysisComplete = (result: any) => {
    showToast('Analysis complete! Material added to library.', 'success');
    setAnalyzingResourceId(null);
  };

  // Dark theme app (new login/home)
  if (appMode === 'dark') {
    return (
      <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <HomePage onLogout={handleLogout} />
        )}
      </div>
    );
  }

  // Light theme app (legacy STUDIFY)
  if (!isSignedIn) {
    return <LandingView onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-[1320px] mx-auto">
            {activeView === 'dashboard' && <DashboardView onNavigate={handleViewChange} />}
            {activeView === 'library' && (
              <LibraryView onAnalyze={handleAnalyze} onAddToPlan={handleAddToPlan} />
            )}
            {activeView === 'analyze' && <AnalyzeView />}
            {activeView === 'planner' && <PlannerView />}
            {activeView === 'calendar' && <CalendarView />}
            {activeView === 'settings' && <SettingsView />}
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav activeView={activeView} onViewChange={handleViewChange} />
      </div>

      {/* Analysis Modal */}
      <AnalysisModal
        isOpen={analyzingResourceId !== null}
        onClose={() => setAnalyzingResourceId(null)}
        fileName={`Resource ${analyzingResourceId}`}
        onComplete={handleAnalysisComplete}
      />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
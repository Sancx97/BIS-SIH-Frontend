import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Dashboard from './pages/Dashboard';
import AskBIS from './pages/AskBIS';
import ComplianceAnalyzer from './pages/ComplianceAnalyzer';
import DocumentAuditor from './pages/DocumentAuditor';
import ProductScanner from './pages/ProductScanner';
import StandardExplorer from './pages/StandardExplorer';
import RegulatoryAlerts from './pages/RegulatoryAlerts';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [personaMode, setPersonaMode] = useState('producer');
  const [prefilledQuery, setPrefilledQuery] = useState('');

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrefillQuery = (query) => {
    setPrefilledQuery(query);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      // HOME
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={handleNavigate}
            onPrefillQuery={handlePrefillQuery}
            personaMode={personaMode}
            currentLanguage={currentLanguage}
          />
        );

      // =========================
      // KNOW MODULE
      // =========================
      case 'know':
      case 'ask':
        return (
          <AskBIS
            initialQuery={prefilledQuery}
            personaMode={personaMode}
            currentLanguage={currentLanguage}
          />
        );

      case 'explorer':
        return (
          <StandardExplorer
            initialQuery={prefilledQuery}
            personaMode={personaMode}
          />
        );

      // =========================
      // COMPLY MODULE
      // =========================
      case 'comply':
      case 'analyzer':
        return (
          <ComplianceAnalyzer
            initialQuery={prefilledQuery}
            personaMode={personaMode}
          />
        );

      case 'auditor':
        return <DocumentAuditor personaMode={personaMode} />;

      case 'alerts':
        return <RegulatoryAlerts personaMode={personaMode} />;

      // =========================
      // VERIFY MODULE
      // =========================
      case 'verify':
      case 'scanner':
        return <ProductScanner personaMode={personaMode} />;

      // =========================
      // FALLBACK
      // =========================
      default:
        return (
          <Dashboard
            onNavigate={handleNavigate}
            onPrefillQuery={handlePrefillQuery}
            personaMode={personaMode}
            currentLanguage={currentLanguage}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans antialiased">

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleNavigate}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Application */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">

        <Header
          activeTab={activeTab}
          onMobileMenuToggle={() => setMobileOpen(true)}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          personaMode={personaMode}
          onPersonaChange={setPersonaMode}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderActivePage()}
        </main>

      </div>
    </div>
  );
}

export default App;
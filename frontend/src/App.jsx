import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Import Pages
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
  const [personaMode, setPersonaMode] = useState('producer'); // 'producer' | 'consumer' | 'auditor'
  const [prefilledQuery, setPrefilledQuery] = useState('');

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrefillQuery = (query) => {
    setPrefilledQuery(query);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={handleNavigate}
            onPrefillQuery={handlePrefillQuery}
            personaMode={personaMode}
            currentLanguage={currentLanguage}
          />
        );
      case 'ask':
        return <AskBIS initialQuery={prefilledQuery} personaMode={personaMode} />;
      case 'analyzer':
        return <ComplianceAnalyzer initialQuery={prefilledQuery} personaMode={personaMode} />;
      case 'auditor':
        return <DocumentAuditor personaMode={personaMode} />;
      case 'scanner':
        return <ProductScanner personaMode={personaMode} />;
      case 'explorer':
        return <StandardExplorer initialQuery={prefilledQuery} personaMode={personaMode} />;
      case 'alerts':
        return <RegulatoryAlerts personaMode={personaMode} />;
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
      {/* Persistent Responsive Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleNavigate}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Viewport */}
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
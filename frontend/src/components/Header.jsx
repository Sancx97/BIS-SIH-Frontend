import React, { useEffect, useState } from 'react';
import { ShieldCheck, Globe, Activity, Menu, Building2, User, Microscope, Award, AlertCircle } from 'lucide-react';
import { checkBackendHealth } from '../services/api';
import { LANGUAGES } from '../data/demoData';

export default function Header({ activeTab, onMobileMenuToggle, currentLanguage, onLanguageChange, personaMode, onPersonaChange }) {
  const [backendStatus, setBackendStatus] = useState({ online: false, message: 'Checking API...' });

  useEffect(() => {
    async function verifyHealth() {
      const result = await checkBackendHealth();
      setBackendStatus(result);
    }
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const pageTitles = {
    dashboard: 'Compliance Operating View',
    ask: 'Ask BIS Copilot (RAG Assistance)',
    analyzer: 'Product Compliance Assessment & Simulator',
    auditor: 'Document Compliance Auditor & Form Pre-Fill',
    scanner: 'ISI Mark Authenticity & CML Verifier',
    explorer: 'Indian Standards Directory (IS Catalogue)',
    alerts: 'Quality Control Orders (QCO) & Regulatory Notices'
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-300 shadow-xs">
      {/* Top Accent Line */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* Top Banner (Professional SIH Wording as requested) */}
      <div className="bg-[#0B2545] text-white px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-amber-300 tracking-wide">SIH 2026 • Intelligent BIS Compliance Assistant</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-200">BIS Compliance Copilot</span>
          </div>

          {/* Prominent Trust Disclaimer */}
          <div className="flex items-center gap-1.5 text-[11px] text-amber-200 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>AI-generated guidance • Verify critical decisions with official BIS sources</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="px-4 sm:px-6 py-3 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
          {/* Left: Mobile Menu & Copilot Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0B2545] text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold shadow-xs shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold text-[#0B2545] tracking-tight leading-none">
                  BIS Compliance Copilot
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  AI-powered assistance for Indian Standards & BIS compliance • {pageTitles[activeTab] || 'Copilot View'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Copilot Mode, API Status & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Copilot Perspective Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300 text-xs">
              <button
                onClick={() => onPersonaChange && onPersonaChange('producer')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                  personaMode === 'producer'
                    ? 'bg-[#0B2545] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="Manufacturer Perspective"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Industry View</span>
              </button>
              <button
                onClick={() => onPersonaChange && onPersonaChange('consumer')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                  personaMode === 'consumer'
                    ? 'bg-[#138808] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="Consumer Safety Perspective"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Consumer View</span>
              </button>
              <button
                onClick={() => onPersonaChange && onPersonaChange('auditor')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                  personaMode === 'auditor'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="Auditor Perspective"
              >
                <Microscope className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Auditor View</span>
              </button>
            </div>

            {/* Backend Health Status */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono font-semibold ${
                backendStatus.online
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-amber-50 border-amber-300 text-amber-800'
              }`}
              title={backendStatus.message}
            >
              <Activity className={`w-3.5 h-3.5 ${backendStatus.online ? 'animate-pulse text-emerald-600' : 'text-amber-600'}`} />
              <span>{backendStatus.online ? 'API Online' : 'Standby'}</span>
            </div>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-slate-500 absolute left-2.5 pointer-events-none" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="pl-8 pr-3 py-1 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B2545] cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

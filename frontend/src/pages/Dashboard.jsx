import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  BarChart3,
  FileCheck2,
  QrCode,
  CheckSquare,
  ShieldCheck,
  Bell,
  ArrowRight,
  Award,
  Building2,
  AlertCircle,
  Database,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  HelpCircle,
  Brain,
  Loader2
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import ComplianceScore from '../components/ComplianceScore';
import { getTranslation } from '../utils/i18n';
import { MOCK_ANALYSIS_RESULT } from '../data/demoData';

export default function Dashboard({ onNavigate, onPrefillQuery, personaMode, currentLanguage = 'en' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [isAiUnderstanding, setIsAiUnderstanding] = useState(false);
  const [aiTargetTab, setAiTargetTab] = useState('analyzer');

  const t = (key) => getTranslation(currentLanguage, key);

  // Click-to-fill handler (Requirement 2)
  const handleFillPrompt = (promptText) => {
    setSearchQuery(promptText);
  };

  // AI Understanding Transition & Navigation (Always clickable!)
  const handleExecuteWithAiTransition = (targetTab, queryToUse = null) => {
    const q = queryToUse || searchQuery || "I manufacture stainless steel pressure cookers";

    setAiTargetTab(targetTab);
    setIsAiUnderstanding(true);

    setTimeout(() => {
      setIsAiUnderstanding(false);
      if (onPrefillQuery) onPrefillQuery(q.trim());
      setActiveWorkspace(MOCK_ANALYSIS_RESULT);
      onNavigate(targetTab);
    }, 1000);
  };

  const examplePrompts = [
    { label: t('prompt1'), query: 'I manufacture stainless steel pressure cookers' },
    { label: t('prompt2'), query: 'Check my BIS test report' },
    { label: t('prompt3'), query: 'Is this ISI mark genuine?' },
    { label: t('prompt4'), query: 'What happens if I change the material?' }
  ];

  const quickActions = [
    {
      title: "Find Applicable Indian Standard",
      subtitle: "Locate IS codes & testing clauses",
      icon: Search,
      tab: "explorer"
    },
    {
      title: "Check Certification Scheme (ISI / CRS)",
      subtitle: "Scheme-I vs Scheme-II rules & QCOs",
      icon: ShieldCheck,
      tab: "analyzer"
    },
    {
      title: "Audit Test Report / Specification PDF",
      subtitle: "Scan NABL lab parameters & missing data",
      icon: FileCheck2,
      tab: "auditor"
    },
    {
      title: "Verify ISI Mark & CML Code",
      subtitle: "OCR verify license & detect fake marks",
      icon: QrCode,
      tab: "scanner"
    },
    {
      title: "Simulate Material & Capacity Changes",
      subtitle: "What-If regulatory impact analysis",
      icon: CheckSquare,
      tab: "analyzer"
    },
    {
      title: "View Regulatory Changes & QCO Notices",
      subtitle: "DPIIT & MeitY mandatory notices",
      icon: Bell,
      tab: "alerts"
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* SIH Prototype Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="font-medium">
            {t('disclaimer')}
          </span>
        </div>
        <span className="bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded text-[10px] shrink-0 font-mono">
          {t('demoBadge')}
        </span>
      </div>

      {/* Hero Section */}
      <div className="rounded-2xl bg-[#0B2545] text-white p-5 sm:p-6 border border-slate-700 shadow-sm relative overflow-hidden transition-all">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white/10 border border-white/20 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>BIS Compliance Copilot</span>
          </div>

          <h1 className="text-lg sm:text-2xl font-extrabold text-white leading-snug">
            {t('heroTitle')}
          </h1>

          {/* Search Box */}
          <div className="space-y-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleExecuteWithAiTransition('ask');
                }}
                placeholder={t('heroPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 border border-slate-300 shadow-xs"
              />
            </div>

            {/* Click-to-fill Example Prompts */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Click to fill example:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {examplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFillPrompt(p.query)}
                    className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-medium transition-all hover:border-amber-300 active:scale-[0.98] text-left"
                    title="Click to fill search bar"
                  >
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Action Buttons (Always Clickable!) */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => handleExecuteWithAiTransition('analyzer')}
                disabled={isAiUnderstanding}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{t('analyzeBtn')}</span>
              </button>

              <button
                onClick={() => handleExecuteWithAiTransition('ask')}
                disabled={isAiUnderstanding}
                className="px-5 py-2.5 rounded-lg bg-[#134074] hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-xs sm:text-sm border border-blue-400/40 transition-all shadow-xs active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('askBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual AI Understanding Transition Moment */}
      {isAiUnderstanding && (
        <div className="p-5 rounded-2xl bg-[#0B2545] text-white border border-amber-400/50 shadow-md space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
            <Brain className="w-4 h-4 animate-pulse" />
            <span>AI Natural Language Understanding Pipeline...</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-white/10 border border-white/10 flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Product Identified</span>
            </div>
            <div className="p-2 rounded bg-white/10 border border-white/10 flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Industry Context Detected</span>
            </div>
            <div className="p-2 rounded bg-white/10 border border-white/10 flex items-center gap-1.5 text-amber-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>Mapping IS Requirements</span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Compliance Status / Workspace Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0B2545] text-amber-400 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B2545]">
                {t('workspaceTitle')}
              </h3>
              <p className="text-xs text-slate-500">Live active product assessment session</p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300 font-mono">
            {activeWorkspace ? 'Active Analysis' : 'Workspace Idle'}
          </span>
        </div>

        {!activeWorkspace ? (
          <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-300 space-y-3">
            <HelpCircle className="w-7 h-7 text-slate-400 mx-auto" />
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              {t('workspaceEmpty')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('I manufacture stainless steel pressure cookers');
                setActiveWorkspace(MOCK_ANALYSIS_RESULT);
              }}
              className="px-3.5 py-2 bg-[#0B2545] text-white rounded-lg font-bold text-xs hover:bg-blue-950 transition-all shadow-xs"
            >
              Fill Example Prompt (Pressure Cooker)
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-bold block">Assessed Product</span>
                <span className="font-extrabold text-slate-900 text-sm">{activeWorkspace.product}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Applicable Standard</span>
                <span className="font-extrabold text-[#0B2545] text-sm font-mono">{activeWorkspace.standardNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Certification Scheme</span>
                <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-block mt-0.5">
                  {activeWorkspace.certificationScheme}
                </span>
              </div>
              <div className="flex items-center justify-end">
                <ComplianceScore score={activeWorkspace.complianceScore} size={75} strokeWidth={7} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-emerald-300 bg-emerald-50/60 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950">Standard Identified:</span>
                  <p className="text-slate-700 mt-0.5">IS 2347:2017 Domestic Pressure Cookers Specification</p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-amber-300 bg-amber-50/60 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-950">Lab Testing Status:</span>
                  <p className="text-slate-700 mt-0.5">Hydrostatic burst test & rubber gasket reports pending submission</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-200">
              <span className="text-slate-600">Next Action: Send sample cookers to NABL lab for Clause 5.1 testing.</span>
              <button
                onClick={() => onNavigate('analyzer')}
                className="font-bold text-[#0B2545] hover:underline flex items-center gap-1"
              >
                <span>Open Full Analyzer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Core Feature Modules Grid */}
      <div>
        <h3 className="text-base font-bold text-[#0B2545] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-600" /> BIS Compliance Features
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            title="Ask BIS Copilot"
            description="Instant RAG guidance on Indian Standards, ISI marking & QCO rules."
            icon={MessageSquare}
            badge="Live RAG"
            onClick={() => onNavigate('ask')}
            primary={true}
          />
          <FeatureCard
            title="Compliance Analyzer"
            description="Identify IS codes, test labs & simulate product design changes."
            icon={BarChart3}
            badge="What-If Engine"
            onClick={() => onNavigate('analyzer')}
          />
          <FeatureCard
            title="Document Auditor"
            description="Audit NABL test reports & pre-fill BIS Application Form 1."
            icon={FileCheck2}
            badge="Form Pre-Fill"
            onClick={() => onNavigate('auditor')}
          />
          <FeatureCard
            title="ISI Mark Authenticity"
            description="Detect fake ISI marks & verify CML license codes."
            icon={QrCode}
            badge="Fake Detector"
            onClick={() => onNavigate('scanner')}
          />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#0B2545] uppercase tracking-wider">
            Key Compliance Workflows
          </h3>
          <span className="text-xs font-semibold text-slate-500">Interactive Workflows</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate(action.tab)}
                className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-300 hover:border-[#0B2545] hover:-translate-y-0.5 cursor-pointer transition-all duration-200 hover:shadow-sm"
              >
                <div className="p-3 rounded-lg bg-slate-100 text-[#0B2545] group-hover:bg-[#0B2545] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0B2545] transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {action.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B2545] group-hover:translate-x-1 transition-all mt-1" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Honest RAG Indicators */}
      <div className="p-5 rounded-xl bg-white border border-slate-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center shadow-xs">
        <div className="p-2 border-b sm:border-b-0 sm:border-r border-slate-200">
          <Database className="w-5 h-5 text-[#0B2545] mx-auto mb-1" />
          <p className="text-xs font-extrabold text-[#0B2545]">RAG Knowledge Base</p>
          <p className="text-[11px] text-slate-600 mt-0.5">BIS Sources Connected</p>
        </div>

        <div className="p-2 border-b sm:border-b-0 lg:border-r border-slate-200">
          <ShieldCheck className="w-5 h-5 text-emerald-700 mx-auto mb-1" />
          <p className="text-xs font-extrabold text-slate-900">Indexed Knowledge</p>
          <p className="text-[11px] text-slate-600 mt-0.5">BIS Standards & Notifications</p>
        </div>

        <div className="p-2 border-b sm:border-b-0 sm:border-r border-slate-200">
          <Award className="w-5 h-5 text-amber-700 mx-auto mb-1" />
          <p className="text-xs font-extrabold text-slate-900">QCO Directory</p>
          <p className="text-[11px] text-slate-600 mt-0.5">Mandatory Compliance Orders</p>
        </div>

        <div className="p-2">
          <MessageSquare className="w-5 h-5 text-[#134074] mx-auto mb-1" />
          <p className="text-xs font-extrabold text-[#134074]">Copilot Assistance</p>
          <p className="text-[11px] text-slate-600 mt-0.5">Automated RAG Guidance</p>
        </div>
      </div>
    </div>
  );
}

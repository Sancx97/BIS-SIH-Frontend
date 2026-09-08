import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Sliders,
  CheckSquare,
  Sparkles,
  GitCommit,
  ArrowDown,
  Layers,
  Award
} from 'lucide-react';
import ComplianceScore from '../components/ComplianceScore';
import ComplianceCard from '../components/ComplianceCard';
import SourceCard from '../components/SourceCard';
import { MOCK_ANALYSIS_RESULT } from '../data/demoData';
import { analyzeCompliance } from '../services/api';

export default function ComplianceAnalyzer({ initialQuery }) {
  const [activeTabMode, setActiveTabMode] = useState('workflow'); // 'workflow' | 'map' | 'interview' | 'whatif'
  const [productInput, setProductInput] = useState(initialQuery || 'Pressure cooker manufactured in Maharashtra');
  const [analysis, setAnalysis] = useState(MOCK_ANALYSIS_RESULT);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  async function handleComplianceAssessment() {
  if (!productInput.trim()) {
    setError('Please enter a product or manufacturing specification.');
    return;
  }

  setIsAnalyzing(true);
  setError('');

  try {
    const result = await analyzeCompliance(productInput);
    setAnalysis(result);
    setActiveWorkflowStep(0);
  } catch (err) {
    setError(err.message || 'Unable to complete compliance assessment.');
  } finally {
    setIsAnalyzing(false);
  }
}

  // Multi-step Workflow Stages (Requirement 5)
  const workflowStages = [
    { title: 'Product', detail: 'Pressure Cooker' },
    { title: 'Standards', detail: 'IS 2347:2017' },
    { title: 'Certification', detail: 'Scheme-I ISI' },
    { title: 'QCO Mandate', detail: 'Mandatory' },
    { title: 'Testing', detail: 'Burst Test' },
    { title: 'Documents', detail: 'Form 1 & Lab' },
    { title: 'Score', detail: '82%' },
    { title: 'Gaps', detail: 'Lab Pending' },
    { title: 'Action Plan', detail: 'Submit Lab' }
  ];

  // Guided Interview State
  const [interviewStep, setInterviewStep] = useState(0);
  const [interviewAnswers, setInterviewAnswers] = useState({
    category: 'Household Electrical',
    material: 'Stainless Steel Grade 304',
    powerRating: '1500W'
  });

  // What-If Simulator State
  const [whatIfMaterial, setWhatIfMaterial] = useState('Stainless Steel');
  const [whatIfCapacity, setWhatIfCapacity] = useState('5 Litre');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Top Header & View Modes */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B2545] flex items-center gap-2">
            Compliance Analyzer & Workflow Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Flagship multi-step compliance engine, interactive relationship flowchart, and What-If design simulator.
          </p>
        </div>

        {/* Feature Sub-Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-300 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTabMode('workflow')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTabMode === 'workflow'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Multi-Step Workflow
          </button>

          <button
            onClick={() => setActiveTabMode('map')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
              activeTabMode === 'map'
                ? 'bg-[#134074] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Compliance Map</span>
          </button>

          <button
            onClick={() => setActiveTabMode('interview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
              activeTabMode === 'interview'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guided Discovery</span>
          </button>

          <button
            onClick={() => setActiveTabMode('whatif')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
              activeTabMode === 'whatif'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>"What-If?" Simulator</span>
          </button>
        </div>
      </div>

      {/* MODE 1: Flagship Multi-Step Guided Workflow (Requirement 5) */}
      {activeTabMode === 'workflow' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Enter Product Name or Manufacturing Specification
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="e.g. Stainless steel pressure cooker in Maharashtra..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
              />
              <button
                onClick={handleComplianceAssessment}
                disabled={isAnalyzing}
                className="px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-blue-950 text-white font-bold text-xs shadow-xs transition-all shrink-0 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Run Compliance Assessment'}</span>
              </button>
              
              {error && (
                <p className="text-sm text-red-600 font-semibold">
                  ⚠️ {error}
                </p>
              )}
            </div>
          </div>

          {/* Stepper Pipeline Bar (Requirement 5) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-xs overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] gap-2">
              {workflowStages.map((stage, idx) => {
                const isActive = activeWorkflowStep === idx;
                const isPast = idx < activeWorkflowStep;
                return (
                  <React.Fragment key={idx}>
                    <div
                      onClick={() => setActiveWorkflowStep(idx)}
                      className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#0B2545] text-white shadow-xs font-bold scale-[1.03]'
                          : isPast
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold opacity-80">{idx + 1}. {stage.title}</span>
                      <span className="text-xs font-extrabold">{stage.detail}</span>
                    </div>
                    {idx < workflowStages.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Main Assessment Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Card */}
              <div className="p-6 rounded-2xl bg-[#0B2545] text-white border border-slate-700 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="px-3 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                    {analysis.certificationScheme}
                  </span>
                  <h3 className="text-xl font-bold text-white">{analysis.product}</h3>
                  <p className="text-xs text-blue-200">
                    Applicable Standard: <b className="text-amber-300 font-mono">{analysis.standardNumber}</b> — {analysis.standardTitle}
                  </p>
                  <div className="pt-1">
                    <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/80 border border-rose-800 px-2.5 py-1 rounded-full">
                      ⚠️ {analysis.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
                  <ComplianceScore score={analysis.complianceScore} />
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-4">
                <h4 className="text-base font-bold text-[#0B2545]">
                  Compliance Status Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.statusChecklist.map((item, idx) => (
                    <ComplianceCard key={idx} title={item.title} status={item.status} detail={item.detail} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right References Drawer */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-300 space-y-4">
                <h4 className="text-sm font-bold text-[#0B2545] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Evidence & Primary Sources
                </h4>
                <div className="p-3 bg-white rounded-xl border border-slate-300 text-xs space-y-1">
                  <p className="font-bold text-slate-900">{analysis.primarySource.title}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{analysis.primarySource.url}</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 inline-block mt-1">
                    Verified Primary Source
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Compliance Map Visual Flowchart (Requirement 6) */}
      {activeTabMode === 'map' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-[#0B2545] text-amber-400 flex items-center justify-center font-bold">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B2545]">
                Interactive Compliance Relationship Map
              </h3>
              <p className="text-xs text-slate-500">Visual dependency flowchart from raw product to final compliance license.</p>
            </div>
          </div>

          {/* Vertical Visual Flowchart (Requirement 6) */}
          <div className="max-w-2xl mx-auto space-y-3 py-4">
            {/* Node 1: Product */}
            <div className="p-4 rounded-xl bg-[#0B2545] text-white text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-amber-300">1. Target Product</span>
              <h4 className="text-sm font-extrabold">Domestic Pressure Cooker (Stainless Steel)</h4>
            </div>

            <ArrowDown className="w-5 h-5 text-[#0B2545] mx-auto animate-bounce" />

            {/* Node 2: Applicable Standard */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-300 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-blue-800">2. Applicable Indian Standard</span>
              <h4 className="text-sm font-extrabold text-[#0B2545]">IS 2347:2017</h4>
              <p className="text-xs text-slate-600">Domestic Pressure Cookers — Specification</p>
            </div>

            <ArrowDown className="w-5 h-5 text-[#0B2545] mx-auto animate-bounce" />

            {/* Node 3: Certification Scheme */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-amber-800">3. Certification Scheme & QCO</span>
              <h4 className="text-sm font-extrabold text-amber-950">Scheme-I (ISI Mark) — Mandatory QCO</h4>
              <p className="text-xs text-slate-600">Factory Quality Inspection + Product Testing Required</p>
            </div>

            <ArrowDown className="w-5 h-5 text-[#0B2545] mx-auto animate-bounce" />

            {/* Node 4: NABL Testing Parameters */}
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-300 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-purple-800">4. NABL Lab Testing Parameters</span>
              <h4 className="text-sm font-extrabold text-purple-950">Hydrostatic Burst Test & Gasket Safety (IS 7466)</h4>
            </div>

            <ArrowDown className="w-5 h-5 text-[#0B2545] mx-auto animate-bounce" />

            {/* Node 5: Mandatory Documents */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-700">5. Required Documents</span>
              <h4 className="text-sm font-extrabold text-slate-900">Manakonline Form 1 + NABL Test Certificate</h4>
            </div>

            <ArrowDown className="w-5 h-5 text-emerald-600 mx-auto animate-bounce" />

            {/* Node 6: Compliance Status */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-400 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-800">6. Compliance Readiness</span>
              <h4 className="text-sm font-extrabold text-emerald-950">82% Compliant — Pending Test Submission</h4>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: Guided Discovery Wizard */}
      {activeTabMode === 'interview' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-300 space-y-6 max-w-2xl mx-auto shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Guided Standard Discovery</h3>
              <p className="text-xs text-slate-500">Answer 3 simple questions for automated standard identification.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <label className="font-bold text-slate-800 block text-sm">Select Product Category:</label>
            <div className="grid grid-cols-2 gap-3">
              {['Household Appliances', 'Electronics & IT', 'Batteries & Storage', 'Consumer Toys'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTabMode('workflow')}
                  className="p-3 rounded-lg border border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-[#0B2545] font-semibold text-left transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: What-If Simulator */}
      {activeTabMode === 'whatif' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-300 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">"What-If?" Impact Simulator</h3>
              <p className="text-xs text-slate-500">Simulate how material or capacity changes modify IS test parameters.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <label className="font-bold text-slate-800">Raw Material</label>
              <select
                value={whatIfMaterial}
                onChange={(e) => setWhatIfMaterial(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 font-semibold"
              >
                <option value="Stainless Steel">Stainless Steel Grade 304</option>
                <option value="Aluminum Alloy">Aluminum Alloy (IS 21)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-800">Capacity</label>
              <select
                value={whatIfCapacity}
                onChange={(e) => setWhatIfCapacity(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 font-semibold"
              >
                <option value="5 Litre">5 Litre Domestic</option>
                <option value="12 Litre Commercial">12 Litre Commercial</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-2">
            <span className="font-bold text-amber-900 block">Simulation Impact Result:</span>
            <p className="text-slate-700">
              Selected <b>{whatIfMaterial}</b> ({whatIfCapacity}): Requires Clause 4.1 corrosion test and 3.0 bar hydrostatic burst test under IS 2347:2017.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

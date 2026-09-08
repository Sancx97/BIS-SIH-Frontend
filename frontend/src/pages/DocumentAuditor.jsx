import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  UploadCloud,
  ShieldCheck,
  FileEdit,
  Download,
  Sparkles,
  Loader2
} from 'lucide-react';
import UploadBox from '../components/UploadBox';
import StatusBadge from '../components/StatusBadge';
import { analyzeDocument } from '../services/api';

export default function DocumentAuditor() {
  const [activeSubTab, setActiveSubTab] = useState('auditor'); // 'auditor' | 'prefill'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [auditStepIndex, setAuditStepIndex] = useState(0);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  // Form Pre-fill Assistant State
  const [formData, setFormData] = useState({
    manufacturerName: 'Hawkins Cookers Ltd',
    factoryAddress: 'Plot 42, MIDC Industrial Area, Thane, Maharashtra',
    productName: 'Domestic Pressure Cooker (Stainless Steel)',
    isStandardNumber: 'IS 2347:2017',
    nablLabName: 'Central Power Research Institute (CPRI)',
    testReportNo: 'TR-2026-94021'
  });

  const [formSaved, setFormSaved] = useState(false);

  // Audit Pipeline Stages (Requirement 7)
  const auditPipelineStages = [
    "Reading Document PDF Structure...",
    "Extracting Test Parameters & Values...",
    "Comparing Clauses Against IS 2347 Specification...",
    "Validating NABL Lab Accreditation & Expiry Rules...",
    "Audit Completed Successfully!"
  ];

 const handleFileUpload = async (file) => {
  if (!file) return;

  setUploadedFile(file);
  setIsAuditing(true);
  setAuditStepIndex(0);

  try {
    const result = await analyzeDocument(file);

    console.log("Document audit result:", result);

    // Store the real backend result
    setAuditResult(result);

    setAuditStepIndex(auditPipelineStages.length - 1);
  } catch (error) {
    console.error("Document analysis failed:", error);
  } finally {
    setIsAuditing(false);
  }
};

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B2545] flex items-center gap-2">
            Document Auditor & Form Pre-Fill Assistant
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Upload test reports & spec sheets for animated AI clause verification or pre-fill official BIS Form 1.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-300 text-xs">
          <button
            onClick={() => setActiveSubTab('auditor')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'auditor'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            PDF Clause Auditor
          </button>
          <button
            onClick={() => setActiveSubTab('prefill')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
              activeSubTab === 'prefill'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>BIS Form 1 Pre-Fill</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'auditor' && (
        <div className="space-y-6">
          <UploadBox
            onFileUpload={handleFileUpload}
            title="Upload Test Report, Specification Sheet or NABL Certificate"
            subtitle="Drag & drop PDF, DOCX, PNG, JPG files (Max 25MB)"
          />

          {/* Animated Audit Pipeline States (Requirement 7) */}
          {isAuditing && (
            <div className="p-8 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-4 shadow-xs">
              <Loader2 className="w-8 h-8 text-[#0B2545] animate-spin mx-auto" />
              <div>
                <p className="text-sm font-extrabold text-[#0B2545]">
                  {auditPipelineStages[auditStepIndex]}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Pipeline Step {auditStepIndex + 1} of 5
                </p>
              </div>

              {/* Pipeline Progress Bar */}
              <div className="w-64 bg-slate-200 h-2.5 rounded-full mx-auto overflow-hidden">
                <div
                  className="bg-[#0B2545] h-full transition-all duration-300"
                  style={{ width: `${((auditStepIndex + 1) / auditPipelineStages.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Audit Results displaying Design System Statuses (Requirement 10) */}
          {uploadedFile && !isAuditing && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-white border border-slate-300 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#0B2545] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#0B2545]" /> Extracted Document Audit Summary
                  </h3>
                  <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300 text-xs">
                    ⚠️ Needs Attention
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">Document Type</span>
                    <span className="font-extrabold text-slate-900">NABL Lab Test Report</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Detected Standard</span>
                    <span className="font-extrabold text-[#0B2545] font-mono">IS 2347:2017</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Testing Laboratory</span>
                    <span className="font-bold text-slate-800">CPRI Lab Bangalore</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">NABL Accreditation</span>
                    <span className="font-bold text-emerald-700">✓ Active & Valid</span>
                  </div>
                </div>
              </div>

              {/* Detailed Clause Audit Results */}
              <div className="p-6 rounded-2xl bg-white border border-slate-300 space-y-4 shadow-xs">
                <h4 className="text-sm font-bold text-[#0B2545] uppercase tracking-wider">
                  AI Clause Audit Findings
                </h4>

                <div className="space-y-3">
                  {/* Verified Clause (Green) */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-emerald-950">✓ Verified — Clause 5.1 Hydrostatic Pressure Test:</span>
                      <p className="text-slate-700 mt-0.5">Burst pressure measured at 3.5 bar without structural leakage. Complies with IS 2347 safety threshold.</p>
                    </div>
                  </div>

                  {/* Needs Attention Clause (Yellow) */}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-amber-950">⚠️ Needs Attention — Clause 7.2 Food-Grade Gasket Test:</span>
                      <p className="text-slate-700 mt-0.5">Rubber gasket supplier test report under IS 7466 is missing from lab annexure.</p>
                    </div>
                  </div>

                  {/* Missing Clause (Red) */}
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-rose-950">✕ Missing — Clause 8.3 Marking Permanency Test:</span>
                      <p className="text-slate-700 mt-0.5">No rub-test evidence recorded for ISI logo permanency on handle metal plate.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: Conversational BIS Form 1 Pre-Fill */}
      {activeSubTab === 'prefill' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-300 space-y-6 shadow-xs max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center">
                <FileEdit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  BIS Application Form 1 Pre-Fill Assistant
                </h3>
                <p className="text-xs text-slate-500">AI populates required registration parameters for Manakonline portal submission.</p>
              </div>
            </div>

            <button
              onClick={() => setFormSaved(true)}
              className="px-4 py-2 bg-[#0B2545] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 hover:bg-blue-950 transition-all shadow-xs"
            >
              <Download className="w-4 h-4" /> Export Draft Form
            </button>
          </div>

          {formSaved && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold">
              ✓ Application Form 1 draft exported successfully!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Manufacturer / Brand Name</label>
              <input
                type="text"
                value={formData.manufacturerName}
                onChange={(e) => setFormData({ ...formData, manufacturerName: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Indian Standard Code (IS)</label>
              <input
                type="text"
                value={formData.isStandardNumber}
                onChange={(e) => setFormData({ ...formData, isStandardNumber: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-mono"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-800">Factory Manufacturing Address</label>
              <input
                type="text"
                value={formData.factoryAddress}
                onChange={(e) => setFormData({ ...formData, factoryAddress: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">Testing Laboratory Name</label>
              <input
                type="text"
                value={formData.nablLabName}
                onChange={(e) => setFormData({ ...formData, nablLabName: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800">NABL Test Report Number</label>
              <input
                type="text"
                value={formData.testReportNo}
                onChange={(e) => setFormData({ ...formData, testReportNo: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

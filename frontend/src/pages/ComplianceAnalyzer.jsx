import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Sliders,
  Sparkles,
  GitCommit,
  ArrowDown,
  Bot,
  Send,
  Trash2,
  Mic,
  Paperclip,
  ExternalLink,
  Lightbulb,
  CornerDownLeft
} from 'lucide-react';

import ComplianceScore from '../components/ComplianceScore';
import ComplianceCard from '../components/ComplianceCard';
import SourceCard from '../components/SourceCard';
import ChatMessage from '../components/ChatMessage';

import { MOCK_ANALYSIS_RESULT, SAMPLE_PROMPTS } from '../data/demoData';
import { analyzeCompliance, askBIS } from '../services/api';

export default function ComplianceAnalyzer({
  initialQuery,
  personaMode = 'producer',
  currentLanguage = 'en'
}) {
  const [activeTabMode, setActiveTabMode] = useState('assistant');

  const [productInput, setProductInput] = useState(
    initialQuery || 'Pressure cooker manufactured in Maharashtra'
  );

  const [analysis, setAnalysis] = useState(MOCK_ANALYSIS_RESULT);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  // =========================================================
  // COMPLY AI ASSISTANT
  // =========================================================

  const personaLabel =
    personaMode === 'consumer'
      ? 'Consumer'
      : personaMode === 'auditor'
        ? 'Auditor'
        : 'Industry';

  const languageLabel =
    currentLanguage === 'hi'
      ? 'Hindi'
      : currentLanguage === 'mr'
        ? 'Marathi'
        : currentLanguage === 'en'
          ? 'English'
          : currentLanguage;

  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const [attachedFileName, setAttachedFileName] = useState(null);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const getInitialAssistantMessage = () => ({
    role: 'assistant',
    text: `Namaste! 👋 I am your COMPLY AI Assistant.

I help you understand and complete the BIS compliance journey for your product.

I can help with:
• Applicable Indian Standards
• Certification schemes and QCO requirements
• Required documents
• Testing and laboratory requirements
• Compliance gaps
• Step-by-step action plans
• What-If compliance scenarios

You are currently using the ${personaLabel} view, with ${languageLabel} selected.

Tell me about your product or ask me what you need to do next.`,
    sources: [
      {
        title: 'Bureau of Indian Standards Portal',
        url: 'https://www.bis.gov.in'
      }
    ],
    confidence: 'official',
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  });

  const [messages, setMessages] = useState([
    getInitialAssistantMessage()
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isLoading]);

  async function handleAskCompliance(queryToSubmit = null) {
    const activeQuery = queryToSubmit || question;

    if (!activeQuery || !activeQuery.trim() || isLoading) {
      return;
    }

    const trimmedQuery = activeQuery.trim();

    setQuestion('');
    setChatError('');
    setIsLoading(true);

    const userMsg = {
      role: 'user',
      text: attachedFileName
        ? `${trimmedQuery} (Attached: ${attachedFileName})`
        : trimmedQuery,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages((prev) => [...prev, userMsg]);
    setAttachedFileName(null);

    try {
      const response = await askBIS(
        `COMPLY mode. User persona: ${personaLabel}. Language: ${languageLabel}.
Focus on BIS compliance, certification, testing, QCOs, documents, compliance gaps and action plans.

User question:
${trimmedQuery}`
      );

      const uniqueSources = [];
      const seenUrls = new Set();

      if (response.sources && Array.isArray(response.sources)) {
        response.sources.forEach((source) => {
          const key = source.url || source.title;

          if (!seenUrls.has(key)) {
            seenUrls.add(key);
            uniqueSources.push(source);
          }
        });
      }

      const botMessage = {
        role: 'assistant',
        text:
          response.answer ||
          'I could not generate a compliance response right now. Please try again.',
        sources:
          uniqueSources.length > 0
            ? uniqueSources
            : [
                {
                  title: 'BIS Official Portal',
                  url: 'https://www.bis.gov.in'
                }
              ],
        confidence: response.confidence || 'high',
        timestamp:
          response.timestamp ||
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('COMPLY Assistant Error:', err);

      setChatError(
        err.message ||
          'Unable to connect to the BIS compliance assistant.'
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            'I could not connect to the compliance backend right now. Please check that the FastAPI backend is running and try again.',
          sources: [
            {
              title: 'Bureau of Indian Standards',
              url: 'https://www.bis.gov.in'
            }
          ],
          confidence: 'unverified',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskCompliance();
    }
  };

  const handleClearChat = () => {
    setMessages([getInitialAssistantMessage()]);
    setChatError('');
    setQuestion('');
  };

  const handleVoiceInput = () => {
    setQuestion(
      'What documents and tests are required before I apply for BIS certification?'
    );
  };

  const handleFileAttach = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  // =========================================================
  // COMPLIANCE ASSESSMENT
  // =========================================================

  async function handleComplianceAssessment() {
    if (!productInput.trim()) {
      setError(
        'Please enter a product or manufacturing specification.'
      );
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const result = await analyzeCompliance(productInput);

      setAnalysis(result);
      setActiveWorkflowStep(0);
    } catch (err) {
      setError(
        err.message || 'Unable to complete compliance assessment.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  // =========================================================
  // WORKFLOW
  // =========================================================

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

  // =========================================================
  // GUIDED INTERVIEW
  // =========================================================

  const [interviewStep, setInterviewStep] = useState(0);

  const [interviewAnswers, setInterviewAnswers] = useState({
    category: 'Household Appliances',
    material: 'Stainless Steel Grade 304',
    powerRating: '1500W'
  });

  // =========================================================
  // WHAT-IF SIMULATOR
  // =========================================================

  const [whatIfMaterial, setWhatIfMaterial] =
    useState('Stainless Steel');

  const [whatIfCapacity, setWhatIfCapacity] =
    useState('5 Litre');

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">

      {/* =====================================================
          COMPLY HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h2 className="text-2xl font-extrabold text-[#0B2545] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            COMPLY — BIS Compliance Assistant
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Understand requirements, identify compliance gaps and
            prepare your product for BIS certification.
          </p>
        </div>

        {/* FEATURE SUB-TABS */}

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-300 text-xs overflow-x-auto">

          <button
            onClick={() => setActiveTabMode('assistant')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
              activeTabMode === 'assistant'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            AI Assistant
          </button>

          <button
            onClick={() => setActiveTabMode('workflow')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTabMode === 'workflow'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Compliance Workflow
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
            Map
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
            Guided Discovery
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
            What-If
          </button>

        </div>
      </div>

      {/* =====================================================
          MODE 0 — COMPLY AI ASSISTANT
      ===================================================== */}

      {activeTabMode === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CHAT */}

          <div className="lg:col-span-2 flex flex-col bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-xs min-h-[620px]">

            {/* TOP BAR */}

            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-300 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-[#0B2545] text-amber-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0B2545] flex items-center gap-2">
                    COMPLY AI ASSISTANT

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      BIS Compliance
                    </span>
                  </h3>

                  <p className="text-[11px] text-slate-500">
                    Personalized for {personaLabel} • {languageLabel}
                  </p>
                </div>

              </div>

              <button
                onClick={handleClearChat}
                className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  Reset Chat
                </span>
              </button>

            </div>

            {/* MESSAGES */}

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                />
              ))}

              {isLoading && (
                <div className="flex items-start gap-3 my-4 max-w-4xl mx-auto animate-pulse">

                  <div className="w-9 h-9 rounded-lg bg-[#0B2545] text-amber-400 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                    <span>
                      Checking BIS compliance requirements...
                    </span>
                  </div>

                </div>
              )}

              {chatError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs">
                  ⚠️ {chatError}
                </div>
              )}

              <div ref={chatEndRef} />

            </div>

            {/* SUGGESTIONS */}

            {messages.length < 3 && (
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">

                <div className="flex items-center gap-1.5 mb-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  Compliance Questions
                </div>

                <div className="flex flex-wrap gap-1.5">

                  {[
                    'What documents do I need for BIS certification?',
                    'What tests are required for my product?',
                    'How can I improve my compliance score?'
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleAskCompliance(prompt)}
                      className="text-left px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#0B2545] text-slate-700 text-xs transition-all"
                    >
                      {prompt}
                    </button>
                  ))}

                </div>
              </div>
            )}

            {/* INPUT */}

            <div className="p-4 border-t border-slate-300 bg-white space-y-2">

              {attachedFileName && (
                <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md w-fit border border-blue-200">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>
                    Attached: {attachedFileName}
                  </span>
                </div>
              )}

              <div className="relative flex items-center gap-2">

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileAttach}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 shrink-0"
                  title="Attach document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  onClick={handleVoiceInput}
                  className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 shrink-0"
                  title="Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <textarea
                  rows={2}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about certification, documents, testing, QCOs or compliance gaps..."
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545] resize-none"
                />

                <button
                  onClick={() => handleAskCompliance()}
                  disabled={!question.trim() || isLoading}
                  className={`p-3 rounded-xl transition-all shrink-0 ${
                    question.trim() && !isLoading
                      ? 'bg-[#0B2545] text-white hover:bg-blue-900'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>

              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">

                <span className="flex items-center gap-1">
                  <CornerDownLeft className="w-3 h-3" />
                  Enter to send • Shift + Enter for newline
                </span>

                <span>
                  Verify critical decisions with official BIS sources
                </span>

              </div>

            </div>

          </div>

          {/* ASSISTANT CONTEXT PANEL */}

          <div className="bg-slate-50 border border-slate-300 rounded-2xl p-5 space-y-5">

            <div>
              <h4 className="text-sm font-extrabold text-[#0B2545] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Your Compliance Journey
              </h4>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                COMPLY focuses on helping you move from product
                information to certification readiness.
              </p>
            </div>

            <div className="space-y-2">

              {[
                ['1', 'Identify Standard'],
                ['2', 'Check QCO'],
                ['3', 'Understand Testing'],
                ['4', 'Prepare Documents'],
                ['5', 'Find Compliance Gaps'],
                ['6', 'Create Action Plan']
              ].map(([number, title]) => (
                <div
                  key={number}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0B2545] text-white flex items-center justify-center text-xs font-bold">
                    {number}
                  </div>

                  <span className="text-xs font-semibold text-slate-800">
                    {title}
                  </span>
                </div>
              ))}

            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">

              <p className="text-[10px] uppercase tracking-wider font-bold text-amber-800">
                Current Product
              </p>

              <p className="text-sm font-bold text-slate-900 mt-1">
                {analysis.product || 'Pressure Cooker'}
              </p>

              <p className="text-xs text-slate-600 mt-1">
                Standard:{' '}
                <b>
                  {analysis.standardNumber || 'IS 2347:2017'}
                </b>
              </p>

            </div>

            <button
              onClick={() => setActiveTabMode('workflow')}
              className="w-full px-4 py-3 rounded-xl bg-[#0B2545] text-white text-xs font-bold hover:bg-blue-950 transition-all"
            >
              Open Compliance Workflow
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          MODE 1 — WORKFLOW
      ===================================================== */}

      {activeTabMode === 'workflow' && (
        <div className="space-y-6">

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
                <span>
                  {isAnalyzing
                    ? 'Analyzing...'
                    : 'Run Compliance Assessment'}
                </span>
              </button>

            </div>

            {error && (
              <p className="text-sm text-red-600 font-semibold">
                ⚠️ {error}
              </p>
            )}

          </div>

          {/* STEPPER */}

          <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-xs overflow-x-auto">

            <div className="flex items-center justify-between min-w-[700px] gap-2">

              {workflowStages.map((stage, index) => {

                const isActive =
                  activeWorkflowStep === index;

                const isPast =
                  index < activeWorkflowStep;

                return (
                  <React.Fragment key={index}>

                    <div
                      onClick={() =>
                        setActiveWorkflowStep(index)
                      }
                      className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#0B2545] text-white shadow-xs font-bold scale-[1.03]'
                          : isPast
                            ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold'
                            : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold opacity-80">
                        {index + 1}. {stage.title}
                      </span>

                      <span className="text-xs font-extrabold">
                        {stage.detail}
                      </span>
                    </div>

                    {index < workflowStages.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}

                  </React.Fragment>
                );
              })}

            </div>
          </div>

          {/* ASSESSMENT */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 space-y-6">

              <div className="p-6 rounded-2xl bg-[#0B2545] text-white border border-slate-700 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">

                <div className="space-y-2 text-center sm:text-left">

                  <span className="px-3 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                    {analysis.certificationScheme}
                  </span>

                  <h3 className="text-xl font-bold text-white">
                    {analysis.product}
                  </h3>

                  <p className="text-xs text-blue-200">
                    Applicable Standard:{' '}
                    <b className="text-amber-300 font-mono">
                      {analysis.standardNumber}
                    </b>{' '}
                    — {analysis.standardTitle}
                  </p>

                  <div className="pt-1">
                    <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/80 border border-rose-800 px-2.5 py-1 rounded-full">
                      ⚠️ {analysis.riskLevel}
                    </span>
                  </div>

                </div>

                <div className="shrink-0 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
                  <ComplianceScore
                    score={analysis.complianceScore}
                  />
                </div>

              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-4">

                <h4 className="text-base font-bold text-[#0B2545]">
                  Compliance Status Breakdown
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {analysis.statusChecklist?.map(
                    (item, index) => (
                      <ComplianceCard
                        key={index}
                        title={item.title}
                        status={item.status}
                        detail={item.detail}
                      />
                    )
                  )}

                </div>
              </div>

            </div>

            <div className="space-y-6">

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-300 space-y-4">

                <h4 className="text-sm font-bold text-[#0B2545] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Evidence & Primary Sources
                </h4>

                <div className="p-3 bg-white rounded-xl border border-slate-300 text-xs space-y-1">

                  <p className="font-bold text-slate-900">
                    {analysis.primarySource?.title ||
                      'Bureau of Indian Standards Portal'}
                  </p>

                  <p className="text-slate-500 font-mono text-[11px]">
                    {analysis.primarySource?.url ||
                      'https://www.bis.gov.in'}
                  </p>

                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 inline-block mt-1">
                    Verified Primary Source
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          MODE 2 — COMPLIANCE MAP
      ===================================================== */}

      {activeTabMode === 'map' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-6">

          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">

            <div className="w-10 h-10 rounded-lg bg-[#0B2545] text-amber-400 flex items-center justify-center">
              <GitCommit className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#0B2545]">
                Interactive Compliance Relationship Map
              </h3>

              <p className="text-xs text-slate-500">
                Visual dependency flow from product information to
                compliance readiness.
              </p>
            </div>

          </div>

          <div className="max-w-2xl mx-auto space-y-3 py-4">

            <div className="p-4 rounded-xl bg-[#0B2545] text-white text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-amber-300">
                1. Target Product
              </span>

              <h4 className="text-sm font-extrabold">
                Domestic Pressure Cooker
              </h4>
            </div>

            <ArrowDown className="w-5 h-5 text-[#0B2545] mx-auto" />

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-300 text-center shadow-xs">

              <span className="text-[10px] uppercase font-bold text-blue-800">
                2. Applicable Indian Standard
              </span>

              <h4 className="text-sm font-extrabold text-[#0B2545]">
                IS 2347:2017
              </h4>

              <p className="text-xs text-slate-600">
                Domestic Pressure Cookers — Specification
              </p>

            </div>

            <ArrowDown className="w-5 h-5 text-[#0B2545] mx-auto" />

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-center shadow-xs">

              <span className="text-[10px] uppercase font-bold text-amber-800">
                3. Certification Scheme & QCO
              </span>

              <h4 className="text-sm font-extrabold text-amber-950">
                Scheme-I (ISI Mark) — Mandatory QCO
              </h4>

              <p className="text-xs text-slate-600">
                Factory quality inspection + product testing
              </p>

            </div>

            <ArrowDown className="w-5 h-5 text-[#0B2545] mx-auto" />

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-300 text-center shadow-xs">

              <span className="text-[10px] uppercase font-bold text-purple-800">
                4. Testing Parameters
              </span>

              <h4 className="text-sm font-extrabold text-purple-950">
                Hydrostatic Burst Test & Safety
              </h4>

            </div>

            <ArrowDown className="w-5 h-5 text-[#0B2545] mx-auto" />

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-center shadow-xs">

              <span className="text-[10px] uppercase font-bold text-slate-700">
                5. Required Documents
              </span>

              <h4 className="text-sm font-extrabold text-slate-900">
                Application + Test Certificate
              </h4>

            </div>

            <ArrowDown className="w-5 h-5 text-emerald-600 mx-auto" />

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-400 text-center shadow-xs">

              <span className="text-[10px] uppercase font-bold text-emerald-800">
                6. Compliance Readiness
              </span>

              <h4 className="text-sm font-extrabold text-emerald-950">
                {analysis.complianceScore || 82}% Compliant
              </h4>

            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          MODE 3 — GUIDED DISCOVERY
      ===================================================== */}

      {activeTabMode === 'interview' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-300 space-y-6 max-w-2xl mx-auto shadow-xs">

          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">

            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Guided Standard Discovery
              </h3>

              <p className="text-xs text-slate-500">
                Answer a few questions to narrow down the compliance
                requirements.
              </p>
            </div>

          </div>

          {interviewStep === 0 && (
            <div className="space-y-4 text-xs">

              <label className="font-bold text-slate-800 block text-sm">
                Select Product Category
              </label>

              <div className="grid grid-cols-2 gap-3">

                {[
                  'Household Appliances',
                  'Electronics & IT',
                  'Batteries & Storage',
                  'Consumer Toys'
                ].map((category) => (

                  <button
                    key={category}
                    onClick={() => {
                      setInterviewAnswers((prev) => ({
                        ...prev,
                        category
                      }));

                      setInterviewStep(1);
                    }}
                    className="p-3 rounded-lg border border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-[#0B2545] font-semibold text-left transition-all"
                  >
                    {category}
                  </button>

                ))}

              </div>

            </div>
          )}

          {interviewStep === 1 && (
            <div className="space-y-4">

              <p className="text-sm font-bold text-slate-800">
                What is the main material used?
              </p>

              <div className="grid grid-cols-1 gap-2">

                {[
                  'Stainless Steel',
                  'Aluminium',
                  'Plastic',
                  'Other'
                ].map((material) => (

                  <button
                    key={material}
                    onClick={() => {
                      setInterviewAnswers((prev) => ({
                        ...prev,
                        material
                      }));

                      setInterviewStep(2);
                    }}
                    className="p-3 rounded-lg border border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-[#0B2545] text-left text-sm font-semibold"
                  >
                    {material}
                  </button>

                ))}

              </div>

            </div>
          )}

          {interviewStep === 2 && (
            <div className="space-y-5">

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Discovery Summary
                </p>

                <div className="mt-3 space-y-2">

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <b>Category:</b>{' '}
                    {interviewAnswers.category}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <b>Material:</b>{' '}
                    {interviewAnswers.material}
                  </div>

                </div>
              </div>

              <button
                onClick={() => {
                  setProductInput(
                    `${interviewAnswers.material} ${interviewAnswers.category}`
                  );

                  setActiveTabMode('workflow');
                  setInterviewStep(0);
                }}
                className="w-full px-4 py-3 rounded-xl bg-[#0B2545] text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                Generate Compliance Assessment
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      )}

      {/* =====================================================
          MODE 4 — WHAT IF
      ===================================================== */}

      {activeTabMode === 'whatif' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-300 space-y-6 shadow-xs">

          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">

            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                What-If Impact Simulator
              </h3>

              <p className="text-xs text-slate-500">
                Explore how product design changes may affect compliance
                requirements.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

            <div className="space-y-2">

              <label className="font-bold text-slate-800">
                Raw Material
              </label>

              <select
                value={whatIfMaterial}
                onChange={(e) =>
                  setWhatIfMaterial(e.target.value)
                }
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 font-semibold"
              >
                <option value="Stainless Steel">
                  Stainless Steel Grade 304
                </option>

                <option value="Aluminum Alloy">
                  Aluminum Alloy
                </option>
              </select>

            </div>

            <div className="space-y-2">

              <label className="font-bold text-slate-800">
                Capacity
              </label>

              <select
                value={whatIfCapacity}
                onChange={(e) =>
                  setWhatIfCapacity(e.target.value)
                }
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 font-semibold"
              >
                <option value="5 Litre">
                  5 Litre Domestic
                </option>

                <option value="12 Litre Commercial">
                  12 Litre Commercial
                </option>
              </select>

            </div>

          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-2">

            <span className="font-bold text-amber-900 block">
              Simulation Impact
            </span>

            <p className="text-slate-700">
              Selected <b>{whatIfMaterial}</b> with{' '}
              <b>{whatIfCapacity}</b> capacity.

              <br />

              The compliance assistant should verify the applicable
              standard, testing parameters and certification
              requirements before treating this simulation as a
              final compliance decision.
            </p>

          </div>

          <button
            onClick={() =>
              handleAskCompliance(
                `What compliance changes should I check if I use ${whatIfMaterial} with ${whatIfCapacity} capacity?`
              )
            }
            className="px-5 py-3 rounded-xl bg-[#0B2545] text-white text-xs font-bold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Ask COMPLY AI
          </button>

        </div>
      )}

    </div>
  );
}
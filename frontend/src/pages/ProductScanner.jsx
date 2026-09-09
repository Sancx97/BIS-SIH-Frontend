import React, { useState } from 'react';
import {
  Camera,
  Award,
  CheckCircle2,
  Search,
  Scan,
  Send,
  Bot,
  User,
  ShieldCheck,
  FileCheck2,
  MessageCircle,
  Sparkles
} from 'lucide-react';

import UploadBox from '../components/UploadBox';
import { askBIS } from '../services/api';

export default function ProductScanner({
  initialQuery,
  personaMode = 'consumer',
  currentLanguage = 'en'
}) {
  const [scannerTab, setScannerTab] = useState('assistant');
  const [scannedImage, setScannedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const [cmlInput, setCmlInput] = useState('CML-8492019384');
  const [cmlResult, setCmlResult] = useState(null);

  // -----------------------------
  // VERIFY AI ASSISTANT
  // -----------------------------
  const personaLabel =
    personaMode === 'producer'
      ? 'Producer'
      : personaMode === 'student'
        ? 'Student'
        : 'Consumer';

  const languageLabel =
    currentLanguage === 'hi'
      ? 'Hindi'
      : currentLanguage === 'mr'
        ? 'Marathi'
        : currentLanguage === 'or'
          ? 'Odia'
          : 'English';

  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        `Hi! I’m your personalized VERIFY AI Assistant. I can help you verify BIS/ISI marks, CML licence numbers, HUID/hallmark information, product authenticity and explain what a verification result means.\n\nCurrent profile: ${personaLabel}\nLanguage: ${languageLabel}`
    }
  ]);

  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const verifySuggestions = [
    'How can I verify an ISI mark?',
    'What is a CML licence number?',
    'How do I check a HUID?',
    'How can I identify a fake BIS mark?'
  ];

  const handleVerifyChat = async (question) => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || isChatLoading) return;

    const userMessage = {
      role: 'user',
      content: cleanQuestion
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const verificationPrompt = `
VERIFY mode.

User persona: ${personaLabel}
Preferred language: ${languageLabel}

The user is using the VERIFY module of an AI-powered BIS assistant.

Focus only on:
- BIS/ISI mark verification
- CML licence verification
- HUID and hallmarking
- product authenticity
- counterfeit ISI/BIS mark detection
- BIS licence status
- official verification procedures
- explaining verification evidence
- consumer/producer verification guidance

Important:
Do not invent live BIS registry results.
If live registry data is unavailable, clearly explain that the result needs confirmation through an official BIS source.
Prefer official BIS sources and cite them when available.

User question:
${cleanQuestion}
`;

      const response = await askBIS(verificationPrompt);

      const answer =
        response?.answer ||
        'I could not generate a verification response right now. Please try again.';

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: answer,
          sources: response?.sources || []
        }
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I could not connect to the BIS assistant service. Please try again or use the verification tools below.'
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    handleVerifyChat(chatInput);
  };

  // -----------------------------
  // VISION MARK DETECTOR
  // -----------------------------
  const handleImageUpload = (file) => {
    setScannedImage(file);
    setIsScanning(true);

    // Current frontend demonstration.
    // Replace with real computer-vision endpoint when available.
    setTimeout(() => {
      setIsScanning(false);
    }, 1000);
  };

  // -----------------------------
  // CML / HUID VERIFICATION
  // -----------------------------
  const handleVerifyCML = () => {
    if (!cmlInput.trim()) return;

    // Demo result for frontend demonstration.
    // Should be connected to the BIS registry/backend in production.
    setCmlResult({
      valid: true,
      licensee: 'Hawkins Cookers Limited',
      standard: 'IS 2347:2017',
      issueDate: '2024-01-15',
      validUntil: '2027-01-14',
      status: 'Active & Certified',
      plantLocation: 'Thane, Maharashtra'
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#0B2545]" />

            <h2 className="text-2xl font-extrabold text-[#0B2545]">
              VERIFY
            </h2>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mt-1">
            BIS Product & Authenticity Verification
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Verify ISI marks, BIS licence numbers, HUID/hallmark information
            and product authenticity using one independent verification workspace.
          </p>
        </div>

        {/* =================================================
            TAB NAVIGATION
        ================================================= */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-300 text-xs">

          <button
            onClick={() => setScannerTab('assistant')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              scannerTab === 'assistant'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Verify AI
          </button>

          <button
            onClick={() => setScannerTab('fake-detector')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              scannerTab === 'fake-detector'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Vision Detector
          </button>

          <button
            onClick={() => setScannerTab('ar-mode')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
              scannerTab === 'ar-mode'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            AR Overlay
          </button>

          <button
            onClick={() => setScannerTab('hallmark')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
              scannerTab === 'hallmark'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            CML & HUID
          </button>
        </div>
      </div>


      {/* =====================================================
          MODE 0 — VERIFY AI ASSISTANT
      ===================================================== */}
      {scannerTab === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CHAT */}
          <div className="lg:col-span-2 bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden">

            {/* Chat header */}
            <div className="px-5 py-4 bg-[#0B2545] text-white flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-bold text-sm">
                    Verify AI Assistant
                  </h3>

                  <p className="text-[11px] text-blue-100">
                    Personalized for {personaLabel} • {languageLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                BIS Knowledge Assistant
              </div>
            </div>


            {/* Messages */}
            <div className="h-[430px] overflow-y-auto p-5 space-y-4 bg-slate-50">

              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#0B2545] text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      message.role === 'user'
                        ? 'bg-[#0B2545] text-white rounded-br-md'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
                    }`}
                  >
                    {message.content}

                    {message.sources?.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-200">
                        <p className="text-[10px] font-bold text-slate-500">
                          Official sources available in response
                        </p>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 shrink-0 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0B2545] text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500">
                    Checking BIS verification knowledge...
                  </div>
                </div>
              )}

            </div>


            {/* Suggestions */}
            <div className="px-5 pt-4">

              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />

                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Suggested verification questions
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {verifySuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleVerifyChat(suggestion)}
                    disabled={isChatLoading}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

            </div>


            {/* Input */}
            <form
              onSubmit={handleChatSubmit}
              className="p-5 flex gap-2"
            >

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about an ISI mark, CML, HUID or product authenticity..."
                disabled={isChatLoading}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
              />

              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="px-5 rounded-xl bg-[#0B2545] hover:bg-blue-950 text-white font-bold disabled:opacity-40 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>

            </form>
          </div>


          {/* VERIFY CONTEXT */}
          <div className="space-y-4">

            <div className="p-5 rounded-2xl bg-[#0B2545] text-white shadow-md">

              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />

                <h3 className="font-bold">
                  VERIFY Workspace
                </h3>
              </div>

              <p className="text-xs text-blue-100 leading-relaxed">
                Verify products and certification evidence before trusting
                a BIS/ISI claim.
              </p>

              <div className="mt-5 space-y-2">

                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  ISI mark verification
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  BIS licence / CML guidance
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  HUID & hallmark verification
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Counterfeit mark detection
                </div>

              </div>
            </div>


            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">

              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-amber-700" />

                <h4 className="font-bold text-sm text-amber-950">
                  Important
                </h4>
              </div>

              <p className="text-xs text-amber-900 leading-relaxed">
                A visual match alone should not be treated as final proof of
                certification. Verification-critical results should be
                confirmed against official BIS information.
              </p>

            </div>

          </div>
        </div>
      )}


      {/* =====================================================
          MODE 1 — VISION MARK DETECTOR
      ===================================================== */}
      {scannerTab === 'fake-detector' && (
        <div className="space-y-6">

          <UploadBox
            onFileUpload={handleImageUpload}
            acceptedTypes=".jpg, .jpeg, .png, .webp"
            title="Upload Product Packaging or ISI Emblem Photo"
            subtitle="Analyze the visible ISI mark, CML information and product label"
          />

          {isScanning && (
            <div className="p-8 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-3 shadow-xs">

              <Scan className="w-10 h-10 text-[#0B2545] animate-spin mx-auto" />

              <p className="text-sm font-bold text-[#0B2545]">
                Analyzing product image...
              </p>

              <p className="text-xs text-slate-500">
                Vision detection simulation running
              </p>

            </div>
          )}

          {scannedImage && !isScanning && (
            <div className="p-6 rounded-2xl bg-white border border-slate-300 space-y-6 shadow-xs animate-fade-in">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">

                <div>
                  <h3 className="text-base font-bold text-[#0B2545]">
                    Verification Evidence
                  </h3>

                  <p className="text-xs text-slate-500">
                    Image analyzed: {scannedImage.name}
                  </p>
                </div>

                <span className="px-3 py-1 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300 text-xs">
                  Demo Detection Result
                </span>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">

                {/* ISI */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    1. Detected ISI Mark
                  </span>

                  <p className="font-extrabold text-emerald-950 text-sm">
                    Authenticity Candidate
                  </p>

                  <p className="text-slate-600 text-[11px]">
                    Visual mark detected for further verification.
                  </p>

                </div>


                {/* CML */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    2. Detected CML Code
                  </span>

                  <p className="font-extrabold text-[#0B2545] text-sm font-mono">
                    CML-8492019384
                  </p>

                  <p className="text-slate-600 text-[11px]">
                    Extracted code shown for demonstration.
                  </p>

                </div>


                {/* Standard */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-300 space-y-1">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                    3. Standard Reference
                  </span>

                  <p className="font-extrabold text-blue-950 text-sm font-mono">
                    IS 2347:2017
                  </p>

                  <p className="text-slate-600 text-[11px]">
                    Standard reference shown in the demonstration.
                  </p>

                </div>


                {/* Product */}
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-1">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                    4. Product Information
                  </span>

                  <p className="font-bold text-slate-900">
                    Pressure Cooker 5 Litre
                  </p>

                  <p className="text-slate-600 text-[11px]">
                    Detected product information — demo result.
                  </p>

                </div>

              </div>


              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex gap-3">

                <FileCheck2 className="w-5 h-5 text-blue-700 shrink-0" />

                <div>
                  <p className="font-bold text-blue-950 text-xs">
                    Verification recommendation
                  </p>

                  <p className="text-[11px] text-blue-900 mt-1">
                    Use the detected CML/standard information with the
                    official BIS verification source before treating the
                    product as certified.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>
      )}


      {/* =====================================================
          MODE 2 — AR CAMERA OVERLAY
      ===================================================== */}
      {scannerTab === 'ar-mode' && (
        <div className="p-8 rounded-2xl bg-[#0B2545] text-white space-y-6 max-w-2xl mx-auto shadow-md relative overflow-hidden border border-slate-700">

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">

            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400 animate-pulse" />

              <span className="font-bold text-sm">
                AR Visual Inspection Overlay
              </span>
            </div>

            <span className="text-xs bg-white/10 text-amber-300 border border-white/20 px-3 py-1 rounded font-mono">
              Simulation
            </span>

          </div>


          <div className="relative h-64 bg-slate-950 rounded-xl border-2 border-dashed border-amber-500/50 flex items-center justify-center overflow-hidden">

            <div className="absolute inset-8 border-2 border-emerald-400 rounded-lg pointer-events-none flex flex-col justify-between p-3 animate-pulse">

              <div className="text-[11px] font-mono text-emerald-400 bg-slate-950/90 px-2 py-1 rounded w-fit border border-emerald-500/40">
                🟢 ISI LOGO DETECTED
              </div>

              <div className="text-[11px] font-mono text-emerald-400 bg-slate-950/90 px-2 py-1 rounded w-fit ml-auto border border-emerald-500/40">
                IS 2347:2017
              </div>

            </div>

            <p className="text-xs text-slate-400 text-center px-4">

              Point camera at product label or packaging...

              <br />

              <span className="text-[11px] text-amber-300">
                AR overlay demonstration
              </span>

            </p>

          </div>


          <div className="p-4 rounded-xl bg-white/5 border border-white/10">

            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-4 h-4 text-amber-300" />

              <span className="font-bold text-xs">
                What this mode provides
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              The AR workflow is designed to visually highlight detected
              BIS/ISI information and associated Indian Standard references
              directly over the product view.
            </p>

          </div>

        </div>
      )}


      {/* =====================================================
          MODE 3 — CML & HUID VERIFIER
      ===================================================== */}
      {scannerTab === 'hallmark' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-300 space-y-6 shadow-xs max-w-3xl mx-auto">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                CML License & HUID Verifier
              </h3>

              <p className="text-xs text-slate-500">
                Enter a BIS License Number (CML) or HUID code for verification.
              </p>
            </div>

          </div>


          <div className="flex flex-col sm:flex-row gap-3">

            <input
              type="text"
              value={cmlInput}
              onChange={(e) => setCmlInput(e.target.value)}
              placeholder="e.g. CML-8492019384 or HUID Code..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
            />

            <button
              onClick={handleVerifyCML}
              className="px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-blue-950 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 justify-center"
            >
              <Search className="w-4 h-4" />
              <span>Verify</span>
            </button>

          </div>


          {cmlResult && (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-4 text-xs">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-300 pb-3">

                <span className="font-bold text-emerald-950 flex items-center gap-1.5">

                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />

                  Demo Verification Result: Active

                </span>

                <span className="font-mono text-slate-600">
                  {cmlInput}
                </span>

              </div>


              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                <div>
                  <span className="text-slate-500 font-semibold block">
                    Manufacturer
                  </span>

                  <span className="font-bold text-slate-900">
                    {cmlResult.licensee}
                  </span>
                </div>


                <div>
                  <span className="text-slate-500 font-semibold block">
                    Standard Number
                  </span>

                  <span className="font-bold text-slate-900">
                    {cmlResult.standard}
                  </span>
                </div>


                <div>
                  <span className="text-slate-500 font-semibold block">
                    Plant Location
                  </span>

                  <span className="font-bold text-slate-900">
                    {cmlResult.plantLocation}
                  </span>
                </div>


                <div>
                  <span className="text-slate-500 font-semibold block">
                    Issue Date
                  </span>

                  <span className="font-bold text-slate-900">
                    {cmlResult.issueDate}
                  </span>
                </div>


                <div>
                  <span className="text-slate-500 font-semibold block">
                    Valid Until
                  </span>

                  <span className="font-bold text-slate-900">
                    {cmlResult.validUntil}
                  </span>
                </div>


                <div>
                  <span className="text-slate-500 font-semibold block">
                    Status
                  </span>

                  <span className="font-bold text-emerald-700">
                    {cmlResult.status}
                  </span>
                </div>

              </div>


              <div className="p-3 rounded-lg bg-white/70 border border-emerald-200">

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  This frontend currently demonstrates the verification
                  workflow. Production deployment should connect this action
                  to the backend/BIS registry source for authoritative status.
                </p>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
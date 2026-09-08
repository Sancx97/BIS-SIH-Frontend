import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Trash2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Info,
  AlertCircle,
  Lightbulb,
  CornerDownLeft,
  Bot,
  Mic,
  Paperclip,
  ExternalLink,
  CheckCircle2,
  FileText
} from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import StatusBadge from '../components/StatusBadge';
import { askBIS } from '../services/api';
import { SAMPLE_PROMPTS } from '../data/demoData';

export default function AskBIS({ initialQuery }) {
  const [question, setQuestion] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Namaste! I am your BIS AI Compliance Copilot. Ask me anything about Indian Standards (IS codes), ISI marking, compulsory registration (CRS), quality control orders (QCOs), lab testing, or certification documentation.',
      sources: [
        { title: 'Bureau of Indian Standards Portal', url: 'https://www.bis.gov.in' }
      ],
      confidence: 'official',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastAsked, setLastAsked] = useState('');
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const handledInitialRef = useRef(false);

  // Prevent double-execution of initialQuery (especially in React Strict Mode)
  useEffect(() => {
    if (initialQuery && initialQuery.trim() && !handledInitialRef.current) {
      handledInitialRef.current = true;
      handleAsk(initialQuery.trim());
    }
  }, [initialQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setQuestion("I manufacture stainless steel pressure cookers in Maharashtra");
    }, 1500);
  };

  const handleFileAttach = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  async function handleAsk(queryToSubmit = null) {
    const activeQuery = queryToSubmit || question;
    if (!activeQuery || !activeQuery.trim() || isLoading) return;

    const trimmedQuery = activeQuery.trim();
    setLastAsked(trimmedQuery);
    setError(null);

    const userTextContent = attachedFileName ? `${trimmedQuery} (Attached: ${attachedFileName})` : trimmedQuery;
    const userMsg = {
      role: 'user',
      text: userTextContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Deduplicate user message insertion
    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.role === 'user' && lastMsg.text === userTextContent) {
        return prev;
      }
      return [...prev, userMsg];
    });

    if (!queryToSubmit) {
      setQuestion('');
      setAttachedFileName(null);
    }
    setIsLoading(true);

    try {
      const response = await askBIS(trimmedQuery);

      // Deduplicate sources by URL
      const uniqueSources = [];
      const seenUrls = new Set();
      if (response.sources && Array.isArray(response.sources)) {
        response.sources.forEach((s) => {
          const urlKey = s.url || s.title;
          if (!seenUrls.has(urlKey)) {
            seenUrls.add(urlKey);
            uniqueSources.push(s);
          }
        });
      }

      const botMsg = {
        role: 'assistant',
        text: response.answer,
        sources: uniqueSources.length > 0 ? uniqueSources : [{ title: 'BIS Official Portal', url: 'https://www.bis.gov.in' }],
        confidence: response.confidence || 'high',
        timestamp: response.timestamp
      };

      setMessages((prev) => {
        // Prevent duplicate bot message if identical response already exists as last message
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && lastMsg.text === botMsg.text) {
          return prev;
        }
        return [...prev, botMsg];
      });
    } catch (err) {
      console.error('AskBIS API Error:', err);
      setError(err.message || 'Unable to connect to backend server at http://127.0.0.1:8000/api/ask.');

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I encountered an issue connecting to the FastAPI backend service. Please verify `main.py` is active on port 8000.',
          sources: [{ title: 'Bureau of Indian Standards', url: 'https://www.bis.gov.in' }],
          confidence: 'unverified',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleClearChat = () => {
    handledInitialRef.current = false;
    setMessages([
      {
        role: 'assistant',
        text: 'Conversation reset. Ask any question regarding Indian Standards, QCOs, or BIS certification rules.',
        sources: [{ title: 'Bureau of Indian Standards', url: 'https://www.bis.gov.in' }],
        confidence: 'official',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setError(null);
  };

  const sampleReferences = [
    {
      type: "Indian Standard",
      title: "IS 2347:2017 Domestic Pressure Cookers",
      clause: "Section 5 — Hydrostatic Burst Test & Gasket Specs",
      date: "Gazette Amended 2021"
    },
    {
      type: "DPIIT QCO Order",
      title: "Mandatory Quality Control Order Schedule I",
      clause: "Compulsory ISI Marking Requirement",
      date: "Enforced Notification"
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto h-[calc(100vh-140px)] min-h-[550px]">
      {/* Main Chat Conversation Column */}
      <div className="flex-1 flex flex-col bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-xs">
        {/* Top Chat Bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0B2545] text-amber-400 flex items-center justify-center font-bold text-xs shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B2545] flex items-center gap-2">
                BIS COMPLIANCE COPILOT
                <StatusBadge status="official" label="Live RAG" size="sm" />
              </h3>
              <p className="text-[11px] text-slate-500">
                Connected API endpoint: <code className="text-[10px] bg-slate-200 px-1 py-0.5 rounded">POST /api/ask</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Chat</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}

          {isLoading && (
            <div className="flex items-start gap-3 my-4 max-w-4xl mx-auto animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-[#0B2545] text-amber-400 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Retrieving Indian Standards & BIS notifications...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              {lastAsked && (
                <button
                  onClick={() => handleAsk(lastAsked)}
                  className="px-3 py-1 bg-rose-600 text-white rounded-md font-semibold text-xs flex items-center gap-1 hover:bg-rose-700 transition-colors shrink-0"
                >
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              )}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Sample Prompt Chips */}
        {messages.length < 3 && (
          <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-1.5 mb-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Recommended Questions
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(prompt)}
                  className="text-left px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#0B2545] text-slate-700 text-xs transition-all hover:shadow-xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-300 bg-white space-y-2">
          {attachedFileName && (
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-md w-fit border border-blue-200">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attached Document: {attachedFileName}</span>
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
              className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
              title="Attach Document or Spec Sheet"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl transition-all shrink-0 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              <Mic className="w-4 h-4" />
            </button>

            <textarea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening for your question..." : "Ask anything about Indian Standards (e.g. What is BIS? or Tell me about certification requirements)..."}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545] resize-none"
            />

            <button
              onClick={() => handleAsk()}
              disabled={!question.trim() || isLoading}
              className={`p-3 rounded-xl transition-all shrink-0 ${
                question.trim() && !isLoading
                  ? 'bg-[#0B2545] text-white hover:bg-blue-900 shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> Press <b>Enter</b> to send, <b>Shift + Enter</b> for newline
            </span>
            <span className="text-slate-600 font-medium">
              AI-generated guidance • Verify critical decisions with official BIS sources
            </span>
          </div>
        </div>
      </div>

      {/* Right Drawer Panel: Restructured Evidence & Sources */}
      <div className="hidden lg:flex flex-col w-80 bg-slate-50 border border-slate-300 rounded-2xl p-5 space-y-6">
        <div>
          <h4 className="text-sm font-extrabold text-[#0B2545] flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Evidence & Sources
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            RAG retrieval pipeline evidence mapping for active user prompt.
          </p>
        </div>

        {/* Primary Source Card */}
        <div className="space-y-2">
          <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Primary Source
          </h5>

          <a
            href="https://www.bis.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-300 hover:border-[#0B2545] transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded bg-blue-50 text-[#0B2545] shrink-0 font-bold text-xs">
                BIS
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 group-hover:text-[#0B2545]">
                  BIS Official Website
                </p>
                <p className="text-[11px] text-slate-500 truncate">https://www.bis.gov.in</p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B2545] shrink-0" />
          </a>
        </div>

        {/* Relevant References List */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#0B2545]" /> Relevant References
          </h5>

          <div className="space-y-2">
            {sampleReferences.map((ref, i) => (
              <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block">
                  {ref.type}
                </span>
                <p className="text-xs font-bold text-slate-900">{ref.title}</p>
                <p className="text-[11px] text-slate-600">{ref.clause}</p>
                <p className="text-[10px] text-slate-400 font-mono">{ref.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

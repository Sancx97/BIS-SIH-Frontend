import React, { useState } from 'react';
import { User, Bot, Copy, Check, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import SourceCard from './SourceCard';
import StatusBadge from './StatusBadge';

export default function ChatMessage({ user, bot, message }) {
  const [copied, setCopied] = useState(false);

  // Handle both prop styles (user/bot vs message object)
  const isUserMsg = user !== undefined ? true : (message?.role === 'user');
  const userText = user || (message?.role === 'user' ? message.text : null);
  const botText = bot || (message?.role === 'assistant' ? message.text : null);
  const sources = message?.sources || [];
  const confidence = message?.confidence || 'high';
  const timestamp = message?.timestamp;

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format text with bullet points and bold headers nicely
  const renderFormattedText = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-300 my-1">
            {trimmed.substring(2)}
          </li>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-700 dark:text-slate-300 my-1">
            {trimmed.replace(/^\d+\.\s/, '')}
          </li>
        );
      }

      return (
        <p key={idx} className="text-slate-800 dark:text-slate-200 my-1 leading-relaxed">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col gap-3 my-4 max-w-4xl mx-auto">
      {/* User Message Bubble */}
      {userText && (
        <div className="flex items-start justify-end gap-3">
          <div className="max-w-2xl bg-blue-600 text-white p-4 rounded-2xl rounded-tr-xs shadow-sm">
            <div className="flex items-center gap-2 mb-1 opacity-80 text-xs font-medium">
              <span>You</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{userText}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
            <User className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Bot Response Bubble */}
      {botText && (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center shrink-0 shadow-md border border-blue-400/30">
            <Bot className="w-5 h-5 text-blue-200" />
          </div>

          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-blue-900 dark:text-blue-300 tracking-wide uppercase">
                  BIS Compliance Copilot
                </span>
                <StatusBadge status={confidence} size="sm" />
              </div>

              <div className="flex items-center gap-2">
                {timestamp && (
                  <span className="text-[11px] text-slate-400 font-mono">{timestamp}</span>
                )}
                <button
                  onClick={() => handleCopy(botText)}
                  className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200">
              {renderFormattedText(botText)}
            </div>

            {/* Sources section if available */}
            {sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Sources ({sources.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sources.map((src, i) => (
                    <SourceCard key={i} source={src} />
                  ))}
                </div>
              </div>
            )}

            {/* Trust disclaimer */}
            <div className="mt-3 pt-2 text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-slate-400 shrink-0" />
              <span>AI-generated compliance guidance. Confirm critical decisions with official BIS notifications.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
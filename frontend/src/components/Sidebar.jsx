import React from 'react';
import {
  Home,
  MessageSquare,
  BarChart3,
  FileCheck2,
  QrCode,
  Search,
  Bell,
  Settings,
  ShieldCheck,
  X,
  ExternalLink,
  Award
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, mobileOpen, onMobileClose }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'ask', label: 'Ask BIS Copilot', icon: MessageSquare, badge: 'Live RAG' },
    { id: 'analyzer', label: 'Compliance Analyzer', icon: BarChart3, badge: 'What-If' },
    { id: 'auditor', label: 'Document Auditor', icon: FileCheck2, badge: 'Pre-Fill' },
    { id: 'scanner', label: 'ISI Mark Authenticity', icon: QrCode, badge: 'CML Check' },
    { id: 'explorer', label: 'Indian Standards Directory', icon: Search, badge: 'IS DB' },
    { id: 'alerts', label: 'QCO & Regulatory Alerts', icon: Bell, badge: 'Gazette' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-64 bg-[#0B2545] text-slate-100 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 bg-[#091E38]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#134074] border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-xs shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-white tracking-wide">BIS Copilot</span>
                </div>
                <p className="text-[10px] text-amber-300 font-medium">Compliance Assistant</p>
              </div>
            </div>

            <button
              onClick={onMobileClose}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Copilot Modules
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (onMobileClose) onMobileClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#134074] text-white font-bold border-l-4 border-amber-400 shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-[#091E38]">
          <a
            href="https://www.bis.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-lg bg-[#0B2545] border border-slate-700 text-slate-200 hover:text-white hover:border-amber-400 text-xs transition-all"
          >
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-[11px]">Visit Official BIS (bis.gov.in)</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>v2.4 SIH Prototype</span>
            </div>
            <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded font-mono">
              SIH Demo
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

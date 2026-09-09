import React from 'react';
import {
  Home,
  Brain,
  ClipboardCheck,
  ShieldCheck,
  Search,
  FileCheck,
  Bell,
  ChevronRight,
  X,
} from 'lucide-react';

function Sidebar({
  activeTab,
  onTabChange,
  mobileOpen,
  onMobileClose,
}) {
  const modules = [
    {
      id: 'know',
      label: 'KNOW',
      subtitle: 'Discover & Understand',
      icon: Brain,
      items: [
        {
          id: 'ask',
          label: 'AI Assistant',
          icon: Brain,
          badge: 'RAG',
        },
        {
          id: 'explorer',
          label: 'Standards Search',
          icon: Search,
          badge: 'IS DB',
        },
      ],
    },
    {
      id: 'comply',
      label: 'COMPLY',
      subtitle: 'Meet Requirements',
      icon: ClipboardCheck,
      items: [
        {
          id: 'analyzer',
          label: 'AI Assistant',
          icon: Brain,
          badge: 'AI',
        },
        {
          id: 'auditor',
          label: 'Document Auditor',
          icon: FileCheck,
          badge: 'Pre-Fill',
        },
        {
          id: 'alerts',
          label: 'QCO & Alerts',
          icon: Bell,
          badge: 'Live',
        },
      ],
    },
    {
      id: 'verify',
      label: 'VERIFY',
      subtitle: 'Trust & Authenticate',
      icon: ShieldCheck,
      items: [
        {
          id: 'scanner',
          label: 'AI Assistant',
          icon: Brain,
          badge: 'AI',
        },
      ],
    },
  ];

  const isModuleActive = (module) =>
    module.items.some((item) => item.id === activeTab);

  const handleNavigation = (id) => {
    onTabChange(id);

    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky
          top-0 left-0
          z-50
          h-screen
          w-72
          bg-slate-950
          text-white
          flex flex-col
          border-r border-slate-800
          transform transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800">
          <button
            onClick={() => handleNavigation('dashboard')}
            className="flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>

            <div>
              <div className="font-bold text-lg tracking-tight">
                BIS Copilot
              </div>
              <div className="text-xs text-slate-400">
                Compliance Assistant
              </div>
            </div>
          </button>

          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Home */}
        <div className="px-3 pt-4">
          <button
            onClick={() => handleNavigation('dashboard')}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition
              ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-950'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }
            `}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>

        {/* Modules */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {modules.map((module) => {
            const ModuleIcon = module.icon;
            const active = isModuleActive(module);

            return (
              <div key={module.id}>
                {/* Module heading */}
                <button
                  onClick={() => handleNavigation(module.items[0].id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 mb-1 rounded-xl
                    transition
                    ${
                      active
                        ? 'bg-slate-800'
                        : 'hover:bg-slate-900'
                    }
                  `}
                >
                  <div
                    className={`
                      w-9 h-9 rounded-lg flex items-center justify-center
                      ${
                        active
                          ? 'bg-white text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }
                    `}
                  >
                    <ModuleIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 text-left">
                    <div
                      className={`text-sm font-bold tracking-wide ${
                        active ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {module.label}
                    </div>

                    <div className="text-[11px] text-slate-500">
                      {module.subtitle}
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 ${
                      active ? 'text-white' : 'text-slate-600'
                    }`}
                  />
                </button>

                {/* Module features */}
                <div className="ml-5 pl-4 border-l border-slate-800 space-y-1">
                  {module.items.map((item) => {
                    const ItemIcon = item.icon;
                    const selected = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id)}
                        className={`
                          w-full flex items-center gap-2.5
                          px-3 py-2 rounded-lg
                          text-sm transition
                          ${
                            selected
                              ? 'bg-slate-800 text-white'
                              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                          }
                        `}
                      >
                        <ItemIcon className="w-4 h-4 shrink-0" />

                        <span className="flex-1 text-left">
                          {item.label}
                        </span>

                        {item.badge && (
                          <span
                            className={`
                              text-[9px] px-1.5 py-0.5 rounded-md
                              ${
                                selected
                                  ? 'bg-white text-slate-900'
                                  : 'bg-slate-800 text-slate-500'
                              }
                            `}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="text-[11px] text-slate-500 leading-relaxed">
            <div className="font-semibold text-slate-400 mb-1">
              Smart India Hackathon 2026
            </div>
            <div>
              AI-powered Intelligent Assistant
            </div>
            <div>
              for Indian Standards & BIS Services
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
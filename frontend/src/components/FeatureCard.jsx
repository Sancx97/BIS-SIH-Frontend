import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FeatureCard({ title, description, icon: Icon, badge, onClick, primary = false }) {
  return (
    <div
      onClick={onClick}
      className={`group relative p-5 rounded-xl cursor-pointer transition-all border ${
        primary
          ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-xs hover:bg-[#081B33]'
          : 'bg-white text-slate-800 border-slate-300 hover:border-[#0B2545] shadow-xs hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`p-3 rounded-lg ${
            primary
              ? 'bg-[#134074] text-amber-300 border border-amber-400/30'
              : 'bg-slate-100 text-[#0B2545]'
          }`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {badge && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              primary
                ? 'bg-amber-400 text-slate-950'
                : 'bg-blue-50 text-[#0B2545] border border-blue-200'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <h3 className={`text-sm font-bold mb-1.5 ${primary ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h3>
      <p className={`text-xs leading-relaxed mb-4 ${primary ? 'text-slate-200' : 'text-slate-600'}`}>
        {description}
      </p>

      <div
        className={`flex items-center text-xs font-semibold gap-1 group-hover:gap-2 transition-all ${
          primary ? 'text-amber-300' : 'text-[#0B2545]'
        }`}
      >
        <span>Open Portal Module</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

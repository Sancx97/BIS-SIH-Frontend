import React from 'react';
import { Bell, Calendar, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MOCK_ALERTS } from '../data/demoData';

export default function RegulatoryAlerts() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          BIS Regulatory Intelligence & QCO Alerts
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Live feed of Quality Control Orders (QCOs), standard revisions, and DPIIT mandatory enforcement notifications.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all space-y-3 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                  {alert.type}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" /> {alert.date}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                {alert.category}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {alert.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <b>What Changed:</b> {alert.whatChanged}
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <p className="text-slate-700 dark:text-slate-300">
                <b className="text-blue-600 dark:text-blue-400">Industry Impact:</b> {alert.impact}
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                <b className="text-emerald-600 dark:text-emerald-400">Recommended Action:</b> {alert.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

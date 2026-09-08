import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function ComplianceCard({ title, status, detail }) {
  let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
  let border = 'border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/50 dark:bg-emerald-950/20';

  if (status === 'warning') {
    icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
    border = 'border-amber-100 dark:border-amber-950/60 bg-amber-50/50 dark:bg-amber-950/20';
  } else if (status === 'error' || status === 'danger') {
    icon = <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
    border = 'border-rose-100 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20';
  }

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${border} transition-all`}>
      {icon}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </h4>
        {detail && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

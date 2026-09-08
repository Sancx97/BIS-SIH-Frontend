import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, ShieldCheck } from 'lucide-react';

export default function StatusBadge({ status, label, size = 'md' }) {
  let config = {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    defaultLabel: 'High Confidence'
  };

  if (status === 'warning' || status === 'medium' || status === 'verify') {
    config = {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
      defaultLabel: 'Verification Recommended'
    };
  } else if (status === 'error' || status === 'low' || status === 'unverified') {
    config = {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-300',
      icon: <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
      defaultLabel: 'Cannot Verify'
    };
  } else if (status === 'official' || status === 'verified') {
    config = {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      icon: <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
      defaultLabel: 'Official BIS Data'
    };
  }

  const textSizes = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.border} ${config.text} ${textSizes}`}>
      {config.icon}
      <span>{label || config.defaultLabel}</span>
    </span>
  );
}

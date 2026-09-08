import React from 'react';

export default function ComplianceScore({ score = 82, size = 120, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = 'stroke-emerald-500';
  let textColor = 'text-emerald-600 dark:text-emerald-400';
  if (score < 60) {
    color = 'stroke-rose-500';
    textColor = 'text-rose-600 dark:text-rose-400';
  } else if (score < 85) {
    color = 'stroke-amber-500';
    textColor = 'text-amber-600 dark:text-amber-400';
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-100 dark:stroke-slate-800"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`text-2xl font-bold font-mono ${textColor}`}>{score}%</span>
        <span className="text-[10px] uppercase font-semibold text-slate-400">Compliance</span>
      </div>
    </div>
  );
}

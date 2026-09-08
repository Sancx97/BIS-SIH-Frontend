import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';

export default function SourceCard({ source }) {
  if (!source) return null;

  const title = source.title || 'BIS Official Publication';
  const url = source.url || 'https://www.bis.gov.in';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all text-left"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="truncate">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {url}
          </p>
        </div>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 ml-2 transition-colors" />
    </a>
  );
}

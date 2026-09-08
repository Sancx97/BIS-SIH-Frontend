import React, { useState } from 'react';
import { Search, ShieldCheck, Filter, ExternalLink, BookOpen, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { MOCK_STANDARDS } from '../data/demoData';
import SourceCard from '../components/SourceCard';
import StatusBadge from '../components/StatusBadge';

export default function StandardExplorer({ initialQuery }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced IS Parameter Filters (Aryan's Idea)
  const [isYear, setIsYear] = useState('');
  const [isPart, setIsPart] = useState('');
  const [labName, setLabName] = useState('');

  // Interactive FAQs Accordion (Sanchita's Idea)
  const [openFaq, setOpenFaq] = useState(null);

  const categories = ['All', 'Household Appliances', 'Electronics & IT', 'Batteries & Energy Storage', 'Consumer Goods & Toys', 'Renewable Energy'];

  const faqs = [
    {
      q: "What is the difference between Scheme-I (ISI Mark) and Scheme-II (CRS)?",
      a: "Scheme-I (ISI Mark) involves factory audit + product sample testing. Scheme-II (Compulsory Registration Scheme) requires self-declaration of conformity based on NABL test reports without pre-license factory audit."
    },
    {
      q: "How do I check if my product falls under a mandatory QCO?",
      a: "Search your product name or IS code in our Standards Explorer or Regulatory Alerts tab. Products covered under QCOs cannot be manufactured, imported, or sold without valid BIS certification."
    },
    {
      q: "Are foreign manufacturers required to get BIS certification for exports to India?",
      a: "Yes. Foreign manufacturers must apply under the Foreign Manufacturers Certification Scheme (FMCS) for ISI Mark or under CRS for registered electronics."
    }
  ];

  const filteredStandards = MOCK_STANDARDS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = !isYear.trim() || item.number.includes(isYear.trim());
    return matchesCategory && matchesSearch && matchesYear;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          Indian Standards Explorer & Parameter Directory
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search over 22,000+ Indian Standards published by the Bureau of Indian Standards with advanced parameters.
        </p>
      </div>

      {/* Main Search & Advanced Toggle */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search standards, products or IS numbers (e.g., IS 2347, IS 13252)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Filter className="w-4 h-4 text-blue-600" />
            <span>{showAdvanced ? 'Hide Advanced Filters' : 'Advanced IS Filters'}</span>
          </button>
        </div>

        {/* Advanced Parameter Search Panel (Aryan's Idea) */}
        {showAdvanced && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">IS Code Year</label>
              <input
                type="text"
                value={isYear}
                onChange={(e) => setIsYear(e.target.value)}
                placeholder="e.g. 2017 or 2019"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">IS Part / Section</label>
              <input
                type="text"
                value={isPart}
                onChange={(e) => setIsPart(e.target.value)}
                placeholder="e.g. Part 1 or Section 2"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Testing Lab Name</label>
              <input
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                placeholder="e.g. CPRI or NABL Lab"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Standards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStandards.map((std) => (
          <div
            key={std.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all space-y-4 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono">
                  {std.number}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                  {std.title}
                </h3>
              </div>
              <StatusBadge status="official" label={std.scheme} size="sm" />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {std.relevance}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Key Test Requirements:
              </span>
              {std.keyRequirements.map((req, idx) => (
                <li key={idx} className="ml-4 text-xs text-slate-700 dark:text-slate-300 list-disc">
                  {req}
                </li>
              ))}
            </div>

            <div className="pt-2">
              <a
                href={std.sources[0]?.url || 'https://www.bis.gov.in'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>View Official BIS Standard Details</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive FAQs Section (Sanchita's Idea) */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" /> Frequently Asked BIS Compliance Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all"
                onClick={() => setOpenFaq(isOpen ? null : i)}
              >
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
                {isOpen && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-2">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

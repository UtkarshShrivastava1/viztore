import React, { useState } from 'react';
import { Search, FileText, ChevronDown, ChevronRight, ThumbsUp, ThumbsDown, BookOpen } from 'lucide-react';
import { useSupportStore } from '../../stores/supportStore.js';

export const HelpCenterTab: React.FC = () => {
  const { helpTopics } = useSupportStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(helpTopics[0]?.id || null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Product Catalog', 'Order Management', 'Store Operations', 'Payouts & Banking', 'Billing & Invoicing', 'Returns & Refunds'];

  const filteredTopics = helpTopics.filter((topic) => {
    const matchCat = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchSearch =
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.content.toLowerCase().includes(search.toLowerCase()) ||
      topic.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleFeedback = (id: string) => {
    setFeedbackGiven((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-3xl p-8 text-white space-y-4 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Merchant Knowledge Hub</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">How can we assist you today?</h2>
          <p className="text-xs text-blue-100">
            Find instant walkthroughs, operational configurations, and step-by-step merchant guides.
          </p>
        </div>

        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides, e.g. how to add products, invoice setup, payouts..."
            className="w-full pl-10 pr-4 py-3 bg-white text-slate-800 rounded-2xl text-xs placeholder-slate-400 focus:outline-none shadow-lg"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topics Accordion List */}
      <div className="space-y-3">
        {filteredTopics.map((topic) => {
          const isExpanded = expandedId === topic.id;

          return (
            <div
              key={topic.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{topic.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{topic.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                    {topic.readTime}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-4">
                  <div className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                    {topic.content}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs text-slate-500">
                    <span>Was this article helpful?</span>
                    {feedbackGiven[topic.id] ? (
                      <span className="text-emerald-600 font-bold text-[11px]">Thank you for your feedback!</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleFeedback(topic.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                          <span>Yes</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(topic.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold"
                        >
                          <ThumbsDown className="w-3.5 h-3.5 text-slate-500" />
                          <span>No</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

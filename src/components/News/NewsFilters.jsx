import React from 'react';
import { Search, RefreshCw, Filter } from 'lucide-react';
import useStore from '../../store/useStore';

const NewsFilters = ({ onRefresh }) => {
  const { newsCategory, setNewsCategory, newsSearch, setNewsSearch, isDarkMode } = useStore();

  const categories = [
    { id: 'technology', name: 'Technology' },
    { id: 'space', name: 'Space' },
    { id: 'science', name: 'Science' },
    { id: 'astronomy', name: 'Astronomy' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setNewsCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              newsCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-grow md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search articles..."
            value={newsSearch}
            onChange={(e) => setNewsSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
          />
        </div>
        
        <button
          onClick={onRefresh}
          className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-800"
          title="Refresh Category"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
};

export default NewsFilters;

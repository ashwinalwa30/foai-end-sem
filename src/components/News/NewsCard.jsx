import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

const NewsCard = ({ article }) => {
  return (
    <div className="glass dark:glass-dark rounded-2xl overflow-hidden flex flex-col h-full border border-white/10 group">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={article.urlToImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000'} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000';
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
            {article.source.name}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
          </div>
          {article.author && (
            <div className="flex items-center gap-1 truncate max-w-[120px]">
              <User size={14} />
              {article.author}
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-indigo-500 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-grow">
          {article.description || 'No description available for this article.'}
        </p>
        
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-300 font-medium text-sm group/btn"
        >
          Read More
          <ExternalLink size={16} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;

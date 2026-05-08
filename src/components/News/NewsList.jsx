import React from 'react';
import NewsCard from './NewsCard';
import { NewsSkeleton } from '../UI/Skeleton';
import useStore from '../../store/useStore';

const NewsList = () => {
  const { newsArticles, newsLoading, newsSearch } = useStore();

  const filteredArticles = newsArticles.filter(article => 
    article.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
    (article.description && article.description.toLowerCase().includes(newsSearch.toLowerCase()))
  );

  if (newsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <NewsSkeleton key={i} />)}
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="text-center py-20 glass dark:glass-dark rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400 text-lg">No articles found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredArticles.map((article, index) => (
        <NewsCard key={`${article.url}-${index}`} article={article} />
      ))}
    </div>
  );
};

export default NewsList;

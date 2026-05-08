import axios from 'axios';

const CACHE_KEY_PREFIX = 'news_cache_';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const IS_DEV = import.meta.env.DEV;

const CATEGORY_MAP = {
  technology: 'technology',
  space: 'science',
  science: 'science',
  astronomy: 'science',
};

export const fetchNews = async (category = 'technology') => {
  const cacheKey = `${CACHE_KEY_PREFIX}${category}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    const { timestamp, articles } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return articles;
    }
  }

  try {
    let articles = [];

    if (IS_DEV) {
      // On localhost: call NewsAPI directly (CORS allowed in dev / localhost)
      const mappedCategory = CATEGORY_MAP[category] || 'technology';
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          category: mappedCategory,
          language: 'en',
          pageSize: 10,
          apiKey: NEWS_API_KEY,
        },
      });
      articles = (response.data.articles || []).map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: { name: article.source?.name || 'Unknown' },
        author: article.author || article.source?.name || 'Unknown',
      }));
    } else {
      // In production (Netlify): use the serverless proxy to avoid CORS
      const response = await axios.get(`/api/news?category=${category}`);
      articles = response.data.articles || [];
    }

    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), articles }));
    return articles;
  } catch (error) {
    console.error('Error fetching news:', error?.response?.data || error.message);
    if (cachedData) {
      return JSON.parse(cachedData).articles;
    }
    return [];
  }
};

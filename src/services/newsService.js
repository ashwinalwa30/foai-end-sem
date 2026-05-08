import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const CACHE_KEY_PREFIX = 'news_cache_';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

export const fetchNews = async (category = 'technology') => {
  const cacheKey = `${CACHE_KEY_PREFIX}${category}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    const { timestamp, articles } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return articles;
    }
  }

  if (!NEWS_API_KEY) {
    return [];
  }

  try {
    // Updated to use GNews API format
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        category: category === 'technology' ? 'technology' : 'science', // GNews has specific categories
        lang: 'en',
        max: 10,
        apikey: NEWS_API_KEY
      }
    });

    // Map GNews response to our common format
    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.image,
      publishedAt: article.publishedAt,
      source: { name: article.source.name },
      author: article.source.name // GNews doesn't always provide author name separately
    }));

    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      articles
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    if (cachedData) {
      return JSON.parse(cachedData).articles;
    }
    throw error;
  }
};

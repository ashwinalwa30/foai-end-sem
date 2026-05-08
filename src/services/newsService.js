import axios from 'axios';

const CACHE_KEY_PREFIX = 'news_cache_';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

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
    // Always use the Netlify proxy (works via netlify dev locally, and functions in production)
    const response = await axios.get(`/api/news?category=${category}`);
    const articles = response.data.articles || [];

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

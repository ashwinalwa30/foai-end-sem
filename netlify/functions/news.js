export default async (req, context) => {
  const url = new URL(req.url);
  const category = url.searchParams.get('category') || 'technology';

  const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;

  if (!NEWS_API_KEY) {
    return new Response(JSON.stringify({ error: 'News API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    // Map categories to NewsAPI valid values
    const categoryMap = {
      technology: 'technology',
      space: 'science',
      science: 'science',
      astronomy: 'science',
    };
    const mappedCategory = categoryMap[category] || 'technology';

    const apiUrl = `https://newsapi.org/v2/top-headlines?category=${mappedCategory}&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok || data.status === 'error') {
      return new Response(JSON.stringify({ error: data.message || 'NewsAPI error' }), {
        status: response.status || 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const articles = (data.articles || []).map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: { name: article.source?.name || 'Unknown' },
      author: article.author || article.source?.name || 'Unknown',
    }));

    return new Response(JSON.stringify({ articles }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
};

export const config = {
  path: '/api/news',
};

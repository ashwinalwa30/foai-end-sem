const CATEGORY_MAP = {
  technology: 'technology',
  space: 'science',
  science: 'science',
  astronomy: 'science',
};

exports.handler = async function (event, context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const category = event.queryStringParameters?.category || 'technology';
  const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;

  if (!NEWS_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'News API key not configured on server.' }),
    };
  }

  try {
    const mappedCategory = CATEGORY_MAP[category] || 'technology';
    const url = `https://newsapi.org/v2/top-headlines?category=${mappedCategory}&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.status === 'error') {
      return {
        statusCode: response.status || 500,
        headers,
        body: JSON.stringify({ error: data.message || 'NewsAPI error' }),
      };
    }

    const articles = (data.articles || []).map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: { name: article.source?.name || 'Unknown' },
      author: article.author || article.source?.name || 'Unknown',
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ articles }) };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

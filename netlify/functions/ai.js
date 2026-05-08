const MODEL = 'HuggingFaceH4/zephyr-7b-beta';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callHuggingFace = async (token, payload, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    // Model is loading — wait and retry
    if (response.status === 503 || (data?.error && data.error.includes('loading'))) {
      const waitTime = data?.estimated_time ? data.estimated_time * 1000 : 5000;
      console.log(`Model loading, waiting ${waitTime}ms (attempt ${attempt}/${retries})`);
      if (attempt < retries) await sleep(Math.min(waitTime, 8000));
      continue;
    }

    return { status: response.status, data };
  }

  return {
    status: 503,
    data: { error: 'Model is still loading. Please try again in a moment.' },
  };
};

exports.handler = async function (event, context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const HF_TOKEN = process.env.VITE_AI_TOKEN;

  if (!HF_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'AI token not configured on server.' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { inputs, parameters } = body;

    const { status, data } = await callHuggingFace(HF_TOKEN, { inputs, parameters });

    return { statusCode: status, headers, body: JSON.stringify(data) };
  } catch (error) {
    console.error('AI function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

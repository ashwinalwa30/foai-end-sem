const MODEL = 'HuggingFaceH4/zephyr-7b-beta'; // More reliable free-tier model, stays warm

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
    if (response.status === 503 || data?.error?.includes('loading')) {
      const waitTime = data?.estimated_time ? data.estimated_time * 1000 : 5000;
      console.log(`Model loading, waiting ${waitTime}ms before retry ${attempt}/${retries}...`);
      if (attempt < retries) await sleep(Math.min(waitTime, 8000));
      continue;
    }

    return { status: response.status, data };
  }

  return { status: 503, data: { error: 'Model is still loading after multiple retries. Try again in a moment.' } };
};

export default async (req, context) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const HF_TOKEN = process.env.VITE_AI_TOKEN;

  if (!HF_TOKEN) {
    return new Response(JSON.stringify({ error: 'AI token not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const body = await req.json();
    const { inputs, parameters } = body;

    const { status, data } = await callHuggingFace(HF_TOKEN, { inputs, parameters });

    return new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('AI function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
};

export const config = {
  path: '/api/ai',
};

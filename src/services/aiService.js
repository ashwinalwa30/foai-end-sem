import axios from 'axios';

const HF_TOKEN = import.meta.env.VITE_AI_TOKEN;
const MODEL = 'HuggingFaceH4/zephyr-7b-beta';
const IS_DEV = import.meta.env.DEV;

export const getAiResponse = async (userMessage, dashboardContext) => {
  const { issData, newsData } = dashboardContext;

  const systemPrompt = `You are a helpful ISS dashboard assistant. Only answer based on the dashboard data below.
If asked about something not in this data, say: "I can only answer based on dashboard data."

Dashboard Data:
- ISS Location: Lat ${issData.latitude}, Lon ${issData.longitude}
- ISS Speed: ${issData.speed} km/h
- Nearest Place: ${issData.locationName}
- Astronauts in Space: ${issData.astronautCount} (${issData.astronauts.join(', ')})
- Recent News Headlines: ${newsData.slice(0, 5).map(a => a.title).join(' | ')}`;

  // Zephyr prompt format
  const prompt = `<|system|>\n${systemPrompt}</s>\n<|user|>\n${userMessage}</s>\n<|assistant|>`;

  const payload = {
    inputs: prompt,
    parameters: {
      max_new_tokens: 200,
      temperature: 0.7,
      return_full_text: false,
    },
  };

  try {
    let data;

    if (IS_DEV) {
      // On localhost: call Hugging Face directly
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${MODEL}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      data = response.data;
    } else {
      // In production (Netlify): use the serverless proxy to avoid CORS
      const response = await axios.post('/api/ai', payload);
      data = response.data;
    }

    if (data?.error) {
      console.error('HF API error:', data.error);
      return data.error.includes('loading')
        ? 'The AI model is warming up. Please try again in a few seconds.'
        : 'The AI returned an error. Please try again.';
    }

    const result = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
    return result?.trim() || 'No response generated. Please try again.';
  } catch (error) {
    console.error('AI Error:', error?.response?.data || error.message);
    return 'Unable to reach the AI. Please check your connection and try again.';
  }
};

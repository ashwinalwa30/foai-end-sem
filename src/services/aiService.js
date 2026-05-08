import axios from 'axios';

const MODEL = 'HuggingFaceH4/zephyr-7b-beta';

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

  // Zephyr-7b-beta prompt format
  const prompt = `<|system|>\n${systemPrompt}</s>\n<|user|>\n${userMessage}</s>\n<|assistant|>`;

  try {
    // Always use the Netlify proxy (works via netlify dev locally, and functions in production)
    const response = await axios.post('/api/ai', {
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    const data = response.data;

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
    return 'Unable to reach the AI. Please try again.';
  }
};

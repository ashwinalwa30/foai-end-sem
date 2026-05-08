import axios from 'axios';

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

  // Zephyr-7b-beta uses <|system|> / <|user|> / <|assistant|> format
  const prompt = `<|system|>\n${systemPrompt}</s>\n<|user|>\n${userMessage}</s>\n<|assistant|>`;

  try {
    const response = await axios.post('/api/ai', {
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        return_full_text: false, // Only return the new generated text, not the prompt
      }
    });

    const data = response.data;

    // Handle error responses from HF
    if (data?.error) {
      console.error('HF API error:', data.error);
      return 'The AI model is currently busy. Please try again in a few seconds.';
    }

    // zephyr returns array: [{ generated_text: "..." }]
    const result = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;

    return result?.trim() || 'No response generated. Please try again.';
  } catch (error) {
    console.error('AI Error:', error?.response?.data || error.message);
    return 'Unable to reach the AI. Please check your connection and try again.';
  }
};

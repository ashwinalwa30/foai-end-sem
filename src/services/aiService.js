import axios from 'axios';

export const getAiResponse = async (userMessage, dashboardContext) => {
  const { issData, newsData } = dashboardContext;

  const systemPrompt = `
You are a helpful dashboard assistant. You can ONLY answer questions based on the provided dashboard data (ISS and News).
If a user asks about something not in the data, respond with: "I can only answer based on dashboard data."

Current Dashboard Data:
- ISS Location: Lat ${issData.latitude}, Lon ${issData.longitude}
- ISS Speed: ${issData.speed} km/h
- Nearest Place: ${issData.locationName}
- Astronauts in Space: ${issData.astronautCount} (${issData.astronauts.join(', ')})
- Recent News Headlines: ${newsData.map(a => a.title).join(' | ')}

Rule: Do NOT use any external knowledge. No internet browsing. No guessing.
`;

  try {
    // Call our Netlify proxy function instead of Hugging Face directly (fixes CORS in production)
    const response = await axios.post('/api/ai', {
      inputs: `<s>[INST] ${systemPrompt} \n User: ${userMessage} [/INST]`,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
      }
    });

    let result = response.data[0]?.generated_text || '';

    // Extract only the assistant response after [/INST]
    if (result.includes('[/INST]')) {
      result = result.split('[/INST]').pop().trim();
    }

    return result || 'No response generated.';
  } catch (error) {
    console.error('AI Error:', error);
    return 'Sorry, I encountered an error while processing your request. The AI model may be loading — please try again in a moment.';
  }
};

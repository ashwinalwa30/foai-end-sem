import axios from 'axios';

const HF_TOKEN = import.meta.env.VITE_AI_TOKEN;
const MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';

export const getAiResponse = async (userMessage, dashboardContext) => {
  if (!HF_TOKEN) {
    return "AI Token is missing. Please check your .env file.";
  }

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
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        inputs: `<s>[INST] ${systemPrompt} \n User: ${userMessage} [/INST]`,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );

    let result = response.data[0].generated_text;
    // Extract only the assistant response
    if (result.includes('[/INST]')) {
      result = result.split('[/INST]').pop().trim();
    }
    
    return result;
  } catch (error) {
    console.error('AI Error:', error);
    return "Sorry, I encountered an error while processing your request. Please check if the model is loading or the token is valid.";
  }
};

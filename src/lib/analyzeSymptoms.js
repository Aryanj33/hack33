import axios from 'axios';

const client = axios.create({
  baseURL: 'https://chatapi.akash.network/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-VeU_w9Wjl-xYW2XTkUP-Rg'
  }
});

export const analyzeSymptoms = async ({ symptoms, includeConditions, includePrecautions, includeMedicalAttention, includeLifestyleRecommendations }) => {
  try {
    const response = await client.post('/chat/completions', {
      model: "Meta-Llama-3-1-8B-Instruct-FP8",
      messages: [
        {
          role: "system",
          content: `You are a medical analysis assistant. Analyze the following symptoms and provide a detailed response with proper indentation spacing and section. Include:
${includeConditions ? '- Possible conditions\n' : ''}
${includePrecautions ? '- Precautions to take\n' : ''}
${includeMedicalAttention ? '- When to seek medical attention\n' : ''}
${includeLifestyleRecommendations ? '- Lifestyle recommendations\n' : ''}`
        },
        {
          role: "user",
          content: symptoms
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error('Failed to analyze symptoms. Please try again later.');
  }
};
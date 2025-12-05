
import { AIMessage } from '../types';

const API_KEY = "a113f8a4-3ed2-4a59-a807-80ca905193aa";
const ENDPOINT_ID = "ep-20251206004159-62sdt";
const API_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

/**
 * Sends chat history to Doubao (ARK) API and returns the response text.
 */
export const sendMessageToDoubao = async (
  messages: AIMessage[], 
  currentLocation: string
): Promise<string> => {
  
  // Convert app's message format to OpenAI/ARK compatible format
  const apiMessages = [
    {
      role: "system",
      content: `You are a helpful, enthusiastic, and knowledgeable travel assistant helping a user plan a trip to ${currentLocation}. 
      Keep your responses concise, friendly, and practical. 
      Format your response in plain text (Markdown is supported).`
    },
    ...messages.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }))
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: apiMessages,
        stream: false,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Doubao API Error:", errorData);
      throw new Error(`API Request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

  } catch (error) {
    console.error("Failed to fetch from Doubao:", error);
    return "I'm having trouble connecting to the network right now. Please try again later.";
  }
};

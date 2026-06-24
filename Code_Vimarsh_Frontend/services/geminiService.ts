import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure this is configured in your environment when running locally or deployed.
// For the sake of this SPA, we expect it to be available.
const API_KEY = process.env.API_KEY || "";

let aiClient: GoogleGenAI | null = null;

try {
  if (API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
}

export const generateChatResponse = async (prompt: string): Promise<string> => {
  if (!aiClient) {
    return "I am currently offline. Please ensure the API key is configured in the environment.";
  }

  try {
    const response: GenerateContentResponse = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are Vimarsh AI, the official intelligent assistant for 'Code Vimarsh', the coding club of MSU Baroda. 
        Your tone is professional, elite, clean, structured, and developer-centric. 
        You help students with coding questions, explain club events, suggest project ideas, and guide them on how to earn certificates or join the club. 
        Keep your answers concise, formatting code blocks properly if needed. Do not use a childish or overly enthusiastic tone.`,
        temperature: 0.7,
      }
    });
    
    return response.text || "I couldn't process that request at the moment.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "An error occurred while communicating with my neural net. Please try again later.";
  }
};
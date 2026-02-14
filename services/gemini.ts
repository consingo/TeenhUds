
import { GoogleGenAI } from "@google/genai";

export const generateMotivation = async (userName: string, mood?: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Write a short, uplifting, and modern motivational message for a teenager named ${userName}. 
    ${mood ? `They are currently feeling ${mood}.` : 'They are looking for some general inspiration.'}
    Include a relevant bible verse or wisdom quote. Keep it relatable, energetic, and encouraging. 
    Use a friendly tone that resonates with modern youth.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "You are amazing! Keep shining your light on the world. Your journey is unique and your potential is limitless.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Stay strong! You are capable of more than you know. Remember that every small step counts towards a great future.";
  }
};

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

class GeminiService {
  public initAI(): GoogleGenAI {
    // IMPORTANT: API key must be set in environment variables.
    // Do not hardcode the key in the code.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey });
  }

  public async generateAnswer(ai: GoogleGenAI, prompt: string, imageBase64?: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const systemInstruction = "You are Klug AI, a friendly and helpful study buddy. Your responses should be short, encouraging, and use emojis to convey a friendly tone, like you're texting a friend. 🧑‍🏫✨";

    try {
      if (imageBase64) {
        const imagePart = {
          inlineData: {
            mimeType: 'image/jpeg', // Assuming jpeg, adjust if necessary
            data: imageBase64.split(',')[1], // Remove the data URI prefix
          },
        };
        const textPart = { text: prompt };
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return response.text;
      } else {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return response.text;
      }
    } catch (error) {
      console.error("Error generating content from Gemini:", error);
      throw new Error("Failed to get a response from the AI.");
    }
  }
}

export const geminiService = new GeminiService();
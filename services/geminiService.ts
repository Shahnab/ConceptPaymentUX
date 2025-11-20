import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateReminderMessage = async (
  senderName: string,
  recipientName: string,
  tripName: string,
  amount: string
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return `Hey ${recipientName}, please pay ${amount} for ${tripName}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, friendly, and polite text message reminder from ${senderName} to ${recipientName} asking for their share of ${amount} for the trip "${tripName}". Keep it under 20 words. Include emojis.`,
    });
    return response.text || `Hey ${recipientName}, kindly remind you to pay ${amount} for ${tripName}.`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Hey ${recipientName}, please pay ${amount} for ${tripName}.`;
  }
};

export const suggestTripBudget = async (destination: string, peopleCount: number): Promise<{ title: string, total: number }> => {
  const ai = getAiClient();
  if (!ai) return { title: `Trip to ${destination}`, total: 5000 * peopleCount };

  try {
     // We want a JSON response
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a realistic budget estimate for a luxury 5-day trip to ${destination} for ${peopleCount} people. Return a JSON object with "title" (string) and "total" (number).`,
        config: { responseMimeType: "application/json" }
     });
     
     const text = response.text;
     return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Budget Error:", error);
    return { title: `Trip to ${destination}`, total: 2000 * peopleCount };
  }
};
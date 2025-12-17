import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in .env");
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function getGeminiResponse(
  chatHistory,
  imageBase64,
  documentText
) {
  const contents = [];

  for (const msg of chatHistory) {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    });
  }

  if (documentText) {
    contents.unshift({
      role: "model",
      parts: [
        {
          text: `Use the following document as context:\n${documentText}`,
        },
      ],
    });
  }

  if (imageBase64) {
    contents.push({
      role: "user",
      parts: [
        {
          inlineData: {
            mimeType: imageBase64.mimeType,
            data: imageBase64.data,
          },
        },
      ],
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  return response.text;
}

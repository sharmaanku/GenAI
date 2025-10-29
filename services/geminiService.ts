
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash-image';

const extractImageFromResponse = (response: any): string => {
    const parts = response?.candidates?.[0]?.content?.parts;
    if (!parts) {
        throw new Error("Invalid response structure from Gemini API.");
    }

    for (const part of parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image data found in the Gemini API response.");
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        return extractImageFromResponse(response);
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. Please check your prompt and API key.");
    }
};

export const editImage = async (prompt: string, base64ImageDataUrl: string, mimeType: string): Promise<string> => {
    try {
        // The API expects a raw base64 string, not a data URL.
        const base64Data = base64ImageDataUrl.split(',')[1];
        
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: mimeType,
                        },
                    },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        return extractImageFromResponse(response);
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image. Please check your prompt, image, and API key.");
    }
};

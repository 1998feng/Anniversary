
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePhotoCaption = async (photoTitle: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "画面永远那么美丽。（请在 .env 文件中添加 API_KEY 以启用 AI 智能解说）";
  }

  try {
    const model = 'gemini-2.5-flash';
    // Request Chinese output explicitly
    // Context updated to "1st Anniversary"
    const prompt = `请为恋爱一周年纪念相册中一张标题为 "${photoTitle}" 的照片写一段简短、浪漫、充满诗意的中文描述。请保持在 30 个字以内。`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "定格在时间里的美好瞬间。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "这一刻，值得永远珍藏。";
  }
};

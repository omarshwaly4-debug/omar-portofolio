
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askGemini = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "أنت مساعد ذكي متخصص في الأذكار والأدعية الإسلامية. أجب بوضوح ولغة عربية فصحى جميلة. قدم أدعية من القرآن والسنة عند الطلب.",
        temperature: 0.7,
      }
    });
    return response.text || "عذراً، لم أستطع الحصول على إجابة حالياً.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ في الاتصال بالمساعد الذكي.";
  }
};

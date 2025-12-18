
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const generateAssistantContent = async (prompt: string, context: string = "") => {
  if (!API_KEY) {
    throw new Error("API Key tidak dikonfigurasi.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    Anda adalah AI Asisten untuk Sistem Informasi Organisasi Warga (SI-WARGA).
    Tugas Anda adalah membantu admin menyusun konten yang rapi, jelas, sopan, dan informatif dalam Bahasa Indonesia yang formal.
    Kontek sistem: ${context}
    Aturan:
    1. Gunakan Bahasa Indonesia yang baku dan sopan.
    2. Jika diminta menulis sejarah/profil, buat narasi yang netral dan faktual.
    3. Jika diminta membuat artikel berita, buat judul yang menarik dan isi yang jelas (5W+1H).
    4. Selalu prioritaskan transparansi dan kedekatan dengan warga.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const improveDraft = async (draft: string) => {
  const prompt = `Perbaiki draf konten berikut agar lebih profesional, rapi, dan menggunakan Bahasa Indonesia yang formal: "${draft}"`;
  return generateAssistantContent(prompt, "Editor Konten");
};

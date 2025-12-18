
import { GoogleGenAI } from "@google/genai";

export const generateAssistantContent = async (prompt: string, context: string = "") => {
  // Always use a new GoogleGenAI instance with process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    Anda adalah AI Asisten untuk Sistem Informasi Desa (SI-DESA).
    Tugas Anda adalah membantu perangkat desa menyusun konten resmi, surat edaran, narasi pembangunan, dan berita desa.
    Gunakan Bahasa Indonesia formal (EYD), sopan, dan berwibawa sebagai representasi pemerintah desa.
    Kontek sistem: ${context}
    Aturan Khusus:
    1. Hindari penggunaan kata ganti "aku/kamu", gunakan "kami/Pemerintah Desa" dan "Warga/Masyarakat".
    2. Jika menulis berita pembangunan, sertakan dampak positif bagi kesejahteraan desa.
    3. Pastikan format tulisan rapi dan mudah dibaca oleh warga lintas usia.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    // Directly access the text property from GenerateContentResponse
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

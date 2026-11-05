
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Menggunakan model Gemini terbaru dengan system instruction khusus sekolah
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Kamu adalah SPENDASI AI ASSISTANT, asisten virtual resmi informasi SMP Negeri 2 Sidoarjo. Tugasmu adalah membantu siswa, orang tua, dan masyarakat mendapatkan informasi mengenai SMP Negeri 2 Sidoarjo secara ramah, sopan, dan akurat berdasarkan data resmi."
        });
        
        const result = await model.generateContent(message);
        const responseText = result.response.text();

        return res.status(200).json({ reply: responseText });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Gagal memproses AI' });
    }
}

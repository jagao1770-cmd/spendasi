export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(200).json({ reply: 'Error: GEMINI_API_KEY belum diatur di Environment Variables Vercel.' });
        }

        // Menggunakan model gemini-pro yang universal dan stabil
        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Kamu adalah SPENDASI AI ASSISTANT, asisten virtual resmi informasi SMP Negeri 2 Sidoarjo. Jawablah pertanyaan berikut dengan ramah dan akurat: ${message}` }]
                }]
            })
        });

        const data = await apiResponse.json();

        if (data.error) {
            return res.status(200).json({ reply: `Google API Error: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const replyText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: replyText });
        } else {
            return res.status(200).json({ reply: 'Maaf, format respons dari server AI tidak dikenali.' });
        }

    } catch (error) {
        return res.status(200).json({ reply: `Server Error: ${error.message}` });
    }
}

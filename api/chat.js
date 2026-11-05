export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API Key belum dikonfigurasi di environment variables.' });
        }

        // Menggunakan Gemini API secara langsung via fetch (stabil di serverless)
        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Kamu adalah SPENDASI AI ASSISTANT, asisten virtual resmi informasi SMP Negeri 2 Sidoarjo. Jawablah pertanyaan berikut dengan ramah dan akurat: ${message}` }]
                }]
            })
        });

        const data = await apiResponse.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const replyText = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: replyText });
        } else {
            return res.status(500).json({ error: 'Format respons AI tidak valid.' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Gagal memproses AI.' });
    }
}

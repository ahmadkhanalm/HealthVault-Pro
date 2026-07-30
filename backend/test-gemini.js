require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("AI initialized");
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: "say hi",
            config: {}
        });
        console.log("Response text:", response.text);
    } catch (e) {
        console.error("Error generating content:", e);
    }
}
test();

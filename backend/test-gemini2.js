require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: "say hi",
            config: {}
        });
        console.log("Success:", response.text);
    } catch (e) {
        console.error("Error generating content:", e);
    }
}
test();

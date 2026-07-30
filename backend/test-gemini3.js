require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("Testing gemini-2.5-flash...");
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "say hi, give me a very short response.",
        });
        console.log("Success:", response.text);
    } catch (e) {
        console.error("Error generating content:", e);
    }
}
test();

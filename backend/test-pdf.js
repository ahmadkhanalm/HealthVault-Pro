require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const fs = require('fs');

async function test() {
    console.log("Starting test with PDFs...");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Hardcode paths to the patient's PDFs from the store.json
    const fullPath1 = path.join(__dirname, '/uploads/file-1771606199716.pdf');
    const fullPath2 = path.join(__dirname, '/uploads/file-1771606207164.pdf');

    if (!fs.existsSync(fullPath1) || !fs.existsSync(fullPath2)) {
        console.error("Files not found!");
        return;
    }

    const part1 = {
        inlineData: {
            data: Buffer.from(fs.readFileSync(fullPath1)).toString("base64"),
            mimeType: 'application/pdf'
        }
    };

    const part2 = {
        inlineData: {
            data: Buffer.from(fs.readFileSync(fullPath2)).toString("base64"),
            mimeType: 'application/pdf'
        }
    };

    console.log("Sending to Gemini...");
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [part1, part2, "Compare these reports in JSON format. { \"summary\": \"...\", \"comparisons\": [{ \"metric\": \"str\", \"oldValue\": \"str\", \"newValue\": \"str\", \"status\": \"improved/worsened/stable\"}], \"recommendations\": [\"str\"] }"],
            config: {
                responseMimeType: "application/json"
            }
        });
        console.log("Success:", response.text || response.candidates[0].content.parts[0].text);
    } catch (e) {
        console.error("Error generating content:", e);
    }
}
test();

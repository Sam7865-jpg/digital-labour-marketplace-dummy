import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/extract-skills', async (req, res) => {
  try {
    const { experienceText } = req.body;

    if (!experienceText) {
      return res.status(400).json({ message: "Experience text is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Extract skills from this worker text and return ONLY a valid JSON object in this exact format:
      {
        "extractedSkills": [
          { "skillName": "Skill Name", "proficiency": "Intermediate" }
        ]
      }

      Text: "${experienceText}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    return res.status(200).json({
      message: "AI ne kamyabi se skills extract kar lein!",
      extractedSkills: parsedData.extractedSkills || []
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      message: "AI Skill Extraction failed",
      error: error.message
    });
  }
});

export default router;
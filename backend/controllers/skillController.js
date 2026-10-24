import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAiSkillProfile = async (req, res) => {
  try {
    const { experienceText, category } = req.body;

    if (!experienceText) {
      return res.status(400).json({ success: false, message: "Experience text is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI Skill Profiler for a digital labor marketplace.
      Analyze the worker's experience text and service category.
      Return ONLY a valid raw JSON object (without markdown formatting or \`\`\`json blocks).

      Worker Category: ${category || 'General'}
      Experience Text: "${experienceText}"

      Required Output JSON Format:
      {
        "category": "${category || 'General'}",
        "extractedSkills": [
          {"name": "Skill Name", "proficiency": "Beginner|Intermediate|Expert"}
        ],
        "potentialSkills": ["Skill 1", "Skill 2", "Skill 3"]
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    responseText = responseText.replace(/```json|```/g, "").trim();

    const aiProfileData = JSON.parse(responseText);

    return res.status(200).json({
      success: true,
      message: "AI Skill Profile generated successfully",
      data: aiProfileData
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Aliases for compatibility
export const extractAndSaveSkills = generateAiSkillProfile;
export const getExtractedSkills = async (req, res) => {
  return res.status(200).json({ success: true, skills: [] });
};

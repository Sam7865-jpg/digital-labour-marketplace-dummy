import { GoogleGenerativeAI } from '@google/generative-ai';
import SkillProfile from '../models/SkillProfile.js';

const keywordSkillExtractor = (text) => {
  const lowerText = text.toLowerCase();
  const skillsFound = [];

  const skillDatabase = [
    { name: 'Plumbing', keywords: ['plumb', 'pipe', 'leak', 'drain', 'faucet', 'sink', 'toilet'] },
    { name: 'Electrical Works', keywords: ['electric', 'wiring', 'circuit', 'voltage', 'switch', 'socket'] },
    { name: 'Carpentry', keywords: ['wood', 'carpenter', 'furniture', 'cabinet', 'door', 'timber'] },
    { name: 'Masonry', keywords: ['brick', 'concrete', 'cement', 'mason', 'wall', 'plaster'] },
    { name: 'Painting', keywords: ['paint', 'wall', 'primer', 'coat', 'brush', 'roller'] },
    { name: 'Welding', keywords: ['weld', 'metal', 'steel', 'iron', 'fabrication'] },
    { name: 'HVAC / AC Repair', keywords: ['ac', 'air conditioner', 'hvac', 'cooling', 'refrigerant', 'compressor'] }
  ];

  skillDatabase.forEach((item) => {
    if (item.keywords.some((kw) => lowerText.includes(kw))) {
      skillsFound.push({ skillName: item.name, proficiency: 'Intermediate' });
    }
  });

  return skillsFound.length > 0 ? skillsFound : [{ skillName: 'General Labor', proficiency: 'Beginner' }];
};

export const extractAndSaveSkills = async (req, res) => {
  try {
    const { experienceText } = req.body;
    const userId = req.user._id;

    if (!experienceText) {
      return res.status(400).json({ message: 'Experience text is required' });
    }

    let extractedSkills = [];

    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `Analyze the following worker experience text and extract technical or trade skills with estimated proficiency (Beginner, Intermediate, Expert).
Return ONLY valid raw JSON with this exact structure (no markdown formatting, no code blocks):
{
  "skills": [
    { "skillName": "Skill Name", "proficiency": "Proficiency Level" }
  ]
}

Experience Text:
${experienceText}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanedText);

        if (parsedData.skills && Array.isArray(parsedData.skills)) {
          extractedSkills = parsedData.skills;
        }
      } catch (geminiError) {
        console.error('Gemini extraction failed, using fallback matcher:', geminiError.message);
      }
    }

    if (extractedSkills.length === 0) {
      extractedSkills = keywordSkillExtractor(experienceText);
    }

    let profile = await SkillProfile.findOne({ userId });
    if (profile) {
      profile.experienceText = experienceText;
      profile.extractedSkills = extractedSkills;
      await profile.save();
    } else {
      profile = await SkillProfile.create({
        userId,
        experienceText,
        extractedSkills
      });
    }

    return res.status(200).json({
      message: 'Skills extracted and profile saved successfully',
      skillProfile: profile
    });
  } catch (error) {
    console.error('Skill extraction error:', error);
    res.status(500).json({ message: 'Server error during skill extraction', error: error.message });
  }
};

export const getExtractedSkills = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await SkillProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'No skill profile found' });
    }

    return res.status(200).json({
      experienceText: profile.experienceText,
      extractedSkills: profile.extractedSkills,
      skillProfile: profile
    });
  } catch (error) {
    console.error('Fetch skills error:', error);
    res.status(500).json({ message: 'Server error fetching skills', error: error.message });
  }
};

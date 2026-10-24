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
    let potentialSkills = [];

    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `Analyze the following worker experience text.
1. Extract existing technical or trade skills with estimated proficiency (Beginner, Intermediate, Expert).
2. Recommend 3 to 4 potential related skills or certifications that this worker could add to advance their profile.

Return ONLY valid raw JSON with this exact structure (no markdown formatting, no code blocks):
{
  "skills": [
    { "skillName": "Skill Name", "proficiency": "Proficiency Level" }
  ],
  "potentialSkills": ["Solar Water Heater Setup", "Gas Line Leak Detection", "Blueprint Reading"]
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
        if (parsedData.potentialSkills && Array.isArray(parsedData.potentialSkills)) {
          potentialSkills = parsedData.potentialSkills;
        }
      } catch (geminiError) {
        console.error('Gemini extraction failed, using fallback matcher:', geminiError.message);
      }
    }

    if (extractedSkills.length === 0) {
      extractedSkills = keywordSkillExtractor(experienceText);
      potentialSkills = ['Basic Safety Training', 'Customer Communication', 'Tool Maintenance'];
    }

    let profile = await SkillProfile.findOne({ user: userId });
    if (profile) {
      profile.experienceText = experienceText;
      profile.extractedSkills = extractedSkills;
      profile.potentialSkills = potentialSkills;
      await profile.save();
    } else {
      profile = await SkillProfile.create({
        user: userId,
        experienceText,
        extractedSkills,
        potentialSkills
      });
    }

    return res.status(200).json({
      message: 'Skills and potential recommendations saved successfully',
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
    const profile = await SkillProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: 'No skill profile found' });
    }

    return res.status(200).json({
      experienceText: profile.experienceText,
      extractedSkills: profile.extractedSkills,
      potentialSkills: profile.potentialSkills || [],
      skillProfile: profile
    });
  } catch (error) {
    console.error('Fetch skills error:', error);
    res.status(500).json({ message: 'Server error fetching skills', error: error.message });
  }
};

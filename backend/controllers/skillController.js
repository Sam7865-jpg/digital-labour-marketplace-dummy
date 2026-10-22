import SkillProfile from '../models/SkillProfile.js';

// POST: /api/worker/extract-skills
export const extractAndSaveSkills = async (req, res) => {
  try {
    const { experienceText } = req.body;
    
    let skillProfile = await SkillProfile.findOne({ user: req.user._id });

    // AI / Keyword matching simulation with plumber and other keywords
    const lowercaseText = experienceText.toLowerCase();
    let detectedSkills = [];

    const commonSkills = [
      { keyword: 'plumber', name: 'Plumbing Services' },
      { keyword: 'plumbing', name: 'Plumbing' },
      { keyword: 'piping', name: 'Pipe Fitting' },
      { keyword: 'leakage', name: 'Leakage Repair' },
      { keyword: 'sanitary', name: 'Sanitary Fittings' },
      { keyword: 'maintenance', name: 'General Maintenance' },
      { keyword: 'wiring', name: 'Electrical Wiring' },
      { keyword: 'circuit', name: 'Circuit Breaker Fixing' },
      { keyword: 'ac repair', name: 'AC Repair & Installation' },
      { keyword: 'carpentry', name: 'Carpentry' },
      { keyword: 'painting', name: 'Painting' },
      { keyword: 'solar', name: 'Solar Panel Installation' },
      { keyword: 'welding', name: 'Welding' },
      { keyword: 'cleaning', name: 'Cleaning' }
    ];

    commonSkills.forEach(item => {
      if (lowercaseText.includes(item.keyword)) {
        const exists = detectedSkills.some(s => s.skillName === item.name);
        if (!exists) {
          detectedSkills.push({ skillName: item.name, proficiency: 'Expert' });
        }
      }
    });

    // Agar koi specific keyword match na ho, toh pura text copy karne ki bajaye aik behtar default tag dein
    if (detectedSkills.length === 0 && experienceText.trim() !== '') {
      detectedSkills.push({ skillName: 'General Skilled Worker', proficiency: 'Intermediate' });
    }

    if (skillProfile) {
      skillProfile.experienceText = experienceText;
      skillProfile.extractedSkills = detectedSkills;
      await skillProfile.save();
    } else {
      skillProfile = await SkillProfile.create({
        user: req.user._id,
        experienceText,
        extractedSkills: detectedSkills
      });
    }

    // UPDATE: Poori profile return kar rahe hain taake frontend par structured profile show ho sakay
    res.json({
      message: 'AI ne kamyabi se structured profile taiyar aur save kar di hai!',
      skillProfile
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET: /api/worker/skills
export const getExtractedSkills = async (req, res) => {
  try {
    const skillProfile = await SkillProfile.findOne({ user: req.user._id });
    res.json(skillProfile || { experienceText: '', extractedSkills: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import { GoogleGenerativeAI } from "@google/generative-ai";
import SkillProfile from "../models/SkillProfile.js";

const BILINGUAL_DICTIONARY = {
  plumbing: {
    category: 'Plumbing & Sanitary Work',
    keywords: ['nal', 'pipe', 'leak', 'geyser', 'tanki', 'fitting', 'sanitary', 'boring', 'motor', 'pprc', 'pvc', 'commode', 'basin', 'water'],
    defaultSkills: [
      { name: "PPRC & PVC Pipe Fitting", proficiency: "Expert" },
      { name: "Leakage Repair & Pipeline Laying", proficiency: "Expert" },
      { name: "Geyser & Pump Installation", proficiency: "Intermediate" },
      { name: "Sanitary Fixtures Assembly", proficiency: "Intermediate" }
    ],
    potentialSkills: ["Solar Water Heater Installation", "Automatic Pressure Pump Calibration", "Hydraulic Pressure Testing"]
  },
  electrical: {
    category: 'Electrical & Wiring',
    keywords: ['bijli', 'wiring', 'short', 'circuit', 'breaker', 'fan', 'light', 'ups', 'generator', 'board', 'pankha', 'dp', 'phase'],
    defaultSkills: [
      { name: "House Wiring & Distribution Boards", proficiency: "Expert" },
      { name: "Circuit Breaker & Short Fault Fixing", proficiency: "Expert" },
      { name: "UPS & Inverter Installation", proficiency: "Intermediate" },
      { name: "Appliance Repair (Fans/Lights)", proficiency: "Intermediate" }
    ],
    potentialSkills: ["Solar Panel Inverter Setup", "3-Phase Industrial Panel Wiring", "Smart Home Automation"]
  },
  carpentry: {
    category: 'Carpentry & Woodwork',
    keywords: ['lakri', 'wood', 'darwaza', 'door', 'almari', 'cabinet', 'furniture', 'polish', 'kitchen', 'hinge', 'lock'],
    defaultSkills: [
      { name: "Custom Cabinet & Wardrobe Assembly", proficiency: "Expert" },
      { name: "Door & Window Fitting", proficiency: "Expert" },
      { name: "Wood Polishing & Refinishing", proficiency: "Intermediate" }
    ],
    potentialSkills: ["Modular Kitchen Design", "CNC Router Wood Carving", "Laminate Veneer Pressing"]
  },
  masonry: {
    category: 'Masonry & Civil Construction',
    keywords: ['chinai', 'bhatta', 'eent', 'cement', 'plaster', 'tile', 'lanter', 'marble', 'grout', 'foundation'],
    defaultSkills: [
      { name: "Bricklaying & Wall Masonry", proficiency: "Expert" },
      { name: "Plastering & Surface Leveling", proficiency: "Expert" },
      { name: "Tile & Marble Laying", proficiency: "Intermediate" }
    ],
    potentialSkills: ["Waterproof Foundation Coating", "3D Epoxy Flooring", "Structural Concrete Beam Formwork"]
  },
  hvac: {
    category: 'HVAC & Refrigeration',
    keywords: ['ac', 'fridge', 'gas', 'compressor', 'cooling', 'chiller', 'split', 'inverter ac', 'refrigerant', 'piping'],
    defaultSkills: [
      { name: "AC Gas Charging & Vacuuming", proficiency: "Expert" },
      { name: "Split AC Mounting & Piping", proficiency: "Expert" },
      { name: "Compressor Diagnostics & Maintenance", proficiency: "Intermediate" }
    ],
    potentialSkills: ["VRF/VRV Central AC Installation", "Automobile Air Conditioning", "Commercial Cold Storage Maintenance"]
  },
  painting: {
    category: 'Painting & Finishing',
    keywords: ['paint', 'rang', 'distemper', 'putty', 'weather sheet', 'primer', 'wall', 'texture'],
    defaultSkills: [
      { name: "Wall Putty & Surface Preparation", proficiency: "Expert" },
      { name: "Interior & Exterior Painting", proficiency: "Expert" },
      { name: "Texture & Stencil Design", proficiency: "Intermediate" }
    ],
    potentialSkills: ["Airless Spray Painting", "Anti-Fungal Treatment Application", "Epoxy Wall Coating"]
  }
};

const groupSkillsByCategory = (skillsList, mainCategory) => {
  const groupedMap = {};
  skillsList.forEach(item => {
    const catName = item.category || mainCategory || 'General Trade';
    if (!groupedMap[catName]) {
      groupedMap[catName] = [];
    }
    groupedMap[catName].push({
      name: item.name,
      proficiency: item.proficiency || 'Intermediate'
    });
  });

  return Object.keys(groupedMap).map(cat => ({
    categoryName: cat,
    skills: groupedMap[cat]
  }));
};

export const generateAiSkillProfile = async (req, res) => {
  try {
    const { experienceText = '', category = '', experienceYears = '1', toolsOperated = '' } = req.body;
    const combinedText = `${category} ${toolsOperated} ${experienceText}`.toLowerCase();

    let outputData = null;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          You are an AI Skill Profiler for a digital labor marketplace in Pakistan.
          Analyze input:
          Category: "${category}"
          Years: "${experienceYears}"
          Tools: "${toolsOperated}"
          Bio: "${experienceText}"

          Return ONLY a raw JSON object:
          {
            "category": "Service Category",
            "professionalSummary": "Concise 2-line summary",
            "extractedSkills": [
              { "name": "Skill Name", "proficiency": "Beginner|Intermediate|Expert", "category": "Service Category Name" }
            ],
            "potentialSkills": ["Skill 1", "Skill 2"]
          }
        `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim().replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(responseText);

        outputData = {
          category: parsed.category || category || 'General Trade',
          professionalSummary: parsed.professionalSummary,
          categorizedSkills: groupSkillsByCategory(parsed.extractedSkills || [], parsed.category || category),
          potentialSkills: parsed.potentialSkills || []
        };
      } catch (geminiError) {
        console.warn("Gemini API skipped/failed, using Smart Fallback:", geminiError.message);
      }
    }

    if (!outputData) {
      let matchedTrade = 'plumbing';
      let maxMatchCount = 0;

      Object.keys(BILINGUAL_DICTIONARY).forEach(tradeKey => {
        const keywords = BILINGUAL_DICTIONARY[tradeKey].keywords;
        const matchCount = keywords.reduce((acc, word) => combinedText.includes(word) ? acc + 1 : acc, 0);
        if (matchCount > maxMatchCount) {
          maxMatchCount = matchCount;
          matchedTrade = tradeKey;
        }
      });

      const tradeData = BILINGUAL_DICTIONARY[matchedTrade];
      const years = parseInt(experienceYears) || 1;
      const baseProficiency = years >= 5 ? 'Expert' : years >= 2 ? 'Intermediate' : 'Beginner';

      const rawSkills = tradeData.defaultSkills.map(s => ({
        name: s.name,
        proficiency: baseProficiency,
        category: tradeData.category
      }));

      outputData = {
        category: tradeData.category,
        professionalSummary: `Skilled professional with ${years} year(s) of experience in ${tradeData.category}. Proficient in operating ${toolsOperated || 'standard trade tools'} with hands-on field expertise.`,
        categorizedSkills: groupSkillsByCategory(rawSkills, tradeData.category),
        potentialSkills: tradeData.potentialSkills
      };
    }

    return res.status(200).json({
      success: true,
      message: "AI Skill Profile generated successfully",
      data: outputData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate skill profile"
    });
  }
};

// Endpoint to save & persist modified skill profile in MongoDB
export const saveSkillProfile = async (req, res) => {
  try {
    const { primaryTrade, experienceYears, toolsOperated, professionalSummary, categorizedSkills, potentialSkills } = req.body;

    let profile = await SkillProfile.findOne({ primaryTrade });
    if (!profile) {
      profile = new SkillProfile({
        primaryTrade,
        experienceYears,
        toolsOperated: Array.isArray(toolsOperated) ? toolsOperated : (toolsOperated ? toolsOperated.split(',') : []),
        professionalSummary,
        categorizedSkills,
        potentialSkills
      });
    } else {
      profile.experienceYears = experienceYears || profile.experienceYears;
      profile.professionalSummary = professionalSummary || profile.professionalSummary;
      profile.categorizedSkills = categorizedSkills || profile.categorizedSkills;
      profile.potentialSkills = potentialSkills || profile.potentialSkills;
      profile.updatedAt = Date.now();
    }

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Skill profile persisted to MongoDB successfully",
      data: profile
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const extractAndSaveSkills = generateAiSkillProfile;
export const getExtractedSkills = async (req, res) => {
  return res.status(200).json({ success: true, skills: [] });
};

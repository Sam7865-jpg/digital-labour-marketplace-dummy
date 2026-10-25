const WorkerProfile = require('../models/WorkerProfile');
const { analyzeWorkerSkillProfile } = require('../utils/aiSkillProfiler');

// GET /api/worker/profile
const getWorkerProfile = async (req, res) => {
  try {
    let profile = await WorkerProfile.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!profile) {
      return res.status(200).json(null);
    }
    return res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching worker profile:", err);
    return res.status(500).json({ message: "Server error fetching profile" });
  }
};

// POST /api/worker/profile
const createOrUpdateProfile = async (req, res) => {
  try {
    const { occupation, category, experienceYears, hourlyRate, city, bio } = req.body;
    let profile = await WorkerProfile.findOne({ user: req.user.id });

    if (profile) {
      profile.occupation = occupation || profile.occupation;
      profile.category = category || profile.category;
      profile.experienceYears = experienceYears ?? profile.experienceYears;
      profile.hourlyRate = hourlyRate ?? profile.hourlyRate;
      profile.city = city || profile.city;
      profile.bio = bio || profile.bio;
      if (!profile.skills) profile.skills = [];
      await profile.save();
    } else {
      profile = await WorkerProfile.create({
        user: req.user.id,
        occupation,
        category,
        experienceYears,
        hourlyRate,
        city,
        bio,
        skills: []
      });
    }

    profile = await WorkerProfile.findById(profile._id).populate('user', 'name email');
    return res.status(200).json(profile);
  } catch (err) {
    console.error("Error saving worker profile:", err);
    return res.status(500).json({ message: "Server error saving profile" });
  }
};

// POST /api/worker/ai-profile
const processAiSkillProfiling = async (req, res) => {
  try {
    const { experienceDetail, experienceText } = req.body;
    const textToAnalyze = experienceText || experienceDetail || "";

    let profile = await WorkerProfile.findOne({ user: req.user.id });
    const expYears = profile ? profile.experienceYears : 2;

    const aiResult = analyzeWorkerSkillProfile(textToAnalyze, expYears);

    if (profile) {
      profile.skills = aiResult.extractedSkills || [];
      profile.experienceTierBadge = aiResult.tierBadge;
      profile.skillStrengthScore = aiResult.skillStrengthScore;
      profile.aiSkillSummary = aiResult.aiSummary;
      await profile.save();
    }

    return res.status(200).json({
      success: true,
      data: aiResult,
      updatedProfile: profile
    });
  } catch (err) {
    console.error("Error in AI profiling:", err);
    return res.status(500).json({ message: "Server error processing AI profile" });
  }
};

// POST /api/worker/add-skill (SAFE ARRAY CHECK)
const addRecommendedSkill = async (req, res) => {
  try {
    const { skillName, category } = req.body;
    let profile = await WorkerProfile.findOne({ user: req.user.id });

    if (!profile) {
      profile = await WorkerProfile.create({
        user: req.user.id,
        occupation: "Worker",
        skills: []
      });
    }

    if (!Array.isArray(profile.skills)) {
      profile.skills = [];
    }

    const exists = profile.skills.some(s => 
      s && (typeof s === 'string' ? s.toLowerCase() === skillName.toLowerCase() : s.skillName?.toLowerCase() === skillName.toLowerCase())
    );

    if (!exists) {
      profile.skills.push({
        skillName: skillName,
        category: category || profile.category || "General",
        proficiencyLevel: "Intermediate"
      });
      await profile.save();
    }

    return res.status(200).json({
      message: "Skill added successfully!",
      profile
    });
  } catch (err) {
    console.error("Error adding skill:", err);
    return res.status(500).json({ message: "Server error adding skill" });
  }
};

module.exports = {
  getWorkerProfile,
  createOrUpdateProfile,
  processAiSkillProfiling,
  addRecommendedSkill
};

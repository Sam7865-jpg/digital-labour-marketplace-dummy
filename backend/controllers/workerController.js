import WorkerProfile from '../models/WorkerProfile.js';
import { analyzeWorkerSkillProfile } from '../utils/aiSkillProfiler.js';

// Get Profile
export const getWorkerProfile = async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Profile
export const updateWorkerProfile = async (req, res) => {
  try {
    const { occupation, category, experienceYears, hourlyRate, city, bio } = req.body;
    let profile = await WorkerProfile.findOne({ user: req.user._id });

    if (profile) {
      profile.occupation = occupation || profile.occupation;
      profile.category = category || profile.category;
      profile.experienceYears = experienceYears ?? profile.experienceYears;
      profile.hourlyRate = hourlyRate ?? profile.hourlyRate;
      profile.city = city || profile.city;
      profile.bio = bio || profile.bio;
      await profile.save();
    } else {
      profile = await WorkerProfile.create({
        user: req.user._id,
        occupation,
        category,
        experienceYears,
        hourlyRate,
        city,
        bio,
      });
    }
    res.json({ message: 'Profile saved successfully', profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Process AI Skill Profiling (Bulletproof Fallback)
export const processAiSkillProfiling = async (req, res) => {
  try {
    const { occupation, category, experienceYears, experienceDetail, experienceText, toolsUsed } = req.body;
    
    // Dono keys check karein taake kabhi validation fail na ho
    const textDetail = experienceDetail || experienceText || '';

    if (!textDetail || textDetail.trim().length < 10) {
      return res.status(400).json({ 
        message: 'Please provide at least 10 characters of experience detail.' 
      });
    }

    let profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new WorkerProfile({ user: req.user._id });
    }

    profile.occupation = occupation || profile.occupation;
    profile.category = category || profile.category;
    profile.experienceYears = Number(experienceYears) || profile.experienceYears;

    // AI Profiler Utility Execution
    const aiResult = analyzeWorkerSkillProfile({
      occupation: profile.occupation,
      category: profile.category,
      experienceYears: profile.experienceYears,
      experienceText: textDetail,
      toolsUsed: toolsUsed || [],
    });

    profile.skills = aiResult.extractedSkills;
    profile.skillStrengthScore = aiResult.skillStrengthScore;
    profile.experienceTierBadge = aiResult.tierBadge;
    profile.aiSkillSummary = aiResult.aiSummary;

    await profile.save();

    res.json({
      workerProfile: profile,
      recommendedSkills: aiResult.recommendedSkills,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Recommended Skill
export const addRecommendedSkill = async (req, res) => {
  try {
    const { skillName, category, proficiencyLevel } = req.body;
    const profile = await WorkerProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const exists = profile.skills.some(
      (s) => s.skillName.toLowerCase() === skillName.toLowerCase()
    );

    if (!exists) {
      profile.skills.push({
        skillName,
        category: category || profile.category,
        proficiencyLevel: proficiencyLevel || 'Intermediate',
        confidenceScore: 85,
        source: 'recommended',
      });
      await profile.save();
    }

    res.json({ message: 'Skill added successfully', skills: profile.skills });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
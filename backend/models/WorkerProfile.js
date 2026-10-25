import mongoose from 'mongoose';

const skillItemSchema = new mongoose.Schema({
  skillId: { type: String, required: true },
  skillName: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'Electrical & Solar',
      'Plumbing & Sanitary',
      'Carpentry & Woodwork',
      'Construction & Masonry',
      'AC & Appliance Repair',
      'Painting & Renovation',
      'Home Maintenance',
      'Cleaning & Shifting'
    ],
    required: true
  },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Intermediate' },
  confidenceScore: { type: Number, min: 0, max: 100, default: 80 },
  source: { type: String, enum: ['AI-Extracted', 'Manual', 'Recommended-Added'], default: 'AI-Extracted' },
  verificationStatus: { type: String, enum: ['Unverified', 'Pending', 'Verified'], default: 'Unverified' }
}, { _id: true });

const recommendedSkillSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  category: { type: String, required: true },
  reason: { type: String, default: 'Commonly required for this trade' },
  demandLevel: { type: String, enum: ['High Demand', 'Growing', 'Core Trade Skill'], default: 'High Demand' }
}, { _id: false });

const workerProfileSchema = new mongoose.Schema(
  {
    // --- MODULE 1 FIELDS (PRESERVED EXACTLY AS IS) ---
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    experienceYears: {
      type: Number,
      required: true,
      default: 0,
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    city: {
      type: String,
      required: true,
      default: 'Islamabad',
    },
    address: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },

    // --- MODULE 2 FIELDS ---
    rawExperienceText: { type: String, maxlength: 2000, default: '' },
    experienceTierBadge: { 
      type: String, 
      enum: ['Junior Worker', 'Skilled Technician', 'Senior Specialist', 'Master Craftsman'], 
      default: 'Junior Worker' 
    },
    aiSkillSummary: { type: String, default: '' },
    categorizedSkills: [skillItemSchema],
    recommendedSkills: [recommendedSkillSchema],
    toolsAndEquipment: [{ type: String, trim: true }],
    skillStrengthScore: { type: Number, min: 0, max: 100, default: 25 },
    lastAiProfiledAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('WorkerProfile', workerProfileSchema);
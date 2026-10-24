import mongoose from 'mongoose';

const SkillItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Expert'], 
    default: 'Intermediate' 
  },
  isVerified: { type: Boolean, default: false }
});

const CategoryGroupSchema = new mongoose.Schema({
  categoryName: { type: String, required: true }, // e.g. "Plumbing & Sanitary Work"
  skills: [SkillItemSchema]
});

const SkillProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  primaryTrade: { type: String, default: 'General' },
  experienceYears: { type: Number, default: 0 },
  toolsOperated: [{ type: String }],
  professionalSummary: { type: String, default: '' },
  
  // Categorized Skills Group Structure
  categorizedSkills: [CategoryGroupSchema],
  
  potentialSkills: [{ type: String }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('SkillProfile', SkillProfileSchema);

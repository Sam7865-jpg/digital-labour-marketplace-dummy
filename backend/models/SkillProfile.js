import mongoose from 'mongoose';

const skillProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  experienceText: { type: String, default: '' },
  extractedSkills: [
    {
      skillName: { type: String },
      proficiency: { type: String, default: 'Intermediate' } // Beginner, Expert, etc.
    }
  ]
}, { timestamps: true });

export default mongoose.model('SkillProfile', skillProfileSchema);

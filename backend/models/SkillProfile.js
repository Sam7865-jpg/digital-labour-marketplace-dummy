import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  proficiency: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Expert'], 
    default: 'Intermediate' 
  }
});

const skillProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  experienceText: { 
    type: String, 
    required: true 
  },
  extractedSkills: [skillSchema],
  potentialSkills: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('SkillProfile', skillProfileSchema);

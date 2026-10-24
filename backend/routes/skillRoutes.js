import express from 'express';
import { 
  generateAiSkillProfile, 
  saveSkillProfile,
  extractAndSaveSkills, 
  getExtractedSkills 
} from '../controllers/skillController.js';

const router = express.Router();

router.post('/generate-ai-profile', generateAiSkillProfile);
router.post('/save', saveSkillProfile);
router.post('/extract', extractAndSaveSkills);
router.get('/', getExtractedSkills);

export default router;

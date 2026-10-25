import express from 'express';
import { 
  getWorkerProfile, 
  updateWorkerProfile, 
  processAiSkillProfiling, 
  addRecommendedSkill 
} from '../controllers/workerController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- MODULE 1 ROUTES ---
router.get('/profile', protect, authorizeRoles('worker'), getWorkerProfile);
router.post('/profile', protect, authorizeRoles('worker'), updateWorkerProfile);

// --- MODULE 2 ROUTES ---
router.post('/ai-skill-profiler', protect, authorizeRoles('worker'), processAiSkillProfiling);
router.post('/add-recommended-skill', protect, authorizeRoles('worker'), addRecommendedSkill);

export default router;
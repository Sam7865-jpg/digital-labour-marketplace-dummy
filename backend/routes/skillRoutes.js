import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { extractAndSaveSkills, getExtractedSkills } from '../controllers/skillController.js';

const router = express.Router();

router.get('/skills', protect, authorizeRoles('worker'), getExtractedSkills);
router.post('/extract-skills', protect, authorizeRoles('worker'), extractAndSaveSkills);

export default router;

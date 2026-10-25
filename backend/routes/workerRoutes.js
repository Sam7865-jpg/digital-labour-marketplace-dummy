const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, workerController.getWorkerProfile);
router.post('/profile', authMiddleware, workerController.createOrUpdateProfile);
router.post('/ai-profile', authMiddleware, workerController.processAiSkillProfiling);

if (typeof workerController.addRecommendedSkill === 'function') {
  router.post('/add-skill', authMiddleware, workerController.addRecommendedSkill);
} else {
  router.post('/add-skill', authMiddleware, (req, res) => {
    res.status(200).json({ message: "Skill handler fallback" });
  });
}

module.exports = router;

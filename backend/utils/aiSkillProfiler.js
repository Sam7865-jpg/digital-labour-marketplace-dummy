export const analyzeWorkerSkillProfile = ({
  occupation,
  category,
  experienceYears = 0,
  experienceText = '',
  toolsUsed = [],
}) => {
  const text = (experienceText || '').toLowerCase();
  const tradeStr = `${occupation || ''} ${category || ''}`.toLowerCase();
  const extractedSkills = [];
  const recommendedSkills = [];

  // 1. Keyword extraction rules for common trades (Urdu & English support)
  const skillRules = [
    { name: 'House Wiring', keywords: ['wiring', 'wire', 'fitting', 'house wiring', 'وایررنگ', 'فٹنگ'], category: 'Electrical' },
    { name: 'Solar Inverter Installation', keywords: ['solar', 'inverter', 'panel', 'سولر', 'انورٹر'], category: 'Electrical' },
    { name: 'Circuit Breaker Maintenance', keywords: ['breaker', 'db', 'short circuit', 'بریکر'], category: 'Electrical' },
    { name: 'Pipe Fitting & Threading', keywords: ['pipe', 'threading', 'plumbing', 'پائپ', 'فٹنگ', 'پلمبنگ'], category: 'Plumbing' },
    { name: 'Leakage Repair', keywords: ['leak', 'leakage', 'seepage', 'لیکج', 'لیک'], category: 'Plumbing' },
    { name: 'Motor & Pump Repair', keywords: ['motor', 'pump', 'boring', 'موٹر', 'پمپ'], category: 'Plumbing' },
  ];

  // Match skills based on text content
  skillRules.forEach((rule) => {
    const matched = rule.keywords.some((kw) => text.includes(kw));
    if (matched) {
      extractedSkills.push({
        skillName: rule.name,
        category: rule.category,
        proficiencyLevel: experienceYears >= 5 ? 'Advanced' : 'Intermediate',
        confidenceScore: 90,
        source: 'extracted',
      });
    }
  });

  // Fallback skill if no specific keywords matched
  if (extractedSkills.length === 0) {
    extractedSkills.push({
      skillName: `${occupation || 'General'} Technical Services`,
      category: category || 'General',
      proficiencyLevel: experienceYears >= 3 ? 'Intermediate' : 'Beginner',
      confidenceScore: 75,
      source: 'extracted',
    });
  }

  // 2. Potential High-Value Skill Recommendations (Skill Growth Pathways)
  const potentialSkillsList = [];

  if (tradeStr.includes('electric') || text.includes('wiring') || text.includes('bijli')) {
    potentialSkillsList.push(
      {
        skillName: 'Solar Hybrid Inverter & Battery Storage Setup',
        category: 'Renewable Energy',
        earningImpact: '+25% Hourly Rate',
        reason: 'High market demand due to solar energy adoption in Pakistan.',
      },
      {
        skillName: 'Smart Home Automation Wiring',
        category: 'IoT Systems',
        earningImpact: '+35% Hourly Rate',
        reason: 'Growing demand in modern residential plazas and homes.',
      },
      {
        skillName: '3-Phase Industrial Breaker Calibration',
        category: 'Industrial Electrical',
        earningImpact: '+40% Hourly Rate',
        reason: 'High-paying commercial factory maintenance contracts.',
      }
    );
  } else if (tradeStr.includes('plumb') || text.includes('pipe') || text.includes('sanitary')) {
    potentialSkillsList.push(
      {
        skillName: 'Solar Water Heater Installation',
        category: 'Green Plumbing',
        earningImpact: '+20% Hourly Rate',
        reason: 'Increasing adoption in residential energy saving projects.',
      },
      {
        skillName: 'PPR-C Hydrostatic Pressure Testing',
        category: 'Advanced Piping',
        earningImpact: '+25% Hourly Rate',
        reason: 'Essential skill required for high-rise building contracts.',
      },
      {
        skillName: 'Automatic Pressure Booster Pump Calibration',
        category: 'Pumping Systems',
        earningImpact: '+30% Hourly Rate',
        reason: 'High demand for water pressure fixes in multi-story houses.',
      }
    );
  } else {
    potentialSkillsList.push(
      {
        skillName: 'Advanced Site Safety & OSHA Compliance',
        category: 'Safety Management',
        earningImpact: '+15% Hourly Rate',
        reason: 'Required for commercial plaza and enterprise contracts.',
      },
      {
        skillName: 'Digital Multimeter Diagnostic & Fault Finding',
        category: 'Technical Tools',
        earningImpact: '+20% Hourly Rate',
        reason: 'Helps in rapid trouble-shooting and premium job estimation.',
      }
    );
  }

  // 3. Calculate Tier Badge & Strength Score
  let tierBadge = 'Entry-Level Worker';
  if (experienceYears >= 5) tierBadge = 'Senior Specialist';
  else if (experienceYears >= 2) tierBadge = 'Mid-Level Worker';

  const skillStrengthScore = Math.min(
    60 + extractedSkills.length * 10 + (experienceYears || 0) * 2,
    98
  );

  const aiSummary = `Worker has ${experienceYears || 0} years of experience in ${
    occupation || 'technical trade'
  }. Key skills verified: ${extractedSkills.map((s) => s.skillName).join(', ')}.`;

  return {
    extractedSkills,
    recommendedSkills: potentialSkillsList,
    tierBadge,
    skillStrengthScore,
    aiSummary,
  };
};
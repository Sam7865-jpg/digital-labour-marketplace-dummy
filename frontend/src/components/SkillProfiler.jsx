import React, { useState } from 'react';

const SkillProfiler = ({ initialCategory = '' }) => {
  const [experienceText, setExperienceText] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!experienceText.trim()) {
      setError('Aapna work experience/bio yahan likhein.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/skills/generate-ai-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experienceText, category })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setAiResult(data.data);
      } else {
        setError(data.message || 'AI Profiling me error aaya.');
      }
    } catch (err) {
      setLoading(false);
      setError('Server se connectivity issue hai.');
    }
  };

  const handleAddPotentialSkill = (skillName) => {
    if (!aiResult) return;
    setAiResult(prev => ({
      ...prev,
      extractedSkills: [...prev.extractedSkills, { name: skillName, proficiency: 'Intermediate' }],
      potentialSkills: prev.potentialSkills.filter(s => s !== skillName)
    }));
  };

  return (
    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '10px', border: '2px solid #8b5cf6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#5b21b6' }}>✨ Module 2: AI Experience & Skill Profiler</h3>
        <span style={{ background: '#ddd6fe', color: '#5b21b6', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
          Gemini AI Engine
        </span>
      </div>

      <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>
        Raw experience text dakhil karein. Gemini AI automatically skills identify karega, category mapping karega, aur potential growth skills suggest karega.
      </p>

      <form onSubmit={handleAnalyze}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Service Domain / Category</label>
          <input 
            type="text" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Electrician, Plumber, Carpenter"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Work Experience Bio</label>
          <textarea 
            rows="4"
            value={experienceText}
            onChange={(e) => setExperienceText(e.target.value)}
            placeholder="Describe your practical work experience, tools used, and key expertise in detail..."
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          style={{ background: '#7c3aed', color: '#ffffff', padding: '10px 18px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? '✨ Gemini AI Analyzing...' : '✨ Generate AI Skill Profile'}
        </button>
      </form>

      {aiResult && (
        <div style={{ marginTop: '20px', padding: '16px', background: '#ffffff', borderRadius: '8px', border: '1px solid #c084fc' }}>
          <h4 style={{ color: '#6d28d9', marginTop: 0 }}>Structured Worker Skill Profile Output</h4>
          
          <p><strong>Mapped Service Category:</strong> <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{aiResult.category}</span></p>

          <div style={{ marginTop: '12px' }}>
            <strong>Extracted Skills & Proficiency Levels:</strong>
            <ul style={{ marginTop: '6px', paddingLeft: '20px' }}>
              {aiResult.extractedSkills.map((s, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>
                  <strong>{s.name}</strong> — <span style={{ color: '#059669', fontWeight: 'bold' }}>{s.proficiency}</span>
                </li>
              ))}
            </ul>
          </div>

          {aiResult.potentialSkills && aiResult.potentialSkills.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <strong>AI Recommended Potential Skills (Click to Add):</strong>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {aiResult.potentialSkills.map((skill, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => handleAddPotentialSkill(skill)}
                    style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b', padding: '5px 12px', borderRadius: '16px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillProfiler;

import React, { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://digital-labour-marketplace-dummy-ba.vercel.app';

const SkillProfiler = ({ initialCategory = '', onSyncProfile }) => {
  const [trade, setTrade] = useState(initialCategory || 'Plumber');
  const [experienceYears, setExperienceYears] = useState('5');
  const [toolsOperated, setToolsOperated] = useState('');
  const [experienceText, setExperienceText] = useState('');
  
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState('');

  // Voice Input Speech-to-Text
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Browser speech recognition not supported. Please use Google Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ur-PK';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setExperienceText(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.start();
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!experienceText.trim() && !toolsOperated.trim()) {
      setError('Experience text ya tools ka zikr zaroori hai.');
      return;
    }
    setError('');
    setLoading(true);
    setSynced(false);

    try {
      const payload = {
        category: trade,
        experienceYears,
        toolsOperated,
        experienceText
      };

      const res = await fetch(`${API_BASE_URL}/api/skills/generate-ai-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setAiResult(data.data);
      } else {
        setError(data.message || 'AI Profiling error.');
      }
    } catch (err) {
      setLoading(false);
      setError('Server connection error. API URL check karein.');
    }
  };

  // Step 5: Add Potential Skill to Active Profile & Persist in MongoDB
  const handleAddPotentialSkill = async (skillName) => {
    if (!aiResult) return;

    const targetCategory = aiResult.category || trade || 'General Trade';
    
    // Copy categorized skills and add new skill under current category
    const updatedCategorized = [...(aiResult.categorizedSkills || [])];
    let groupIndex = updatedCategorized.findIndex(g => g.categoryName === targetCategory);

    if (groupIndex === -1) {
      updatedCategorized.push({
        categoryName: targetCategory,
        skills: [{ name: skillName, proficiency: 'Intermediate' }]
      });
    } else {
      updatedCategorized[groupIndex].skills.push({ name: skillName, proficiency: 'Intermediate' });
    }

    // Remove from potential skills list
    const updatedPotential = (aiResult.potentialSkills || []).filter(s => s !== skillName);

    const updatedAiResult = {
      ...aiResult,
      categorizedSkills: updatedCategorized,
      potentialSkills: updatedPotential
    };

    setAiResult(updatedAiResult);

    // Save update to MongoDB
    try {
      await fetch(`${API_BASE_URL}/api/skills/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryTrade: trade,
          experienceYears,
          toolsOperated,
          professionalSummary: aiResult.professionalSummary,
          categorizedSkills: updatedCategorized,
          potentialSkills: updatedPotential
        })
      });
    } catch (err) {
      console.warn("DB persistence warning:", err.message);
    }

    // Trigger Live Sync if parent listener attached
    if (onSyncProfile) {
      onSyncProfile(updatedAiResult);
    }
  };

  const handleApplyToProfileCard = () => {
    if (aiResult && onSyncProfile) {
      onSyncProfile(aiResult);
      setSynced(true);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#ffffff', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: '#4c1d95', fontSize: '20px' }}>✨ AI Experience & Skill Profiler</h3>
        <span style={{ background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
          Gemini AI Engine
        </span>
      </div>

      <form onSubmit={handleAnalyze}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px', color: '#334155' }}>
              Primary Trade / Skill Category
            </label>
            <input 
              type="text" 
              value={trade} 
              onChange={(e) => setTrade(e.target.value)}
              placeholder="e.g. Plumber, Electrician"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px', color: '#334155' }}>
              Experience (Years)
            </label>
            <input 
              type="number" 
              value={experienceYears} 
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="e.g. 5"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px', color: '#334155' }}>
            Tools & Machinery Operated
          </label>
          <input 
            type="text" 
            value={toolsOperated} 
            onChange={(e) => setToolsOperated(e.target.value)}
            placeholder="e.g. PPRC Machine, Pipe Threader, Drill Machine"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#334155' }}>
              Detailed Experience Bio (Urdu / Roman Urdu / English)
            </label>
            <button
              type="button"
              onClick={handleVoiceInput}
              style={{
                background: isListening ? '#ef4444' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <span>🎤</span> {isListening ? 'Listening...' : 'Voice Input'}
            </button>
          </div>

          <textarea 
            rows="4"
            value={experienceText}
            onChange={(e) => setExperienceText(e.target.value)}
            placeholder="Describe your practical work experience or speak using the mic..."
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: '13px', fontWeight: 'bold' }}>{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          style={{ background: '#7c3aed', color: '#ffffff', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '15px' }}
        >
          {loading ? '✨ Gemini AI Analyzing Profile...' : '✨ Generate AI Skill Profile'}
        </button>
      </form>

      {/* Structured Skill Profile Output */}
      {aiResult && (
        <div style={{ marginTop: '24px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #c084fc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ color: '#5b21b6', margin: 0, fontSize: '16px' }}>Structured Worker Skill Profile</h4>
            
            <button
              onClick={handleApplyToProfileCard}
              style={{
                background: synced ? '#059669' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {synced ? '✓ Synced to Digital ID' : '⚡ Sync to Digital Identity Card'}
            </button>
          </div>

          {/* AI Generated Professional Summary */}
          {aiResult.professionalSummary && (
            <div style={{ background: '#f3e8ff', borderLeft: '4px solid #7c3aed', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#6d28d9', display: 'block', textTransform: 'uppercase' }}>
                AI Professional Summary
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4c1d95', lineHeight: '1.4' }}>
                {aiResult.professionalSummary}
              </p>
            </div>
          )}

          {/* Categorized Skills */}
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ fontSize: '13px', color: '#334155' }}>Categorized Trade Skills & Proficiency:</strong>
            {aiResult.categorizedSkills?.map((catGroup, cIdx) => (
              <div key={cIdx} style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>● {catGroup.categoryName}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {catGroup.skills.map((s, sIdx) => (
                    <span key={sIdx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong>{s.name}</strong>
                      <span style={{ 
                        background: s.proficiency === 'Expert' ? '#dcfce7' : s.proficiency === 'Intermediate' ? '#e0e7ff' : '#fef3c7',
                        color: s.proficiency === 'Expert' ? '#166534' : s.proficiency === 'Intermediate' ? '#3730a3' : '#92400e',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        {s.proficiency}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Step 5: Potential Growth Skills with + Add to My Profile Action */}
          {aiResult.potentialSkills && aiResult.potentialSkills.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed #cbd5e1' }}>
              <strong style={{ fontSize: '13px', color: '#d97706', display: 'block', marginBottom: '8px' }}>
                🚀 Recommended Potential Skills (Click to Add to Profile):
              </strong>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {aiResult.potentialSkills.map((skill, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => handleAddPotentialSkill(skill)}
                    style={{ 
                      background: '#fef3c7', 
                      color: '#92400e', 
                      border: '1px solid #f59e0b', 
                      padding: '6px 12px', 
                      borderRadius: '16px', 
                      cursor: 'pointer', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>+ Add to My Profile</span> | <strong>{skill}</strong>
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

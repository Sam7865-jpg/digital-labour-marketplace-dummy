import React, { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://digital-labour-marketplace-dummy-ba.vercel.app';

const SkillProfiler = ({ initialCategory = '' }) => {
  const [trade, setTrade] = useState(initialCategory || 'Plumber');
  const [experienceYears, setExperienceYears] = useState('5');
  const [toolsOperated, setToolsOperated] = useState('');
  const [experienceText, setExperienceText] = useState('');
  
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState('');

  // Voice Input (Speech-to-Text using Web Speech API)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Aap ke browser mein voice recognition support nahi hai. Please Google Chrome / Edge use karein.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ur-PK'; // Urdu / Roman Urdu speech recognition
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
      setError('Kambakhsh experience text ya tools ka zikr zaroori hai.');
      return;
    }
    setError('');
    setLoading(true);

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
        setError(data.message || 'AI Profiling mein issue aaya.');
      }
    } catch (err) {
      setLoading(false);
      setError('Server connection error. URL check karein.');
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: '#4c1d95', fontSize: '20px' }}>✨ AI Experience & Skill Profiler</h3>
        <span style={{ background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
          Gemini AI Engine
        </span>
      </div>

      <form onSubmit={handleAnalyze}>
        {/* Structured Input Row 1: Primary Trade & Years of Experience */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px', color: '#334155' }}>
              Primary Trade / Skill Category
            </label>
            <input 
              type="text" 
              value={trade} 
              onChange={(e) => setTrade(e.target.value)}
              placeholder="e.g. Plumber, Electrician, Carpenter"
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

        {/* Structured Input Row 2: Tools & Equipment Operated */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px', color: '#334155' }}>
            Tools & Machinery Operated (Comma Separated)
          </label>
          <input 
            type="text" 
            value={toolsOperated} 
            onChange={(e) => setToolsOperated(e.target.value)}
            placeholder="e.g. PPRC Welding Machine, Pipe Threader, Drill Machine, Pressure Tester"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>

        {/* Experience Bio Textarea with Voice Input */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#334155' }}>
              Detailed Experience Bio (Urdu / Roman Urdu / English)
            </label>
            
            {/* Speech-To-Text Voice Button */}
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
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🎤</span> {isListening ? 'Boliey (Listening...)' : 'Voice Input (Bol Kar Likhein)'}
            </button>
          </div>

          <textarea 
            rows="4"
            value={experienceText}
            onChange={(e) => setExperienceText(e.target.value)}
            placeholder="Apne kaam ka tajurba yahan bayan karein ya mic button daba kar bolein (e.g., Mujhe 6 saal ka experience hai piping aur leak repair mein...)"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: '13px', fontWeight: 'bold' }}>{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          style={{ background: '#7c3aed', color: '#ffffff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '15px' }}
        >
          {loading ? '✨ Gemini AI Extracting Trade Profile...' : '✨ Generate AI Skill Profile'}
        </button>
      </form>

      {/* Structured Output Rendering */}
      {aiResult && (
        <div style={{ marginTop: '20px', padding: '18px', background: '#ffffff', borderRadius: '10px', border: '1px solid #ddd6fe' }}>
          <h4 style={{ color: '#5b21b6', marginTop: 0, marginBottom: '10px' }}>Structured Worker Skill Profile</h4>
          <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Category:</strong> {aiResult.category}</p>

          <div style={{ marginTop: '12px' }}>
            <strong style={{ fontSize: '14px' }}>Extracted Trade Skills:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {aiResult.extractedSkills?.map((s, idx) => (
                <span key={idx} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '16px', fontSize: '13px' }}>
                  <strong>{s.name}</strong> — <span style={{ color: '#059669', fontWeight: 'bold' }}>{s.proficiency}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillProfiler;

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function JournalBox({ value, onChange, onAnalyze }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('antara_token');
      const response = await axios.post('http://localhost:8000/api/journal/analyze', 
        { content: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      onAnalyze({
        stress: data.stress_score,
        focus: data.focus_score,
        positivity: data.positivity_score,
        distortions: data.cognitive_distortions
      });
      onChange(""); // clear journal after log
    } catch (error) {
      console.error("Failed to analyze journal:", error);
      alert("Backend analysis failed. Please ensure the Python FastAPI server is running on port 8000.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      <textarea
        rows="5"
        placeholder="e.g. I have my JEE mock test tomorrow and I feel completely unprepared..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-foreground placeholder:text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all mb-4 resize-y"
      ></textarea>
      
      <button 
        className="btn" 
        onClick={handleAnalyze} 
        disabled={!value.trim() || isAnalyzing}
      >
        {isAnalyzing ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
        {isAnalyzing ? 'DeepSeek is Analyzing...' : 'Secure Log & Analyze'}
      </button>
    </div>
  );
}

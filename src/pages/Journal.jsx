import React, { useState, useEffect } from 'react';
import JournalBox from '../components/JournalBox';
import axios from 'axios';
import { Sparkles, Brain, Activity, Clock } from 'lucide-react';

export default function JournalPage() {
  const [journalText, setJournalText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('antara_token');
      const response = await axios.get('http://localhost:8000/api/journal/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const handleAnalyze = (result) => {
    setAnalysis(result);
    fetchHistory(); // refresh history
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/20 rounded-xl">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">AI Journal</h1>
          <p className="text-muted text-lg">Log your thoughts and get instant CBT analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Journal Entry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              New Entry
            </h3>
            <JournalBox 
              value={journalText} 
              onChange={setJournalText} 
              onAnalyze={handleAnalyze} 
            />
          </div>

          {/* Analysis Results Display */}
          {analysis && (
            <div className="glass-panel bg-primary/5 border-primary/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-success-color" />
                Latest Analysis
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-background-color/50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-primary">{analysis.stress}%</div>
                  <div className="text-xs text-muted uppercase tracking-wider mt-1">Stress Level</div>
                </div>
                <div className="bg-background-color/50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-success-color">{analysis.focus}%</div>
                  <div className="text-xs text-muted uppercase tracking-wider mt-1">Focus Score</div>
                </div>
                <div className="bg-background-color/50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-warning-color">{analysis.positivity}%</div>
                  <div className="text-xs text-muted uppercase tracking-wider mt-1">Positivity</div>
                </div>
              </div>
              <div className="bg-background-color/50 p-4 rounded-xl">
                <div className="text-sm text-muted mb-1">Cognitive Distortions Detected:</div>
                <div className="font-medium text-error-color">{analysis.distortions || "None"}</div>
              </div>
            </div>
          )}
        </div>

        {/* History Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel h-full">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-text-secondary" />
              Recent Logs
            </h3>
            
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-muted text-sm text-center py-8">No previous entries found.</div>
              ) : (
                history.map((entry, idx) => (
                  <div key={idx} className="bg-background-color/40 border border-surface-border rounded-xl p-4 transition-all hover:border-primary/30 hover:bg-background-color/60">
                    <p className="text-sm line-clamp-3 mb-3 text-text-primary/90">{entry.content}</p>
                    <div className="flex items-center gap-3 text-xs font-medium">
                      <span className="text-error-color">Stress: {entry.stress_score}%</span>
                      <span className="text-success-color">Focus: {entry.focus_score}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

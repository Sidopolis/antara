import React from 'react';
import { Activity, Zap, Heart } from 'lucide-react';

export default function MoodDashboard({ moodData }) {
  const getStatusColor = (value, inverse = false) => {
    if (inverse) {
      if (value > 70) return 'var(--error-color)';
      if (value > 40) return 'var(--warning-color)';
      return 'var(--success-color)';
    } else {
      if (value > 70) return 'var(--success-color)';
      if (value > 40) return 'var(--warning-color)';
      return 'var(--error-color)';
    }
  };

  return (
    <div className="glass-panel">
      <h3 style={{ marginBottom: '1.5rem' }}>Wellness Overview</h3>
      
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--error-color)' }}>
          <Activity size={24} />
        </div>
        <div className="stat-info" style={{ flex: 1 }}>
          <h4>Stress Level</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, background: 'var(--surface-border)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${moodData.stress}%`, 
                  background: getStatusColor(moodData.stress, true),
                  transition: 'width 1s ease'
                }} 
              />
            </div>
            <p style={{ color: getStatusColor(moodData.stress, true) }}>{moodData.stress}%</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-color)' }}>
          <Zap size={24} />
        </div>
        <div className="stat-info" style={{ flex: 1 }}>
          <h4>Focus & Clarity</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, background: 'var(--surface-border)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${moodData.focus}%`, 
                  background: getStatusColor(moodData.focus),
                  transition: 'width 1s ease'
                }} 
              />
            </div>
            <p style={{ color: getStatusColor(moodData.focus) }}>{moodData.focus}%</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success-color)' }}>
          <Heart size={24} />
        </div>
        <div className="stat-info" style={{ flex: 1 }}>
          <h4>Positivity</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, background: 'var(--surface-border)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${moodData.positivity}%`, 
                  background: getStatusColor(moodData.positivity),
                  transition: 'width 1s ease'
                }} 
              />
            </div>
            <p style={{ color: getStatusColor(moodData.positivity) }}>{moodData.positivity}%</p>
          </div>
        </div>
      </div>
      
      
      {moodData.distortions && moodData.distortions !== "None" && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary-color, #3b82f6)', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--primary-color, #3b82f6)', marginBottom: '0.5rem', fontWeight: 600 }}>CBT Distortions Detected</h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            {moodData.distortions}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Open the AI Chat to systematically break down and restructure these thoughts.
          </p>
        </div>
      )}

      {moodData.stress > 70 && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning-color)', borderRadius: '8px' }}>
          <h4 style={{ color: 'var(--warning-color)', marginBottom: '0.5rem' }}>High Stress Detected</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Your recent logs indicate high stress. We recommend a 5-minute breathing break. Chat with Antara for a CBT reset.
          </p>
        </div>
      )}
    </div>
  );
}

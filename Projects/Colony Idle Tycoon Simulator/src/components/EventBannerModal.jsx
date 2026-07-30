import React from 'react';
import { Flame, Wheat, Store, Shield, Sparkles, X } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

export default function EventBannerModal({ activeTimedEvent, onResolveEvent, onDismiss }) {
  if (!activeTimedEvent) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 90,
      maxWidth: '420px',
      width: '100%',
      background: 'linear-gradient(180deg, #4a0d18 0%, #1a0509 100%)',
      border: '2px solid #e63946',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 8px 30px rgba(230, 57, 70, 0.4)',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame color="#ff4d6d" className="pulse-glow" />
          <h3 className="font-medieval" style={{ color: '#ffffff', fontSize: '1.05rem' }}>
            {activeTimedEvent.name}
          </h3>
        </div>
        <button
          onClick={() => { audioSynth.playClick(); onDismiss(); }}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>

      <p style={{ fontSize: '0.8rem', color: '#ffb3c1', marginBottom: '14px', lineHeight: '1.4' }}>
        {activeTimedEvent.desc}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', color: '#ffd700' }}>
          ⏳ Expires in: {Math.max(0, Math.ceil((activeTimedEvent.expiresAt - Date.now()) / 1000))}s
        </span>

        <button
          className="btn-medieval btn-crimson"
          onClick={() => {
            audioSynth.playQuestComplete();
            onResolveEvent(activeTimedEvent);
          }}
          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
        >
          {activeTimedEvent.id === 'dragon_attack' ? '⚔️ Fight Dragon' : '🌾 Claim Bounty'}
        </button>
      </div>
    </div>
  );
}

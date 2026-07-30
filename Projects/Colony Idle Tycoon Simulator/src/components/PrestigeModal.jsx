import React from 'react';
import { Crown, Sparkles, X, RefreshCw } from 'lucide-react';
import { formatNumber } from '../utils/formatters';
import { audioSynth } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

export default function PrestigeModal({ gameState, onClose, onPrestigeRebirth }) {
  const currentGold = gameState.resources?.gold || 0;
  const currentJewels = gameState.crownJewels || 0;

  // Formula: Crown Jewels earned = floor((Gold / 100,000) ^ 0.5)
  const pendingJewels = Math.max(0, Math.floor(Math.sqrt(currentGold / 100000)));
  const canRebirth = pendingJewels > 0;

  const triggerRebirth = () => {
    if (!canRebirth) return;
    audioSynth.playQuestComplete();

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    onPrestigeRebirth(pendingJewels);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Crown color="#ffd700" size={26} />
            <h2 className="font-royal text-gold" style={{ fontSize: '1.3rem' }}>
              Found a New Realm (Crown Rebirth)
            </h2>
          </div>
          <button className="btn-medieval" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 16px auto',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffd700 0%, #800020 100%)',
            border: '3px solid #ffd700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(255, 215, 0, 0.5)'
          }}>
            <Crown size={44} color="#ffffff" />
          </div>

          <h3 className="font-medieval text-gold" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
            Current Crown Jewels: {currentJewels} 💎
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '500px', margin: '0 auto 20px auto' }}>
            Each Crown Jewel grants a permanent <strong>+100% multiplier</strong> to ALL resource production rates across all future kingdom playthroughs!
          </p>

          <div style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid var(--wood-border)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Treasury Gold:</div>
            <div className="font-medieval text-gold" style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0 12px 0' }}>
              {formatNumber(currentGold)} Gold
            </div>

            <div style={{ borderTop: '1px solid #4a2e12', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Sparkles color="#ffd700" size={20} />
              <span style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 'bold' }}>
                Jewels Earned on Rebirth: <span style={{ color: '#ffd700' }}>+{pendingJewels} 💎</span>
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#e63946', marginBottom: '20px' }}>
            ⚠️ Rebirthing resets your buildings and base resources, but keeps your Crown Jewels, Tech tree bonuses, and Leaderboard standing intact!
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn-medieval" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-medieval btn-gold pulse-glow"
              disabled={!canRebirth}
              onClick={triggerRebirth}
              style={{ padding: '12px 24px', fontSize: '1rem' }}
            >
              <RefreshCw size={18} /> Found New Realm (+{pendingJewels} Jewels)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

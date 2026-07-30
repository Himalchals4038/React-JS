import React from 'react';
import { formatTime, formatNumber } from '../utils/formatters';
import { RESOURCES } from '../utils/constants';
import { audioSynth } from '../utils/audioSynth';
import { Clock, Gift, X } from 'lucide-react';

export default function OfflineReportModal({ offlineReport, onClose }) {
  if (!offlineReport) return null;

  const { elapsedSeconds, earnings } = offlineReport;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'center' }}>
        <div className="modal-header" style={{ justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gift color="#ffd700" size={26} />
            <h2 className="font-royal text-gold" style={{ fontSize: '1.3rem' }}>
              Welcome Back, Royal Sovereign!
            </h2>
          </div>
        </div>

        <div className="modal-body">
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid var(--wood-border)',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Clock size={16} color="#ffd700" /> Time Away: <strong>{formatTime(elapsedSeconds)}</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#2a9d8f', marginTop: '4px' }}>
              Your kingdom artisans and managers worked tirelessly while you were away!
            </p>
          </div>

          <h3 className="font-medieval text-gold" style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
            Offline Resources Harvested:
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
            {Object.entries(earnings).map(([resId, amount]) => {
              const cfg = RESOURCES[resId];
              if (!cfg || amount <= 0) return null;

              return (
                <div
                  key={resId}
                  style={{
                    background: cfg.bg,
                    border: `1px solid ${cfg.color}40`,
                    borderRadius: '8px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>{cfg.name}</span>
                  <span className="font-medieval" style={{ fontSize: '1rem', color: cfg.color, fontWeight: 800 }}>
                    +{formatNumber(amount)}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            className="btn-medieval btn-gold pulse-glow"
            onClick={() => {
              audioSynth.playQuestComplete();
              onClose();
            }}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            👑 Claim Kingdom Earnings
          </button>
        </div>
      </div>
    </div>
  );
}

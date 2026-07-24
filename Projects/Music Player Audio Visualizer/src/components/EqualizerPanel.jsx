import React from 'react';
import { Sliders, X, Zap, RefreshCw } from 'lucide-react';
import { EQ_PRESETS } from '../hooks/useAudioEngine';

const FREQ_LABELS = ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'];

export function EqualizerPanel({ isOpen, onClose, audioEngine }) {
  if (!isOpen) return null;

  const {
    eqGains,
    bassBoost,
    currentPreset,
    setEqBandGain,
    applyPreset,
    setBassBoostLevel
  } = audioEngine;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Sliders className="brand-icon" size={24} />
            10-Band Audio Equalizer & FX
          </h3>
          <button className="ctrl-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Presets Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            EQ Presets:
          </span>
          <div className="eq-presets-bar">
            {Object.keys(EQ_PRESETS).map(preset => (
              <button
                key={preset}
                className={`pill ${currentPreset === preset ? 'active' : ''}`}
                onClick={() => applyPreset(preset)}
                style={{ fontSize: '0.75rem', padding: '5px 12px' }}
              >
                {preset}
              </button>
            ))}
            {currentPreset === 'Custom' && (
              <button className="pill active" style={{ fontSize: '0.75rem', padding: '5px 12px' }}>
                Custom
              </button>
            )}
          </div>
        </div>

        {/* 10-Band Sliders Grid */}
        <div className="eq-sliders-grid">
          {FREQ_LABELS.map((label, index) => (
            <div key={label} className="eq-col">
              <span className="eq-val">
                {eqGains[index] > 0 ? `+${eqGains[index]}` : eqGains[index]}dB
              </span>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={eqGains[index] || 0}
                onChange={(e) => setEqBandGain(index, parseInt(e.target.value))}
                className="eq-slider-vertical"
              />
              <span className="eq-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Extra FX: Bass Booster */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={20} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Extra Bass Booster</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enhance low-end punch & sub-bass</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '180px' }}>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={bassBoost}
              onChange={(e) => setBassBoostLevel(parseInt(e.target.value))}
              className="slider"
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-primary)', minWidth: '36px' }}>
              {bassBoost}%
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
          <button className="btn btn-glass" onClick={() => applyPreset('Flat')}>
            <RefreshCw size={14} /> Reset Flat
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}

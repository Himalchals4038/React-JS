import React from 'react';
import { CASTLE_SKINS, CREST_BANNERS } from '../utils/constants';
import { audioSynth } from '../utils/audioSynth';
import { Palette, X, Sun, Moon, CloudRain, Snowflake, Zap, Check } from 'lucide-react';

export default function RealmCustomizerModal({ gameState, onClose, onChangeSkin, onChangeCrest, onChangeWeather, onChangeTimeOfDay }) {
  const activeSkin = gameState.activeSkin || 'default';
  const activeCrest = gameState.activeCrest || 'lion';
  const activeWeather = gameState.weather || 'sunny';
  const activeTime = gameState.timeOfDay || 'day';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Palette color="#ffd700" size={26} />
            <h2 className="font-royal text-gold" style={{ fontSize: '1.3rem' }}>
              Realm Architecture & Environment Customizer
            </h2>
          </div>
          <button className="btn-medieval" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Section 1: Castle Wall Skins */}
          <h3 className="font-medieval text-gold" style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
            🏰 Castle Wall & Citadel Skins
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {CASTLE_SKINS.map(skin => {
              const isSelected = activeSkin === skin.id;
              return (
                <div
                  key={skin.id}
                  onClick={() => {
                    audioSynth.playClick();
                    onChangeSkin(skin.id);
                  }}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: isSelected ? `2px solid ${skin.border}` : '1px solid #4a2e12',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div className="font-medieval" style={{ color: isSelected ? '#ffffff' : 'var(--text-muted)', fontSize: '0.95rem' }}>
                      {skin.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {skin.desc}
                    </div>
                  </div>
                  {isSelected && <Check size={18} color="#2a9d8f" />}
                </div>
              );
            })}
          </div>

          {/* Section 2: Crest Banners */}
          <h3 className="font-medieval text-gold" style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
            🚩 Royal Banner Crests
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {CREST_BANNERS.map(crest => {
              const isSelected = activeCrest === crest.id;
              return (
                <div
                  key={crest.id}
                  onClick={() => {
                    audioSynth.playClick();
                    onChangeCrest(crest.id);
                  }}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: isSelected ? `2px solid ${crest.color}` : '1px solid #4a2e12',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{crest.icon}</span>
                  <div className="font-medieval" style={{ color: isSelected ? '#ffffff' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {crest.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 3: Weather & Lighting */}
          <h3 className="font-medieval text-gold" style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
            🌦️ Weather & Lighting Controls
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Weather Picker */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Atmospheric Weather:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'sunny', label: 'Sunny', icon: Sun },
                  { id: 'rainy', label: 'Rainy', icon: CloudRain },
                  { id: 'snowy', label: 'Snowy', icon: Snowflake },
                  { id: 'eclipse', label: 'Eclipse', icon: Zap }
                ].map(w => {
                  const WIcon = w.icon;
                  const sel = activeWeather === w.id;
                  return (
                    <button
                      key={w.id}
                      className={`btn-medieval ${sel ? 'btn-gold' : ''}`}
                      onClick={() => { audioSynth.playClick(); onChangeWeather(w.id); }}
                      style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                    >
                      <WIcon size={14} /> {w.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time of Day Picker */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Lighting Time of Day:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'day', label: 'Daylight', icon: Sun },
                  { id: 'night', label: 'Nightfall', icon: Moon }
                ].map(t => {
                  const TIcon = t.icon;
                  const sel = activeTime === t.id;
                  return (
                    <button
                      key={t.id}
                      className={`btn-medieval ${sel ? 'btn-gold' : ''}`}
                      onClick={() => { audioSynth.playClick(); onChangeTimeOfDay(t.id); }}
                      style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '0.8rem' }}
                    >
                      <TIcon size={14} /> {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

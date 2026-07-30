import React from 'react';
import { Crown, Sparkles, Trophy, Store, Users, Calendar, Volume2, VolumeX, Save, RefreshCw, Bot, Palette, LogOut, FlaskConical } from 'lucide-react';
import { SOVEREIGN_CHARACTERS } from '../utils/constants';
import { audioSynth } from '../utils/audioSynth';

export default function Navbar({
  gameState,
  syncStatus,
  soundEnabled,
  setSoundEnabled,
  onOpenModal,
  onExitToProfiles
}) {
  const charCfg = SOVEREIGN_CHARACTERS.find(c => c.id === gameState.characterId) || SOVEREIGN_CHARACTERS[0];

  const toggleAudio = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    audioSynth.enabled = nextState;
    if (nextState) audioSynth.playClick();
  };

  return (
    <header style={{
      background: 'linear-gradient(180deg, #2b170a 0%, #170b04 100%)',
      borderBottom: '2px solid #b8860b',
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      boxShadow: '0 4px 25px rgba(0,0,0,0.85)'
    }}>
      {/* Top Center Row: Ruler Character Info & DB Cloud Sync */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', textAlign: 'center' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${charCfg.portraitColor} 0%, #1e1108 100%)`,
          border: `3px solid ${charCfg.portraitColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          boxShadow: `0 0 18px ${charCfg.portraitColor}60`
        }}>
          {charCfg.avatar}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className="font-royal text-gold" style={{ fontSize: '1.4rem', lineHeight: '1.2' }}>
              {gameState.realmName || 'Crown Realm'}
            </h1>
            <button
              className="btn-medieval btn-crimson"
              onClick={onExitToProfiles}
              style={{ fontSize: '0.75rem', padding: '3px 10px' }}
              title="Exit current realm to character profiles"
            >
              <LogOut size={12} color="#ffffff" /> Profiles
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span>Ruler: <strong style={{ color: '#ffffff' }}>{gameState.rulerName}</strong> ({charCfg.name})</span>
            <span style={{ color: charCfg.portraitColor, fontSize: '0.75rem', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '6px', border: `1px solid ${charCfg.portraitColor}60` }}>
              Trait: {charCfg.traitName}
            </span>
            {gameState.crownJewels > 0 && (
              <span style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#ffd700', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', border: '1px solid #b8860b', fontWeight: 'bold' }}>
                💎 {gameState.crownJewels} Crown Jewels (+{gameState.crownJewels * 100}% Yield)
              </span>
            )}
          </div>
        </div>

        {/* Cloud Sync Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: '20px', border: '1px solid #4a2e12' }}>
          {syncStatus === 'saving' ? (
            <span style={{ color: '#ffd700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
              Saving DB...
            </span>
          ) : syncStatus === 'synced' ? (
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={14} color="#10b981" /> DB Synced
            </span>
          ) : (
            <span style={{ color: '#ef4444' }}>Offline Save</span>
          )}
        </div>
      </div>

      {/* Centered Distinct Color-Coded Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button className="btn-medieval" onClick={() => { audioSynth.playClick(); onOpenModal('alchemy'); }}>
          <FlaskConical size={18} color="#a855f7" /> Alchemy & Shrine
        </button>

        <button className="btn-medieval" onClick={() => { audioSynth.playClick(); onOpenModal('autoHarvester'); }}>
          <Bot size={18} color="#3b82f6" /> Auto-Collectors
        </button>

        <button className="btn-medieval" onClick={() => { audioSynth.playClick(); onOpenModal('customizer'); }}>
          <Palette size={18} color="#ec4899" /> Customizer
        </button>

        <button className="btn-medieval" onClick={() => { audioSynth.playClick(); onOpenModal('tech'); }}>
          <Sparkles size={18} color="#8b5cf6" /> Research
        </button>

        <button className="btn-medieval" onClick={() => { audioSynth.playClick(); onOpenModal('npcs'); }}>
          <Users size={18} color="#10b981" /> Council
        </button>

        <button className="btn-medieval" onClick={() => { audioSynth.playClick(); onOpenModal('bazaar'); }}>
          <Store size={18} color="#f59e0b" /> Bazaar
        </button>

        <button className="btn-medieval" onClick={() => { audioSynth.playClick(); onOpenModal('seasonal'); }}>
          <Calendar size={18} color="#f43f5e" /> Festivals
        </button>

        <button className="btn-medieval" onClick={() => { audioSynth.playClick(); onOpenModal('leaderboard'); }}>
          <Trophy size={18} color="#eab308" /> Leaderboard
        </button>

        <button className="btn-medieval btn-gold" onClick={() => { audioSynth.playClick(); onOpenModal('prestige'); }}>
          <Crown size={18} color="#f97316" /> Rebirth
        </button>

        <button
          className="btn-medieval"
          style={{ padding: '8px 14px' }}
          onClick={toggleAudio}
          title={soundEnabled ? 'Mute Audio SFX' : 'Enable Audio SFX'}
        >
          {soundEnabled ? <Volume2 size={18} color="#14b8a6" /> : <VolumeX size={18} color="#ef4444" />}
        </button>
      </div>
    </header>
  );
}

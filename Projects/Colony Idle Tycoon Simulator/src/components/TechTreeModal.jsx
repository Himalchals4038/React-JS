import React, { useState } from 'react';
import { TECH_TREE, RESOURCES } from '../utils/constants';
import { formatNumber } from '../utils/formatters';
import { audioSynth } from '../utils/audioSynth';
import { X, Check, Sparkles, Lock, Crown, Layers, Zap } from 'lucide-react';

export default function TechTreeModal({ gameState, onClose, onResearchTech }) {
  const [activeSection, setActiveSection] = useState('resource'); // 'resource' | 'overall'
  const [selectedResFilter, setSelectedResFilter] = useState('all'); // 'all' | 'timber' | 'stone' | 'provisions' | 'iron' | 'gold' | 'mana'

  const { unlockedTechs = [], resources = {} } = gameState;

  const canAffordTech = (tech) => {
    return Object.entries(tech.cost).every(([resId, amount]) => (resources[resId] || 0) >= amount);
  };

  const isPrereqMet = (tech) => {
    if (!tech.prereq || tech.prereq.length === 0) return true;
    return tech.prereq.every(reqId => unlockedTechs.includes(reqId));
  };

  // Filter tech nodes by category & resource type
  const filteredTechs = TECH_TREE.filter(tech => {
    if (activeSection === 'overall') {
      return tech.category === 'overall';
    }
    if (selectedResFilter === 'all') {
      return tech.category === 'resource';
    }
    return tech.category === 'resource' && tech.targetResource === selectedResFilter;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '880px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles color="#9370db" size={26} />
            <h2 className="font-royal text-gold" style={{ fontSize: '1.3rem' }}>
              Royal Research Guild Codex
            </h2>
          </div>
          <button className="btn-medieval" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Category Section Switcher Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              className={`btn-medieval ${activeSection === 'resource' ? 'btn-gold' : ''}`}
              onClick={() => { audioSynth.playClick(); setActiveSection('resource'); }}
              style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.9rem' }}
            >
              <Zap size={18} /> Section 1: Resource-Specific Production Boosts
            </button>

            <button
              className={`btn-medieval ${activeSection === 'overall' ? 'btn-gold' : ''}`}
              onClick={() => { audioSynth.playClick(); setActiveSection('overall'); }}
              style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.9rem' }}
            >
              <Crown size={18} /> Section 2: Overall Kingdom Realm Multipliers
            </button>
          </div>

          {/* Sub-Filter for Resource-Specific Boosts */}
          {activeSection === 'resource' && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button
                className={`btn-medieval ${selectedResFilter === 'all' ? 'btn-gold' : ''}`}
                onClick={() => { audioSynth.playClick(); setSelectedResFilter('all'); }}
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                All Resources
              </button>

              {Object.entries(RESOURCES).map(([rId, cfg]) => (
                <button
                  key={rId}
                  className={`btn-medieval ${selectedResFilter === rId ? 'btn-gold' : ''}`}
                  onClick={() => { audioSynth.playClick(); setSelectedResFilter(rId); }}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    color: selectedResFilter === rId ? '#000000' : cfg.color
                  }}
                >
                  {cfg.name}
                </button>
              ))}
            </div>
          )}

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {activeSection === 'resource'
              ? 'Target specific raw materials to unlock exponential production multipliers.'
              : 'Unlock realm-wide imperial edicts that boost ALL kingdom resource production across the board!'}
          </p>

          {/* Tech Nodes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTechs.map((tech) => {
              const isUnlocked = unlockedTechs.includes(tech.id);
              const prereqOk = isPrereqMet(tech);
              const affordable = canAffordTech(tech);
              const targetResCfg = tech.targetResource ? RESOURCES[tech.targetResource] : null;

              return (
                <div
                  key={tech.id}
                  style={{
                    background: isUnlocked ? 'rgba(42, 157, 143, 0.15)' : 'rgba(26, 17, 10, 0.8)',
                    border: isUnlocked ? '1px solid #2a9d8f' : prereqOk ? '1px solid #4a2e12' : '1px dashed #2b1b0e',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    opacity: prereqOk ? 1 : 0.6
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 className="font-medieval" style={{ color: isUnlocked ? '#2a9d8f' : '#ffffff', fontSize: '1.1rem' }}>
                        {tech.name}
                      </h3>

                      {targetResCfg && (
                        <span style={{ fontSize: '0.7rem', color: targetResCfg.color, background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '10px', border: `1px solid ${targetResCfg.color}` }}>
                          {targetResCfg.name} Boost
                        </span>
                      )}

                      {tech.category === 'overall' && (
                        <span style={{ fontSize: '0.7rem', color: '#ffd700', background: 'rgba(255, 215, 0, 0.15)', padding: '2px 8px', borderRadius: '10px', border: '1px solid #ffd700' }}>
                          👑 ALL YIELDS BOOST
                        </span>
                      )}

                      {isUnlocked && <Check size={18} color="#2a9d8f" />}
                      {!prereqOk && <Lock size={16} color="#e63946" />}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 8px 0' }}>
                      {tech.desc}
                    </p>

                    {!isUnlocked && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {Object.entries(tech.cost).map(([resId, amount]) => {
                          const has = resources[resId] || 0;
                          const ok = has >= amount;
                          return (
                            <span
                              key={resId}
                              style={{
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: ok ? 'rgba(42, 157, 143, 0.2)' : 'rgba(230, 57, 70, 0.2)',
                                border: `1px solid ${ok ? '#2a9d8f' : '#e63946'}`,
                                color: ok ? '#ffffff' : '#ff8fa3'
                              }}
                            >
                              {RESOURCES[resId]?.name}: {formatNumber(amount)}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    {isUnlocked ? (
                      <span style={{ color: '#2a9d8f', fontWeight: 'bold', fontSize: '0.9rem' }}>UNLOCKED ✓</span>
                    ) : (
                      <button
                        className="btn-medieval btn-gold"
                        disabled={!prereqOk || !affordable}
                        onClick={() => {
                          if (prereqOk && affordable) {
                            audioSynth.playUpgrade();
                            onResearchTech(tech.id, tech.cost);
                          }
                        }}
                      >
                        Research Tech
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

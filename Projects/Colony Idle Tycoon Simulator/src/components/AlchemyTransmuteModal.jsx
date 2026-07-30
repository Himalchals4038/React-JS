import React, { useState } from 'react';
import { RESOURCES } from '../utils/constants';
import { formatNumber } from '../utils/formatters';
import { audioSynth } from '../utils/audioSynth';
import { FlaskConical, Gift, Sparkles, X, ArrowRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

const TRANSMUTES = [
  { id: 't_wood_stone', name: 'Timber to Quarry Stone', fromRes: 'timber', toRes: 'stone', ratio: 0.5, costAmount: 100 },
  { id: 't_stone_iron', name: 'Stone to Iron Ore', fromRes: 'stone', toRes: 'iron', ratio: 0.4, costAmount: 100 },
  { id: 't_iron_mana', name: 'Iron Ore to Arcane Mana', fromRes: 'iron', toRes: 'mana', ratio: 0.25, costAmount: 100 },
  { id: 't_mana_gold', name: 'Mana to Sovereign Gold', fromRes: 'mana', toRes: 'gold', ratio: 5.0, costAmount: 100 }
];

export default function AlchemyTransmuteModal({ gameState, onClose, onTransmuteResource, onSpinShrine }) {
  const [activeTab, setActiveTab] = useState('alchemy'); // 'alchemy' | 'shrine'
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  const { resources = {} } = gameState;

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    audioSynth.playUpgrade();

    setTimeout(() => {
      setSpinning(false);
      const rewards = [
        { res: 'gold', amount: 25000, label: '💰 25,000 Gold Jackpot!' },
        { res: 'mana', amount: 2000, label: '🔮 2,000 Arcane Mana Surge!' },
        { res: 'iron', amount: 5000, label: '⚔️ 5,000 Iron Ore Bounty!' },
        { res: 'provisions', amount: 10000, label: '🌾 10,000 Grain Harvest!' },
        { res: 'crownJewels', amount: 1, label: '💎 1 Crown Jewel Relic!' }
      ];
      const win = rewards[Math.floor(Math.random() * rewards.length)];
      setSpinResult(win);
      audioSynth.playQuestComplete();

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onSpinShrine(win);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FlaskConical color="#9370db" size={26} />
            <h2 className="font-royal text-gold" style={{ fontSize: '1.3rem' }}>
              Alchemy Transmutation & Fortune Shrine
            </h2>
          </div>
          <button className="btn-medieval" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button
              className={`btn-medieval ${activeTab === 'alchemy' ? 'btn-gold' : ''}`}
              onClick={() => { audioSynth.playClick(); setActiveTab('alchemy'); }}
              style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.9rem' }}
            >
              <FlaskConical size={18} /> Arcane Alchemical Transmutation
            </button>

            <button
              className={`btn-medieval ${activeTab === 'shrine' ? 'btn-gold' : ''}`}
              onClick={() => { audioSynth.playClick(); setActiveTab('shrine'); }}
              style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.9rem' }}
            >
              <Gift size={18} /> Royal Fortune Shrine Wheel
            </button>
          </div>

          {activeTab === 'alchemy' ? (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Transmute excess raw materials into higher tier resources and gold using Archmage Eldrin's alchemy recipes!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {TRANSMUTES.map(t => {
                  const owned = resources[t.fromRes] || 0;
                  const canTransmute100 = owned >= t.costAmount;
                  const gained = Math.floor(t.costAmount * t.ratio);

                  return (
                    <div
                      key={t.id}
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid #4a2e12',
                        borderRadius: '10px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ fontSize: '1.2rem', color: RESOURCES[t.fromRes]?.color, fontWeight: 'bold' }}>
                          {formatNumber(t.costAmount)} {RESOURCES[t.fromRes]?.name}
                        </div>
                        <ArrowRight size={20} color="#ffd700" />
                        <div style={{ fontSize: '1.2rem', color: RESOURCES[t.toRes]?.color, fontWeight: 'bold' }}>
                          +{formatNumber(gained)} {RESOURCES[t.toRes]?.name || t.toRes}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-medieval btn-gold"
                          disabled={!canTransmute100}
                          onClick={() => {
                            if (canTransmute100) {
                              audioSynth.playCoin();
                              onTransmuteResource(t.fromRes, t.toRes, t.costAmount, gained);
                            }
                          }}
                        >
                          Transmute {formatNumber(t.costAmount)}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <h3 className="font-royal text-gold" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
                ⛩️ Royal Fortune Blessing Wheel
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Spin the sacred realm shrine wheel to win instant resource jackpots and rare Crown Jewels!
              </p>

              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 24px auto',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ffd700 0%, #800020 100%)',
                border: '4px solid #ffd700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 35px rgba(255, 215, 0, 0.6)',
                transform: spinning ? 'rotate(1080deg)' : 'none',
                transition: spinning ? 'transform 1.5s cubic-bezier(0.15, 0.9, 0.3, 1)' : 'none'
              }}>
                <Sparkles size={54} color="#ffffff" />
              </div>

              {spinResult && (
                <div style={{
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '2px solid #ffd700',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '20px',
                  fontSize: '1.2rem',
                  color: '#ffd700',
                  fontWeight: 'bold'
                }}>
                  {spinResult.label}
                </div>
              )}

              <button
                className="btn-medieval btn-gold pulse-glow"
                disabled={spinning}
                onClick={handleSpin}
                style={{ padding: '12px 32px', fontSize: '1.1rem' }}
              >
                {spinning ? <RefreshCw className="spin" size={20} /> : '🎰 Spin Royal Fortune Wheel'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

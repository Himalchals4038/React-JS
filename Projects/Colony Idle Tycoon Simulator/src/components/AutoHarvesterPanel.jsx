import React from 'react';
import { AUTO_HARVESTERS, RESOURCES } from '../utils/constants';
import { formatNumber } from '../utils/formatters';
import { audioSynth } from '../utils/audioSynth';
import { Bot, Zap, Crown, ChevronUp, X, Check } from 'lucide-react';

const ICON_MAP = { Bot, Zap, Crown };

export default function AutoHarvesterPanel({ gameState, onClose, onUpgradeHarvester }) {
  const { autoHarvesters = {}, resources = {} } = gameState;

  const canAfford = (costs) => {
    return Object.entries(costs).every(([rId, amt]) => (resources[rId] || 0) >= amt);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot color="#ffd700" size={26} />
            <h2 className="font-royal text-gold" style={{ fontSize: '1.3rem' }}>
              Automated Gold & Resource Harvesters
            </h2>
          </div>
          <button className="btn-medieval" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Upgrade automated Golems, Arcane Spells, and Royal Tax Drones to generate massive Gold Coins automatically every second!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {AUTO_HARVESTERS.map(harvester => {
              const currentLvl = autoHarvesters[harvester.id] || 0;
              const IconComp = ICON_MAP[harvester.icon] || Bot;

              // Calculate cost based on multiplier
              const costs = {};
              const mult = Math.pow(harvester.costMultiplier, currentLvl);
              Object.entries(harvester.baseCost).forEach(([rId, baseAmt]) => {
                costs[rId] = Math.floor(baseAmt * mult);
              });

              const affordable = canAfford(costs);
              const currentYield = harvester.goldPerSec * currentLvl;

              return (
                <div
                  key={harvester.id}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: currentLvl > 0 ? '1px solid #2a9d8f' : '1px solid #4a2e12',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      background: 'radial-gradient(circle, #5c3514 0%, #1e1108 100%)',
                      border: '1px solid #ffd700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComp size={24} color="#ffd700" />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 className="font-medieval text-gold" style={{ fontSize: '1.1rem' }}>
                          {harvester.name}
                        </h3>
                        <span style={{ background: '#b8860b', color: '#000000', fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>
                          Lvl {currentLvl}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 6px 0' }}>
                        {harvester.desc}
                      </p>

                      {currentLvl > 0 && (
                        <div style={{ fontSize: '0.8rem', color: '#2a9d8f', fontWeight: 'bold' }}>
                          Current Auto Production: +{formatNumber(currentYield)} Gold/sec
                        </div>
                      )}

                      {/* Upgrade Costs */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {Object.entries(costs).map(([rId, amt]) => {
                          const has = resources[rId] || 0;
                          const isOk = has >= amt;
                          return (
                            <span
                              key={rId}
                              style={{
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: isOk ? 'rgba(42, 157, 143, 0.2)' : 'rgba(230, 57, 70, 0.2)',
                                border: `1px solid ${isOk ? '#2a9d8f' : '#e63946'}`,
                                color: isOk ? '#ffffff' : '#ff8fa3'
                              }}
                            >
                              {RESOURCES[rId]?.name}: {formatNumber(amt)}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn-medieval btn-gold"
                    disabled={!affordable}
                    onClick={() => {
                      if (affordable) {
                        audioSynth.playUpgrade();
                        onUpgradeHarvester(harvester.id, costs);
                      }
                    }}
                  >
                    <ChevronUp size={16} /> Upgrade Harvester
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

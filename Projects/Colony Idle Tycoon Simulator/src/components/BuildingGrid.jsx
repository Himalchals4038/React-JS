import React, { useState } from 'react';
import { BUILDINGS, RESOURCES } from '../utils/constants';
import { getBuildingCost } from '../utils/gameMath';
import { formatNumber } from '../utils/formatters';
import { audioSynth } from '../utils/audioSynth';
import { ChevronUp, UserCheck, Lock, Trees, Mountain, Wheat, Hammer, Coins, Sparkles, Shield, Store, Flame, Crown, Fish, Swords, FlaskConical, Eye, Sun, Layers } from 'lucide-react';

const ICON_MAP = {
  Trees, Mountain, Wheat, Hammer, Coins, Sparkles, Shield, Store, Flame, Crown, Fish, Swords, FlaskConical, Eye, Sun
};

const BUY_MODE_OPTIONS = [1, 10, 50, 100, 200, 1000];

export default function BuildingGrid({ gameState, onUpgradeBuilding, onHireManager }) {
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState('all');

  const { buildings = {}, resources = {} } = gameState;

  const canAfford = (costs) => {
    return Object.entries(costs).every(([resId, amount]) => (resources[resId] || 0) >= amount);
  };

  const filteredBuildings = BUILDINGS.filter(b => {
    if (activeCategory === 'all') return true;
    return b.category === activeCategory;
  });

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Top Bar: Title & Expanded Buy Multipliers */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h2 className="font-royal text-gold" style={{ fontSize: '1.4rem' }}>
          🏰 Realm Structures & Guilds
        </h2>

        {/* Expanded Buy Mode Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(0,0,0,0.5)',
          padding: '4px 8px',
          borderRadius: '8px',
          border: '1px solid var(--wood-border)',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0 6px' }}>Buy Multiplier:</span>
          {BUY_MODE_OPTIONS.map(qty => (
            <button
              key={qty}
              className={`btn-medieval ${buyQuantity === qty ? 'btn-gold' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              onClick={() => { audioSynth.playClick(); setBuyQuantity(qty); }}
            >
              {qty}X
            </button>
          ))}
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Guilds (16)', icon: Layers },
          { id: 'basic', label: '🌾 Basic Resource Guilds', icon: Wheat },
          { id: 'military', label: '⚔️ Military & Industry', icon: Shield },
          { id: 'arcane', label: '🔮 Arcane & Alchemy Spires', icon: Sparkles },
          { id: 'royal', label: '👑 Royal Treasury & Estates', icon: Crown }
        ].map(cat => {
          const CatIcon = cat.icon;
          const isSel = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`btn-medieval ${isSel ? 'btn-gold' : ''}`}
              onClick={() => { audioSynth.playClick(); setActiveCategory(cat.id); }}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <CatIcon size={16} /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* Buildings Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '16px'
      }}>
        {filteredBuildings.map((b) => {
          const currentLevel = buildings[b.id]?.level || 0;
          const hasManager = buildings[b.id]?.hasManager || false;
          const IconComponent = ICON_MAP[b.icon] || Coins;

          const upgradeCosts = getBuildingCost(b, currentLevel, buyQuantity);
          const affordable = canAfford(upgradeCosts);
          const managerAffordable = (resources.gold || 0) >= b.managerCost && currentLevel > 0;

          return (
            <div
              key={b.id}
              className="medieval-panel"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: currentLevel > 0 ? '1px solid var(--wood-border)' : '1px dashed #4a2e12',
                opacity: currentLevel === 0 ? 0.85 : 1
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      background: currentLevel > 0 ? 'radial-gradient(circle, #5c3514 0%, #1e1108 100%)' : '#150b04',
                      border: currentLevel > 0 ? '1px solid var(--gold-primary)' : '1px solid #3d250d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={24} color={currentLevel > 0 ? 'var(--gold-primary)' : 'var(--text-muted)'} />
                    </div>

                    <div>
                      <h3 className="font-medieval" style={{ fontSize: '1.1rem', color: currentLevel > 0 ? '#ffffff' : 'var(--text-muted)', lineHeight: '1.2' }}>
                        {b.name}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {b.desc}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    background: currentLevel > 0 ? 'linear-gradient(180deg, #ffd700 0%, #b8860b 100%)' : '#2b1b0e',
                    color: currentLevel > 0 ? '#000000' : 'var(--text-muted)',
                    fontWeight: 800,
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-medieval)',
                    border: '1px solid #b8860b',
                    whiteSpace: 'nowrap'
                  }}>
                    Lvl {currentLevel}
                  </div>
                </div>

                {currentLevel > 0 && (
                  <div style={{
                    margin: '12px 0',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>Yield:</span>
                    <div style={{ display: 'flex', gap: '8px', fontWeight: 600, flexWrap: 'wrap' }}>
                      {Object.entries(b.baseProduction).map(([resId, rate]) => (
                        <span key={resId} style={{ color: RESOURCES[resId]?.color || '#ffffff' }}>
                          +{formatNumber(rate * currentLevel, 1)} {RESOURCES[resId]?.name}/s
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Cost ({buyQuantity}X):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {Object.entries(upgradeCosts).map(([resId, amount]) => {
                      const resCfg = RESOURCES[resId];
                      const currentHas = resources[resId] || 0;
                      const isEnough = currentHas >= amount;

                      return (
                        <span
                          key={resId}
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: isEnough ? 'rgba(42, 157, 143, 0.15)' : 'rgba(230, 57, 70, 0.15)',
                            border: `1px solid ${isEnough ? '#2a9d8f' : '#e63946'}`,
                            color: isEnough ? '#ffffff' : '#ff8fa3'
                          }}
                        >
                          {resCfg?.name}: {formatNumber(amount)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  className={`btn-medieval ${affordable ? 'btn-gold' : ''}`}
                  disabled={!affordable}
                  onClick={() => {
                    if (affordable) {
                      audioSynth.playUpgrade();
                      onUpgradeBuilding(b.id, buyQuantity, upgradeCosts);
                    }
                  }}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <ChevronUp size={16} /> Upgrade ({buyQuantity}X)
                </button>

                {currentLevel > 0 && !hasManager && (
                  <button
                    className="btn-medieval"
                    disabled={!managerAffordable}
                    onClick={() => {
                      if (managerAffordable) {
                        audioSynth.playCoin();
                        onHireManager(b.id, b.managerCost);
                      }
                    }}
                    style={{
                      width: '100%',
                      justify: 'center',
                      fontSize: '0.75rem',
                      padding: '6px',
                      background: managerAffordable ? 'linear-gradient(180deg, #2a9d8f 0%, #175e55 100%)' : 'transparent'
                    }}
                  >
                    <UserCheck size={14} /> Hire {b.managerName} ({formatNumber(b.managerCost)} Gold)
                  </button>
                )}

                {hasManager && (
                  <div style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#2a9d8f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '4px'
                  }}>
                    <UserCheck size={14} /> Managed by {b.managerName} (Automated)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

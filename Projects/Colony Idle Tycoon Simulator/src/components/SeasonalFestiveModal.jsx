import React from 'react';
import { SEASONAL_EVENTS } from '../utils/constants';
import { audioSynth } from '../utils/audioSynth';
import { Calendar, X, ShoppingBag, Sparkles, Check } from 'lucide-react';

export default function SeasonalFestiveModal({ gameState, onClose, onSelectSeason, onBuyShopItem }) {
  const activeSeasonKey = gameState.activeSeasonalEvent || 'winter';
  const currentSeason = SEASONAL_EVENTS[activeSeasonKey] || SEASONAL_EVENTS.winter;
  const eventCurrencyCount = (gameState.seasonalCurrencies || {})[activeSeasonKey] || 0;
  const purchasedSkins = gameState.purchasedSkins || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar color="#ff007f" size={26} />
            <h2 className="font-royal text-gold" style={{ fontSize: '1.3rem' }}>
              Festive Season Special Challenges
            </h2>
          </div>
          <button className="btn-medieval" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Season Switcher Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
            {Object.entries(SEASONAL_EVENTS).map(([sKey, sCfg]) => (
              <button
                key={sKey}
                onClick={() => {
                  audioSynth.playClick();
                  onSelectSeason(sKey);
                }}
                className="btn-medieval"
                style={{
                  flex: 1,
                  justify: 'center',
                  background: activeSeasonKey === sKey ? 'linear-gradient(180deg, #7a1c4b 0%, #380920 100%)' : 'rgba(0,0,0,0.3)',
                  border: activeSeasonKey === sKey ? `2px solid ${sCfg.color}` : '1px solid #4a2e12',
                  color: activeSeasonKey === sKey ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {sCfg.icon} {sCfg.name}
              </button>
            ))}
          </div>

          {/* Active Season Banner */}
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            border: `2px solid ${currentSeason.color}`,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div className="font-royal" style={{ fontSize: '1.4rem', color: currentSeason.color }}>
                {currentSeason.icon} {currentSeason.name}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Earn event currency by producing resources during this active festive challenge!
              </p>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.6)',
              border: `1px solid ${currentSeason.color}`,
              borderRadius: '8px',
              padding: '8px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Event Tokens:</div>
              <div className="font-medieval" style={{ fontSize: '1.4rem', color: currentSeason.color, fontWeight: 800 }}>
                {eventCurrencyCount} {currentSeason.currencyIcon}
              </div>
            </div>
          </div>

          {/* Event Shop Items */}
          <h3 className="font-medieval text-gold" style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} /> Festival Event Rewards Shop
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {currentSeason.shopItems.map(item => {
              const owned = purchasedSkins.includes(item.id);
              const affordable = eventCurrencyCount >= item.cost;

              return (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: owned ? '1px solid #2a9d8f' : '1px solid #4a2e12',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 className="font-medieval" style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '4px' }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      {item.desc}
                    </p>
                  </div>

                  {owned ? (
                    <div style={{ color: '#2a9d8f', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={16} /> Unlocked
                    </div>
                  ) : (
                    <button
                      className="btn-medieval btn-gold"
                      disabled={!affordable}
                      onClick={() => {
                        if (affordable) {
                          audioSynth.playUpgrade();
                          onBuyShopItem(activeSeasonKey, item.id, item.cost);
                        }
                      }}
                      style={{ fontSize: '0.8rem', padding: '6px', justifyContent: 'center' }}
                    >
                      Buy for {item.cost} {currentSeason.currencyIcon}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

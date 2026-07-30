import React, { useEffect, useState } from 'react';
import { fetchMarketTickerApi } from '../services/api';
import { RESOURCES } from '../utils/constants';
import { formatNumber } from '../utils/formatters';
import { audioSynth } from '../utils/audioSynth';
import { Store, X, TrendingUp, TrendingDown, ShoppingBag, DollarSign, Sliders } from 'lucide-react';

const BULK_TIERS = [100, 1000, 10000, 100000, 1000000, 10000000, 100000000];

export default function MarketTradeModal({ gameState, onClose, onSellResource, onBuyResource }) {
  const [tickerData, setTickerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tradeMode, setTradeMode] = useState('sell'); // 'sell' | 'buy'
  const [sliderIndex, setSliderIndex] = useState(1); // Default index 1 = 1k (1000)

  const { resources = {} } = gameState;
  const currentGold = resources.gold || 0;

  const bulkQty = BULK_TIERS[sliderIndex] || 1000;

  const loadTicker = async () => {
    const data = await fetchMarketTickerApi();
    setTickerData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTicker();
    const interval = setInterval(loadTicker, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Store color="#ffd700" size={26} />
            <h2 className="font-royal text-gold" style={{ fontSize: '1.3rem' }}>
              Grand Merchant Bazaar Exchange
            </h2>
          </div>
          <button className="btn-medieval" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Trade Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '8px', border: '1px solid #4a2e12' }}>
              <button
                className={`btn-medieval ${tradeMode === 'sell' ? 'btn-gold' : ''}`}
                onClick={() => { audioSynth.playClick(); setTradeMode('sell'); }}
                style={{ padding: '8px 20px', fontSize: '0.9rem' }}
              >
                <DollarSign size={16} /> Sell Surplus Resources
              </button>

              <button
                className={`btn-medieval ${tradeMode === 'buy' ? 'btn-gold' : ''}`}
                onClick={() => { audioSynth.playClick(); setTradeMode('buy'); }}
                style={{ padding: '8px 20px', fontSize: '0.9rem' }}
              >
                <ShoppingBag size={16} /> Buy Bulk Resources
              </button>
            </div>

            {tickerData && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: tickerData.trend === 'bullish' ? '#2a9d8f' : '#e63946',
                background: 'rgba(0,0,0,0.5)',
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1px solid #4a2e12'
              }}>
                {tickerData.trend === 'bullish' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                Trend: {tickerData.trend.toUpperCase()}
              </div>
            )}
          </div>

          {/* Interactive Range Slider / Scrollbar Quantity Selector */}
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            border: '2px solid #b8860b',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd700', fontSize: '0.95rem', fontWeight: 'bold' }}>
                <Sliders size={18} /> Selected Bulk Trade Quantity:
              </div>
              <div className="font-medieval text-gold" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                {formatNumber(bulkQty)} Units
              </div>
            </div>

            {/* Slider Track */}
            <input
              type="range"
              min={0}
              max={BULK_TIERS.length - 1}
              value={sliderIndex}
              onChange={e => {
                audioSynth.playClick();
                setSliderIndex(parseInt(e.target.value));
              }}
              style={{
                width: '100%',
                accentColor: '#ffd700',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            />

            {/* Preset Tier Buttons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {BULK_TIERS.map((tier, idx) => (
                <button
                  key={tier}
                  className={`btn-medieval ${sliderIndex === idx ? 'btn-gold' : ''}`}
                  onClick={() => { audioSynth.playClick(); setSliderIndex(idx); }}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  {formatNumber(tier)}
                </button>
              ))}
            </div>
          </div>

          {loading || !tickerData ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Fetching live bazaar rates...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(tickerData.rates).map(([resId, ratePerUnit]) => {
                const resCfg = RESOURCES[resId];
                if (!resCfg) return null;

                const owned = resources[resId] || 0;
                const totalCostForBulk = ratePerUnit * bulkQty;
                const canAffordBulk = currentGold >= totalCostForBulk;
                const canSellBulk = owned >= bulkQty;

                return (
                  <div
                    key={resId}
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: `1px solid ${resCfg.color}40`,
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="font-medieval" style={{ fontSize: '1.15rem', color: resCfg.color }}>
                          {resCfg.name}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Stock Owned: {formatNumber(owned)}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: '#ffd700', marginTop: '4px' }}>
                        Rate: <strong>{ratePerUnit} Gold Coins</strong> / unit
                      </div>
                    </div>

                    {/* Trade Actions */}
                    {tradeMode === 'sell' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-medieval"
                          disabled={!canSellBulk}
                          onClick={() => {
                            if (canSellBulk) {
                              audioSynth.playCoin();
                              onSellResource(resId, bulkQty, ratePerUnit);
                            }
                          }}
                        >
                          Sell {formatNumber(bulkQty)} (+{formatNumber(totalCostForBulk)} Gold)
                        </button>

                        <button
                          className="btn-medieval btn-gold"
                          disabled={owned < 1}
                          onClick={() => {
                            if (owned >= 1) {
                              audioSynth.playCoin();
                              onSellResource(resId, owned, ratePerUnit);
                            }
                          }}
                        >
                          Sell ALL ({formatNumber(Math.floor(owned * ratePerUnit))} Gold)
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-medieval btn-gold"
                          disabled={!canAffordBulk}
                          onClick={() => {
                            if (canAffordBulk) {
                              audioSynth.playCoin();
                              onBuyResource(resId, bulkQty, ratePerUnit);
                            }
                          }}
                          style={{ padding: '8px 16px' }}
                        >
                          <ShoppingBag size={16} /> Buy {formatNumber(bulkQty)} ({formatNumber(totalCostForBulk)} Gold)
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

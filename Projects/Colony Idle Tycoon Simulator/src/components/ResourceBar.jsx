import React from 'react';
import { RESOURCES } from '../utils/constants';
import { formatNumber } from '../utils/formatters';
import { Coins, Trees, Mountain, Wheat, Hammer, Sparkles } from 'lucide-react';

const ICON_MAP = {
  Coins: Coins,
  Trees: Trees,
  Mountain: Mountain,
  Wheat: Wheat,
  Hammer: Hammer,
  Sparkles: Sparkles
};

export default function ResourceBar({ resources, productionPerSec }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(20, 12, 6, 0.95) 0%, rgba(35, 20, 10, 0.95) 100%)',
      borderBottom: '1px solid #4a2e12',
      padding: '10px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)'
    }}>
      {Object.entries(RESOURCES).map(([resId, cfg]) => {
        const amount = resources[resId] || 0;
        const rate = productionPerSec[resId] || 0;
        const IconComponent = ICON_MAP[cfg.icon] || Coins;

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
              gap: '10px',
              transition: 'transform 0.15s ease',
              boxShadow: `0 2px 8px ${cfg.color}15`
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(0,0,0,0.4)',
              border: `1px solid ${cfg.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconComponent size={18} color={cfg.color} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {cfg.name}
              </div>
              <div className="font-medieval" style={{ fontSize: '1.1rem', fontWeight: 800, color: cfg.color, lineHeight: 1.1 }}>
                {formatNumber(amount)}
              </div>
              {rate > 0 && (
                <div style={{ fontSize: '0.7rem', color: '#2a9d8f', fontWeight: 600 }}>
                  +{formatNumber(rate, 1)}/s
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { fetchLeaderboardApi } from '../services/api';
import { formatNumber } from '../utils/formatters';
import { Trophy, X, Crown, Shield, Award } from 'lucide-react';

export default function LeaderboardModal({ onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardApi().then(res => {
      setLeaderboard(res.leaderboard || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy color="#ffd700" size={26} />
            <h2 className="font-royal text-gold" style={{ fontSize: '1.3rem' }}>
              Realm Sovereign Leaderboards
            </h2>
          </div>
          <button className="btn-medieval" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Global rankings of all feudal lords, dukes, and sovereigns synchronized live with the Royal Cloud Archives.
          </p>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Querying Royal Archives...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {leaderboard.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: item.isPlayer ? 'rgba(255, 215, 0, 0.15)' : 'rgba(0,0,0,0.4)',
                    border: item.isPlayer ? '2px solid #ffd700' : '1px solid #4a2e12',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: item.rank === 1 ? '#ffd700' : item.rank === 2 ? '#c0c0c0' : item.rank === 3 ? '#cd7f32' : '#2b1b0e',
                      color: item.rank <= 3 ? '#000000' : '#ffffff',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-medieval)'
                    }}>
                      {item.rank}
                    </div>

                    <div>
                      <div className="font-medieval" style={{ fontSize: '1rem', color: item.isPlayer ? '#ffd700' : '#ffffff' }}>
                        {item.rulerName} {item.isPlayer && '👑 (YOU)'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.realmName} • {item.title}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="font-medieval text-gold" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                      {formatNumber(item.netWorth)} Gold
                    </div>
                    {item.crownJewels > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#9370db' }}>
                        💎 {item.crownJewels} Crown Jewels
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

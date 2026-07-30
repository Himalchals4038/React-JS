import React from 'react';
import { Github, Crown, Heart, Code2 } from 'lucide-react';

export default function FooterCredits() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #170b04 0%, #0a0502 100%)',
      borderTop: '2px solid #b8860b',
      padding: '24px 16px',
      marginTop: '40px',
      textAlign: 'center',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.85)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Crown Icon Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd700' }}>
          <Crown size={22} />
          <span className="font-royal text-gold" style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>
            Medieval Kingdom Colony Idle Tycoon Simulator
          </span>
          <Crown size={22} />
        </div>

        {/* Developer & GitHub Link */}
        <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span>Crafted with passion by</span>
          <a
            href="https://github.com/Himalchals4038"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#ffd700',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 215, 0, 0.12)',
              padding: '4px 12px',
              borderRadius: '20px',
              border: '1px solid #b8860b',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255, 215, 0, 0.25)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(255, 215, 0, 0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Github size={18} /> Himalchals4038 GitHub Repository
          </a>
        </div>

        {/* Copyright notice */}
        <div style={{ fontSize: '0.75rem', color: '#7a6b58', marginTop: '4px' }}>
          © 2026 Sovereign Realm Technologies • All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { Calculator, Coins, ArrowRightLeft, Wrench, History, Volume2, VolumeX } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  historyCount, 
  onToggleHistory, 
  soundEnabled, 
  setSoundEnabled 
}) {
  const tabs = [
    { id: 'scientific', label: 'Scientific', icon: Calculator },
    { id: 'currency', label: 'Currency', icon: Coins },
    { id: 'units', label: 'Unit Converter', icon: ArrowRightLeft },
    { id: 'extras', label: 'Tools', icon: Wrench },
  ];

  return (
    <nav className="navbar glass-panel">
      <div className="brand-title">
        <span style={{ fontSize: '1.4rem' }}>🧮</span>
        <span>Quantum<span style={{ color: '#fff', fontWeight: 300 }}>Calc</span></span>
      </div>

      <div className="nav-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="nav-actions">
        <button 
          className="icon-btn" 
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <button 
          className="icon-btn" 
          style={{ position: 'relative' }} 
          onClick={onToggleHistory}
          title="History Drawer"
        >
          <History size={18} />
          {historyCount > 0 && (
            <span className="badge-count">{historyCount > 99 ? '99+' : historyCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

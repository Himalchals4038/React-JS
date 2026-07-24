import React, { useState } from 'react';
import { X, Trash2, Search, ArrowUpRight, Copy } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRecallHistory,
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = history.filter(item => 
    item.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyResult = (e, res) => {
    e.stopPropagation();
    soundEngine.playClick('standard');
    navigator.clipboard.writeText(res);
    showToast('Copied result to clipboard!');
  };

  return (
    <div className="history-drawer-overlay" onClick={onClose}>
      <div className="history-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="history-header">
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
            Calculation Log
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {history.length > 0 && (
              <button 
                className="icon-btn" 
                onClick={onClearHistory} 
                title="Clear All History"
                style={{ color: '#f87171' }}
              >
                <Trash2 size={16} />
              </button>
            )}
            <button className="icon-btn" onClick={onClose} title="Close History">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search */}
        {history.length > 0 && (
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-dim)' }} />
            <input 
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.8rem 0.5rem 2.2rem',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
        )}

        {/* History List */}
        <div className="history-list">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '3rem', fontSize: '0.9rem' }}>
              {history.length === 0 ? 'No calculations performed yet' : 'No matching entries found'}
            </div>
          ) : (
            filtered.map((item) => (
              <div 
                key={item.id} 
                className="history-item"
                onClick={() => {
                  soundEngine.playClick('action');
                  onRecallHistory(item);
                  onClose();
                }}
                title="Click to load into calculator display"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="history-expr">{item.expression}</span>
                  <button 
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 2 }}
                    onClick={(e) => handleCopyResult(e, item.result)}
                    title="Copy result"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <div className="history-res">
                  = {item.result}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                  {item.timestamp}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

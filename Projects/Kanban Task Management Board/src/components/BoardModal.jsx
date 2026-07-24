import React, { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import { X, Plus, Download, Upload, RotateCcw, Layout } from 'lucide-react';

export const BoardModal = () => {
  const {
    isBoardModalOpen,
    setIsBoardModalOpen,
    boards,
    activeBoardId,
    setActiveBoardId,
    addBoard,
    exportBoardJSON,
    importBoardJSON,
    resetToDefaultData
  } = useKanban();

  const [newBoardName, setNewBoardName] = useState('');

  if (!isBoardModalOpen) return null;

  const handleCreate = e => {
    e.preventDefault();
    if (newBoardName.trim()) {
      addBoard(newBoardName.trim());
      setNewBoardName('');
    }
  };

  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target.result);
        importBoardJSON(json);
        alert('Board backup imported successfully!');
        setIsBoardModalOpen(false);
      } catch (err) {
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsBoardModalOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Layout size={20} color="var(--accent-primary)" />
            <h2 className="modal-title">Board Settings & Backup</h2>
          </div>
          <button className="btn-icon" onClick={() => setIsBoardModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Create New Board Form */}
        <form onSubmit={handleCreate} style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Create New Board</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Q3 Mobile App Launch"
              value={newBoardName}
              onChange={e => setNewBoardName(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              <Plus size={16} /> Create
            </button>
          </div>
        </form>

        {/* Boards List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Active Boards</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {boards.map(b => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  background: b.id === activeBoardId ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-glass)',
                  border: `1px solid ${b.id === activeBoardId ? 'var(--accent-primary)' : 'var(--bg-glass-border)'}`,
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.name}</span>
                {b.id === activeBoardId ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    ACTIVE
                  </span>
                ) : (
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                    onClick={() => setActiveBoardId(b.id)}
                  >
                    Switch
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Export / Import & Reset */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <label className="form-label">Backup & Recovery</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={exportBoardJSON}>
              <Download size={16} /> Export JSON
            </button>

            <label className="btn-secondary" style={{ cursor: 'pointer' }}>
              <Upload size={16} /> Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

            <button
              className="btn-secondary"
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              onClick={() => {
                if (confirm('Reset board to default API sample tasks?')) {
                  resetToDefaultData();
                  setIsBoardModalOpen(false);
                }
              }}
            >
              <RotateCcw size={16} /> Reset Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

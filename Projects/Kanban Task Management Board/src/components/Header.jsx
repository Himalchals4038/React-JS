import React from 'react';
import { useKanban } from '../context/KanbanContext';
import {
  Layout,
  Plus,
  Sun,
  Moon,
  BarChart2,
  RefreshCw,
  FolderPlus,
  Settings,
  CloudCheck,
  CloudSync
} from 'lucide-react';

export const Header = () => {
  const {
    theme,
    toggleTheme,
    boards,
    activeBoard,
    activeBoardId,
    setActiveBoardId,
    setIsCreateModalOpen,
    setIsAnalyticsOpen,
    setIsBoardModalOpen,
    syncStatus,
    refreshFromAPI
  } = useKanban();

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon">
          <Layout size={20} />
        </div>
        <h1 className="brand-title">KanbanFlow</h1>

        {/* Board Switcher Dropdown */}
        <select
          className="board-selector"
          value={activeBoardId}
          onChange={e => setActiveBoardId(e.target.value)}
        >
          {boards.map(b => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <button
          className="btn-icon"
          title="Board Management & Import/Export"
          onClick={() => setIsBoardModalOpen(true)}
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="header-actions">
        {/* API Sync Status Pill */}
        <button
          className={`sync-pill ${syncStatus === 'syncing' ? 'syncing' : ''}`}
          onClick={refreshFromAPI}
          title="Click to manually refresh data from REST API"
        >
          <span className="sync-dot"></span>
          <span>{syncStatus === 'syncing' ? 'API Syncing...' : 'Cloud Synced'}</span>
          <RefreshCw size={12} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
        </button>

        {/* Analytics Modal Button */}
        <button
          className="btn-icon"
          title="Analytics & Productivity Metrics"
          onClick={() => setIsAnalyticsOpen(true)}
        >
          <BarChart2 size={18} />
        </button>

        {/* Theme Switcher Button */}
        <button
          className="btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Create Task Primary CTA */}
        <button
          className="btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};

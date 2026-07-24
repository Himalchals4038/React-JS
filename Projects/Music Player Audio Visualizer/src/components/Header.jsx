import React from 'react';
import { Disc, Search, UploadCloud } from 'lucide-react';

export function Header({ searchQuery, setSearchQuery, onOpenImportModal }) {
  return (
    <header className="app-header">
      <div className="brand-logo">
        <Disc className="brand-icon" size={28} />
        <span>NCS Visualizer</span>
      </div>

      <div className="header-search">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search tracks, artists, or genres..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="header-actions">
        <button className="btn btn-glass" onClick={onOpenImportModal}>
          <UploadCloud size={16} />
          Import File
        </button>
      </div>
    </header>
  );
}

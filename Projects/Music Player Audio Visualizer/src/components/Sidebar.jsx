import React from 'react';
import { Music, Radio, UploadCloud, Heart, Sliders, Disc, Library, Globe, CheckCircle, Flame } from 'lucide-react';

export function Sidebar({ selectedTab, setSelectedTab, onOpenEqModal, onOpenImportModal, trackCounts }) {
  const navItems = [
    { id: 'all', label: 'All Tracks', icon: Music, count: trackCounts.all },
    { id: 'hindi', label: 'Hindi Collection', icon: Flame, count: trackCounts.hindi },
    { id: 'full', label: 'Full Songs Only', icon: CheckCircle, count: trackCounts.full },
    { id: 'jamendo', label: 'Jamendo Albums', icon: Library, count: trackCounts.jamendo },
    { id: 'audius', label: 'Audius Live', icon: Radio, count: trackCounts.audius },
    { id: 'itunes', label: 'iTunes Previews', icon: Globe, count: trackCounts.itunes },
    { id: 'local', label: 'My Uploads', icon: UploadCloud, count: trackCounts.local },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: trackCounts.favorites }
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="nav-section-title">Library</div>
        <ul className="nav-list">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                className={`nav-item ${selectedTab === item.id ? 'active' : ''}`}
                onClick={() => setSelectedTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.count > 0 && <span className="badge">{item.count}</span>}
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div className="nav-section-title">Tools</div>
        <ul className="nav-list">
          <li className="nav-item" onClick={onOpenEqModal}>
            <Sliders size={18} />
            <span>Equalizer & FX</span>
          </li>
          <li className="nav-item" onClick={onOpenImportModal}>
            <UploadCloud size={18} />
            <span>Import Local Audio</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}

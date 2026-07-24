import React, { useState } from 'react';
import { Play, Pause, Heart, Music, Disc, UploadCloud, Radio } from 'lucide-react';

function formatDuration(secs) {
  if (!secs) return '3:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function TrackList({
  tracks,
  currentTrack,
  isPlaying,
  favorites,
  onPlayTrack,
  onTogglePlay,
  onToggleFavorite,
  onOpenImportModal,
  selectedTab,
  setSelectedTab
}) {
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Electronic', 'House', 'Synthwave', 'Trap', 'Drum & Bass', 'Dubstep', 'Chill'];

  // Filter tracks by tab & genre
  const filteredTracks = tracks.filter(track => {
    // Tab filter
    if (selectedTab === 'ncs' && track.source !== 'ncs') return false;
    if (selectedTab === 'audius' && track.source !== 'audius') return false;
    if (selectedTab === 'local' && track.source !== 'local') return false;
    if (selectedTab === 'favorites' && !favorites.includes(track.id)) return false;

    // Genre filter
    if (selectedGenre !== 'All' && track.genre !== selectedGenre) return false;

    return true;
  });

  return (
    <div className="tracks-section">
      {/* Section Header & Tabs */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 className="section-title">
            <Music className="brand-icon" size={22} />
            Music Library
          </h2>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: 'All Tracks' },
              { id: 'ncs', label: 'NCS Portal' },
              { id: 'audius', label: 'Audius Trending' },
              { id: 'local', label: 'My Uploads' },
              { id: 'favorites', label: 'Favorites' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`pill ${selectedTab === tab.id ? 'active' : ''}`}
                onClick={() => setSelectedTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={onOpenImportModal}>
          <UploadCloud size={16} />
          Import Local Audio
        </button>
      </div>

      {/* Genre Pills */}
      <div className="genre-filter-pills">
        {genres.map(g => (
          <button
            key={g}
            className={`pill ${selectedGenre === g ? 'active' : ''}`}
            onClick={() => setSelectedGenre(g)}
            style={{ fontSize: '0.75rem', padding: '4px 12px' }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Tracks Grid */}
      {filteredTracks.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--glass-border)'
        }}>
          <Disc size={40} style={{ color: 'var(--text-dim)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>No tracks found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {selectedTab === 'local'
              ? 'Click "Import Local Audio" to load your own MP3 / audio files!'
              : selectedTab === 'favorites'
              ? 'Click the heart icon on any track to add it to your favorites.'
              : 'Try selecting a different genre or category tab.'}
          </p>
        </div>
      ) : (
        <div className="tracks-grid">
          {filteredTracks.map(track => {
            const isCurrent = currentTrack?.id === track.id;
            const isFav = favorites.includes(track.id);

            return (
              <div
                key={track.id}
                className={`track-card ${isCurrent ? 'active' : ''}`}
                onClick={() => {
                  if (isCurrent) {
                    onTogglePlay();
                  } else {
                    onPlayTrack(track);
                  }
                }}
              >
                <div className="card-thumb-wrapper">
                  <img
                    src={track.coverArt}
                    alt={track.title}
                    className="card-thumb"
                  />
                  <div className="card-play-overlay">
                    <div className="play-circle-btn">
                      {isCurrent && isPlaying ? (
                        <Pause size={24} fill="#000" />
                      ) : (
                        <Play size={24} fill="#000" style={{ marginLeft: '2px' }} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="card-info">
                  <span className="card-title" title={track.title}>
                    {track.title}
                  </span>
                  <span className="card-artist">{track.artist}</span>
                </div>

                <div className="card-footer">
                  <span className={`source-tag ${track.source}`}>
                    {track.source === 'ncs' ? 'NCS Portal' : track.source === 'audius' ? 'Audius' : 'Local'}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {formatDuration(track.duration)}
                    </span>
                    <button
                      className="ctrl-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(track);
                      }}
                      title={isFav ? 'Remove Favorite' : 'Add Favorite'}
                    >
                      <Heart size={16} fill={isFav ? 'var(--color-primary)' : 'none'} color={isFav ? 'var(--color-primary)' : 'var(--text-muted)'} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Play, Pause, Heart, Music, Disc, UploadCloud, Radio, Calendar, Sparkles, Globe, Clock, Flame } from 'lucide-react';

function formatDuration(secs) {
  if (!secs) return '3:45';
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
  const [selectedEra, setSelectedEra] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [fullSongOnly, setFullSongOnly] = useState(false);

  const regions = [
    { id: 'All', label: 'All Regions' },
    { id: 'Indian', label: '🇮🇳 Indian (Hindi/Tamil)' },
    { id: 'Spanish', label: '🇪🇸 Spanish / Latin' },
    { id: 'Japanese', label: '🇯🇵 Japanese / J-Pop' },
    { id: 'Chinese', label: '🇨🇳 Chinese / C-Pop' },
    { id: 'Global', label: '🌎 Global / Western' }
  ];

  const eras = [
    { id: 'All', label: 'All Eras' },
    { id: '90s', label: '📼 90s Classics' },
    { id: '2000s', label: '💿 2000s Hits' },
    { id: '2010s', label: '🎧 2010s Anthems' },
    { id: '2020s', label: '🚀 2020s Next-Gen' }
  ];

  const genres = [
    'All', 'Bollywood & Indian', 'Latin & Reggaeton', 'J-Pop & City Pop', 'C-Pop',
    'Electronic', 'House', 'Synthwave', 'Trap', 'Drum & Bass', 'Dubstep', 'Chill',
    'Hip-Hop', 'Rock', 'Jazz', 'Lofi', 'Pop', 'Phonk', 'Retro 90s'
  ];

  // Filter tracks by category tab, region, era, genre, & full song option
  const filteredTracks = tracks.filter(track => {
    // Full song filter
    if (fullSongOnly && !track.isFullSong) return false;

    // Tab filter
    if (selectedTab === 'hindi' && track.source !== 'hindi') return false;
    if (selectedTab === 'full' && !track.isFullSong) return false;
    if (selectedTab === 'jamendo' && track.source !== 'jamendo') return false;
    if (selectedTab === 'audius' && track.source !== 'audius') return false;
    if (selectedTab === 'itunes' && track.source !== 'itunes') return false;
    if (selectedTab === 'local' && track.source !== 'local') return false;
    if (selectedTab === 'favorites' && !favorites.includes(track.id)) return false;

    // Region filter
    if (selectedRegion !== 'All' && track.region !== selectedRegion) return false;

    // Era filter
    if (selectedEra !== 'All' && track.era !== selectedEra) return false;

    // Genre filter
    if (selectedGenre !== 'All' && track.genre.toLowerCase() !== selectedGenre.toLowerCase()) return false;

    return true;
  });

  return (
    <div className="tracks-section">
      {/* Section Header & Main Category Tabs */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <h2 className="section-title">
            <Music className="brand-icon" size={22} />
            Global Music Library ({filteredTracks.length} tracks)
          </h2>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Tracks' },
              { id: 'hindi', label: '🔥 Hindi Collection (158)' },
              { id: 'full', label: '🎵 Full Songs Only' },
              { id: 'jamendo', label: 'Jamendo Albums' },
              { id: 'audius', label: 'Audius Live' },
              { id: 'itunes', label: 'iTunes Previews' },
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

      {/* Length Filter Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
        <Clock size={16} color="var(--color-primary)" />
        <span style={{ fontSize: '0.82rem', fontWeight: '600' }}>Filter Duration:</span>
        <button
          className={`pill ${fullSongOnly ? 'active' : ''}`}
          onClick={() => setFullSongOnly(!fullSongOnly)}
          style={{ fontSize: '0.75rem', padding: '4px 12px' }}
        >
          {fullSongOnly ? 'Showing Full Songs Only (3-6 mins)' : 'Show All (Full Songs & iTunes Previews)'}
        </button>
      </div>

      {/* Region / Language Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Globe size={14} color="var(--color-primary)" /> Region / Language:
        </span>
        <div className="genre-filter-pills" style={{ paddingBottom: 0 }}>
          {regions.map(r => (
            <button
              key={r.id}
              className={`pill ${selectedRegion === r.id ? 'active' : ''}`}
              onClick={() => setSelectedRegion(r.id)}
              style={{ fontSize: '0.75rem', padding: '4px 12px' }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Eras / Decades Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={14} color="var(--color-primary)" /> Era:
        </span>
        <div className="genre-filter-pills" style={{ paddingBottom: 0 }}>
          {eras.map(e => (
            <button
              key={e.id}
              className={`pill ${selectedEra === e.id ? 'active' : ''}`}
              onClick={() => setSelectedEra(e.id)}
              style={{ fontSize: '0.75rem', padding: '4px 12px' }}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={14} color="var(--color-secondary)" /> Genre:
        </span>
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
              : 'Try unchecking "Full Songs Only" or selecting a different region/genre pill above.'}
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

                  {/* Length Badge */}
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    background: track.isFullSong ? 'rgba(0, 240, 255, 0.9)' : 'rgba(255, 170, 0, 0.9)',
                    color: '#000',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    letterSpacing: '0.5px'
                  }}>
                    {track.isFullSong ? 'FULL SONG' : '30S PREVIEW'}
                  </span>
                </div>

                <div className="card-info">
                  <span className="card-title" title={track.title}>
                    {track.title}
                  </span>
                  <span className="card-artist">{track.artist}</span>
                </div>

                <div className="card-footer">
                  <span className={`source-tag ${track.source}`}>
                    {track.source === 'hindi' ? 'Hindi Collection' : track.source === 'itunes' ? 'iTunes' : track.source === 'audius' ? 'Audius' : track.source === 'jamendo' ? 'Jamendo' : 'Local'}
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

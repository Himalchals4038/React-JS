import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAudioEngine } from './hooks/useAudioEngine';
import {
  INITIAL_NCS_TRACKS,
  fetchGlobaliTunesTracks,
  fetchAudiusTrending,
  fetchJamendoAlbums,
  searchGlobalTracks
} from './services/musicApi';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VisualizerCanvas } from './components/VisualizerCanvas';
import { TrackList } from './components/TrackList';
import { PlayerControls } from './components/PlayerControls';
import { LocalImportModal } from './components/LocalImportModal';
import { EqualizerPanel } from './components/EqualizerPanel';
import './styles/index.css';

export default function App() {
  const audioEngine = useAudioEngine();
  const { currentTrack, isPlaying, duration, playTrack, togglePlay } = audioEngine;

  // Track Repositories
  const [ncsTracks] = useState(INITIAL_NCS_TRACKS);
  const [itunesTracks, setItunesTracks] = useState([]);
  const [audiusTracks, setAudiusTracks] = useState([]);
  const [jamendoTracks, setJamendoTracks] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // App UI State
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEqModalOpen, setIsEqModalOpen] = useState(false);

  // Favorites in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('ncs_visualizer_favs');
      return saved ? JSON.parse(saved) : ['init-1', 'init-2'];
    } catch {
      return ['init-1', 'init-2'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ncs_visualizer_favs', JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  }, [favorites]);

  // Fetch Global Music APIs (iTunes, Audius, Jamendo) on initial mount
  useEffect(() => {
    // 1. Fetch iTunes Global Multi-Language catalog (hundreds of tracks)
    fetchGlobaliTunesTracks().then(tracks => {
      if (tracks && tracks.length > 0) {
        setItunesTracks(tracks);
      }
    });

    // 2. Fetch Audius Trending tracks
    fetchAudiusTrending().then(tracks => {
      if (tracks && tracks.length > 0) {
        setAudiusTracks(tracks);
      }
    });

    // 3. Fetch Jamendo Albums
    fetchJamendoAlbums().then(tracks => {
      if (tracks && tracks.length > 0) {
        setJamendoTracks(tracks);
      }
    });
  }, []);

  // Live Online Global Search when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchGlobalTracks(searchQuery).then(results => {
        setSearchResults(results);
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Combined Master Playlist
  const allTracks = useMemo(() => {
    // Deduplicate tracks by id
    const trackMap = new Map();
    [...searchResults, ...ncsTracks, ...localTracks, ...itunesTracks, ...audiusTracks, ...jamendoTracks].forEach(t => {
      if (!trackMap.has(t.id)) {
        trackMap.set(t.id, t);
      }
    });
    return Array.from(trackMap.values());
  }, [searchResults, ncsTracks, localTracks, itunesTracks, audiusTracks, jamendoTracks]);

  // Set default initial track if none loaded
  useEffect(() => {
    if (!currentTrack && allTracks.length > 0) {
      playTrack(allTracks[0]);
    }
  }, [allTracks, currentTrack, playTrack]);

  // Handle Track Completion Auto Next & Repeat
  useEffect(() => {
    if (audioEngine.currentTime >= duration && duration > 0) {
      if (repeatMode === 'one' && currentTrack) {
        playTrack(currentTrack);
      } else {
        handleNextTrack();
      }
    }
  }, [audioEngine.currentTime, duration, repeatMode]);

  // Next Track Logic
  const handleNextTrack = useCallback(() => {
    if (allTracks.length === 0) return;
    const currentIndex = allTracks.findIndex(t => t.id === currentTrack?.id);

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * allTracks.length);
      playTrack(allTracks[randomIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % allTracks.length;
      playTrack(allTracks[nextIndex]);
    }
  }, [allTracks, currentTrack, isShuffle, playTrack]);

  // Previous Track Logic
  const handlePrevTrack = useCallback(() => {
    if (allTracks.length === 0) return;
    const currentIndex = allTracks.findIndex(t => t.id === currentTrack?.id);

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * allTracks.length);
      playTrack(allTracks[randomIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + allTracks.length) % allTracks.length;
      playTrack(allTracks[prevIndex]);
    }
  }, [allTracks, currentTrack, isShuffle, playTrack]);

  // Toggle Favorite
  const handleToggleFavorite = useCallback((track) => {
    setFavorites(prev =>
      prev.includes(track.id) ? prev.filter(id => id !== track.id) : [...prev, track.id]
    );
  }, []);

  // Cycle Repeat Mode: off -> all -> one -> off
  const handleCycleRepeat = useCallback(() => {
    setRepeatMode(prev => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
  }, []);

  // Handle Imported Local Audio Files
  const handleImportLocalTracks = useCallback((newTracks) => {
    setLocalTracks(prev => [...newTracks, ...prev]);
    setSelectedTab('local');
    if (newTracks.length > 0) {
      playTrack(newTracks[0]);
    }
  }, [playTrack]);

  // Track Counts for Sidebar
  const trackCounts = useMemo(() => ({
    all: allTracks.length,
    hindi: allTracks.filter(t => t.source === 'hindi').length,
    full: allTracks.filter(t => t.isFullSong).length,
    itunes: itunesTracks.length,
    ncs: ncsTracks.length,
    audius: audiusTracks.length,
    jamendo: jamendoTracks.length,
    local: localTracks.length,
    favorites: favorites.length
  }), [allTracks, itunesTracks, ncsTracks, audiusTracks, jamendoTracks, localTracks, favorites]);

  return (
    <div className="app-container">
      {/* Top Header Navbar */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenImportModal={() => setIsImportModalOpen(true)}
      />

      {/* Main Content Layout */}
      <div className="main-body">
        {/* Navigation Sidebar */}
        <Sidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          onOpenEqModal={() => setIsEqModalOpen(true)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          trackCounts={trackCounts}
        />

        {/* Content Area */}
        <main className="content-area">
          {/* Audio Visualizer Stage */}
          <VisualizerCanvas audioEngine={audioEngine} />

          {/* Music Tracks Catalog & Filters */}
          <TrackList
            tracks={allTracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            favorites={favorites}
            onPlayTrack={playTrack}
            onTogglePlay={togglePlay}
            onToggleFavorite={handleToggleFavorite}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </main>
      </div>

      {/* Fixed Bottom Music Player Controls */}
      <PlayerControls
        audioEngine={audioEngine}
        onPrevTrack={handlePrevTrack}
        onNextTrack={handleNextTrack}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        repeatMode={repeatMode}
        onCycleRepeat={handleCycleRepeat}
        isFavorite={currentTrack ? favorites.includes(currentTrack.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onOpenEqModal={() => setIsEqModalOpen(true)}
      />

      {/* Modals */}
      <LocalImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportTracks={handleImportLocalTracks}
      />

      <EqualizerPanel
        isOpen={isEqModalOpen}
        onClose={() => setIsEqModalOpen(false)}
        audioEngine={audioEngine}
      />
    </div>
  );
}

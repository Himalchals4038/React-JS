import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAudioEngine } from './hooks/useAudioEngine';
import { INITIAL_NCS_TRACKS, fetchAudiusTrending } from './services/musicApi';
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
  const [audiusTracks, setAudiusTracks] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

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
      return saved ? JSON.parse(saved) : ['ncs-1', 'ncs-2'];
    } catch {
      return ['ncs-1', 'ncs-2'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ncs_visualizer_favs', JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  }, [favorites]);

  // Fetch Audius open music catalog on initial mount
  useEffect(() => {
    fetchAudiusTrending().then(tracks => {
      if (tracks && tracks.length > 0) {
        setAudiusTracks(tracks);
      }
    });
  }, []);

  // Combined Master Playlist
  const allTracks = useMemo(() => {
    return [...ncsTracks, ...localTracks, ...audiusTracks];
  }, [ncsTracks, localTracks, audiusTracks]);

  // Set default initial track if none loaded
  useEffect(() => {
    if (!currentTrack && allTracks.length > 0) {
      playTrack(allTracks[0]);
    }
  }, [allTracks, currentTrack, playTrack]);

  // Filtered tracks for current search & active view
  const searchFilteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return allTracks;
    const q = searchQuery.toLowerCase();
    return allTracks.filter(
      t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.genre.toLowerCase().includes(q)
    );
  }, [allTracks, searchQuery]);

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
    ncs: ncsTracks.length,
    audius: audiusTracks.length,
    local: localTracks.length,
    favorites: favorites.length
  }), [allTracks, ncsTracks, audiusTracks, localTracks, favorites]);

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
            tracks={searchFilteredTracks}
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

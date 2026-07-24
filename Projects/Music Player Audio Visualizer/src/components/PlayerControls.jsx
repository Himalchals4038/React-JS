import React from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle,
  Volume2, VolumeX, Sliders, Heart, Gauge
} from 'lucide-react';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function PlayerControls({
  audioEngine,
  onPrevTrack,
  onNextTrack,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onCycleRepeat,
  isFavorite,
  onToggleFavorite,
  onOpenEqModal
}) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    togglePlay,
    seekTo,
    changeVolume,
    toggleMute,
    changePlaybackRate
  } = audioEngine;

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    seekTo(time);
  };

  const handleVolume = (e) => {
    changeVolume(parseFloat(e.target.value));
  };

  return (
    <div className="player-bar">
      {/* Track Info (Left) */}
      <div className="player-left">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.coverArt}
              alt={currentTrack.title}
              className="player-thumb"
            />
            <div className="track-meta">
              <span className="track-meta-title" title={currentTrack.title}>
                {currentTrack.title}
              </span>
              <span className="track-meta-artist">{currentTrack.artist}</span>
            </div>
            <button
              className={`ctrl-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(currentTrack)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              style={{ marginLeft: '4px' }}
            >
              <Heart size={18} fill={isFavorite ? 'var(--color-primary)' : 'none'} />
            </button>
          </>
        ) : (
          <div className="track-meta">
            <span className="track-meta-title">Select a track</span>
            <span className="track-meta-artist">No audio loaded</span>
          </div>
        )}
      </div>

      {/* Main Playback Controls & Progress Bar (Center) */}
      <div className="player-center">
        <div className="control-buttons">
          <button
            className={`ctrl-btn ${isShuffle ? 'active' : ''}`}
            onClick={onToggleShuffle}
            title="Shuffle"
          >
            <Shuffle size={18} />
          </button>

          <button className="ctrl-btn" onClick={onPrevTrack} title="Previous">
            <SkipBack size={20} />
          </button>

          <button className="play-main-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={22} fill="#000" /> : <Play size={22} fill="#000" style={{ marginLeft: '2px' }} />}
          </button>

          <button className="ctrl-btn" onClick={onNextTrack} title="Next">
            <SkipForward size={20} />
          </button>

          <button
            className={`ctrl-btn ${repeatMode !== 'off' ? 'active' : ''}`}
            onClick={onCycleRepeat}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
          </button>
        </div>

        <div className="progress-container">
          <span className="time-stamp">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="slider"
          />
          <span className="time-stamp right">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Extra Tools (Right) */}
      <div className="player-right">
        {/* Speed Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Gauge size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            value={playbackRate}
            onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="0.5" style={{ background: '#090c15' }}>0.5x</option>
            <option value="0.75" style={{ background: '#090c15' }}>0.75x</option>
            <option value="1" style={{ background: '#090c15' }}>1.0x</option>
            <option value="1.25" style={{ background: '#090c15' }}>1.25x</option>
            <option value="1.5" style={{ background: '#090c15' }}>1.5x</option>
            <option value="2" style={{ background: '#090c15' }}>2.0x</option>
          </select>
        </div>

        {/* Equalizer Modal Trigger */}
        <button
          className="ctrl-btn"
          onClick={onOpenEqModal}
          title="Audio Equalizer & FX"
        >
          <Sliders size={20} />
        </button>

        {/* Volume Controls */}
        <div className="volume-box">
          <button className="ctrl-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolume}
            className="slider"
          />
        </div>
      </div>
    </div>
  );
}

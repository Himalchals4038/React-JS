import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Sparkles, Sliders, Palette } from 'lucide-react';

const COLOR_PALETTES = {
  cyan: { primary: '#00f0ff', secondary: '#7000ff', accent: '#ff007f' },
  magenta: { primary: '#ff007f', secondary: '#7000ff', accent: '#00f0ff' },
  emerald: { primary: '#00ffaa', secondary: '#0088ff', accent: '#ffff00' },
  violet: { primary: '#a855f7', secondary: '#ec4899', accent: '#3b82f6' },
  solar: { primary: '#ffaa00', secondary: '#ff0055', accent: '#ffff00' }
};

export function VisualizerCanvas({ audioEngine }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  const [mode, setMode] = useState('bars'); // 'bars', 'radial', 'waveform', 'particles', 'pulse', 'stereo'
  const [theme, setTheme] = useState('cyan');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sensitivity, setSensitivity] = useState(1.2);
  const [showSettings, setShowSettings] = useState(false);

  const { isPlaying, currentTrack, getFrequencyData, getWaveformData } = audioEngine;

  // Initialize Canvas dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        const dpr = window.devicePixelRatio || 1;
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width * dpr;
        canvasRef.current.height = rect.height * dpr;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  // Particle Swarm Generator for Particles mode
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * 1000,
        y: Math.random() * 500,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        alpha: Math.random() * 0.7 + 0.3
      });
    }
    particlesRef.current = particles;
  }, []);

  // Main Render Loop (60fps animation)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const bufferLength = 256;
    const freqData = new Uint8Array(bufferLength);
    const waveData = new Uint8Array(bufferLength);

    let shockwaveRadius = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const palette = COLOR_PALETTES[theme];

      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        getFrequencyData(freqData);
        getWaveformData(waveData);
      } else {
        // Idle ambient state
        freqData.fill(0);
        waveData.fill(128);
      }

      // Calculate bass average (low frequencies bin 0..15)
      let bassSum = 0;
      for (let i = 0; i < 15; i++) {
        bassSum += freqData[i];
      }
      const bassAvg = (bassSum / 15) * sensitivity;

      // Render selected visualization mode
      if (mode === 'bars') {
        renderBars(ctx, width, height, freqData, palette, sensitivity);
      } else if (mode === 'radial') {
        renderRadial(ctx, width, height, freqData, palette, bassAvg, currentTrack);
      } else if (mode === 'waveform') {
        renderWaveform(ctx, width, height, waveData, palette);
      } else if (mode === 'particles') {
        renderParticles(ctx, width, height, freqData, palette, bassAvg, particlesRef.current);
      } else if (mode === 'pulse') {
        shockwaveRadius = renderPulse(ctx, width, height, bassAvg, palette, shockwaveRadius);
      } else if (mode === 'stereo') {
        renderStereo(ctx, width, height, freqData, palette, sensitivity);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mode, theme, sensitivity, isPlaying, currentTrack, getFrequencyData, getWaveformData]);

  // Mode 1: Neon Bar Spectrum
  const renderBars = (ctx, width, height, freqData, palette, sens) => {
    const barCount = 64;
    const barWidth = (width / barCount) * 0.7;
    const gap = (width / barCount) * 0.3;

    for (let i = 0; i < barCount; i++) {
      const value = (freqData[i * 2] / 255) * height * 0.8 * sens;
      const x = i * (barWidth + gap) + gap / 2;
      const y = height - value;

      const gradient = ctx.createLinearGradient(0, height, 0, y);
      gradient.addColorStop(0, palette.secondary);
      gradient.addColorStop(0.6, palette.primary);
      gradient.addColorStop(1, palette.accent);

      ctx.fillStyle = gradient;
      ctx.shadowBlur = 12;
      ctx.shadowColor = palette.primary;
      ctx.fillRect(x, y, barWidth, value);

      // Floating top peak cap
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, Math.max(0, y - 6), barWidth, 3);
    }
  };

  // Mode 2: Circular Pulse Spectrum
  const renderRadial = (ctx, width, height, freqData, palette, bassAvg, track) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.2 + (bassAvg * 0.25);
    const barsCount = 80;

    // Draw center core glowing circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 22, 38, 0.9)';
    ctx.shadowBlur = 30;
    ctx.shadowColor = palette.primary;
    ctx.fill();
    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Radial spectrum bars
    for (let i = 0; i < barsCount; i++) {
      const angle = (i / barsCount) * Math.PI * 2;
      const val = (freqData[i % 128] / 255) * (baseRadius * 0.9);
      
      const x1 = centerX + Math.cos(angle) * baseRadius;
      const y1 = centerY + Math.sin(angle) * baseRadius;
      const x2 = centerX + Math.cos(angle) * (baseRadius + val);
      const y2 = centerY + Math.sin(angle) * (baseRadius + val);

      ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.accent;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 8;
      ctx.shadowColor = palette.primary;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  // Mode 3: Waveform Oscilloscope
  const renderWaveform = (ctx, width, height, waveData, palette) => {
    ctx.lineWidth = 4;
    ctx.strokeStyle = palette.primary;
    ctx.shadowBlur = 15;
    ctx.shadowColor = palette.primary;

    ctx.beginPath();
    const sliceWidth = width / waveData.length;
    let x = 0;

    for (let i = 0; i < waveData.length; i++) {
      const v = waveData[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  // Mode 4: Cyberpunk Particles Swarm
  const renderParticles = (ctx, width, height, freqData, palette, bassAvg, particles) => {
    const speedMultiplier = 1 + (bassAvg / 60);

    particles.forEach((p, idx) => {
      p.x += p.vx * speedMultiplier;
      p.y += p.vy * speedMultiplier;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const size = p.radius + (freqData[idx % 64] / 255) * 6;

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = idx % 2 === 0 ? palette.primary : palette.accent;
      ctx.shadowBlur = 10;
      ctx.shadowColor = palette.primary;
      ctx.fill();
    });
  };

  // Mode 5: Energy Pulse Rings
  const renderPulse = (ctx, width, height, bassAvg, palette, currentRadius) => {
    const centerX = width / 2;
    const centerY = height / 2;
    let newRadius = currentRadius + 4 + (bassAvg * 0.1);

    if (newRadius > Math.max(width, height) / 1.5) {
      newRadius = 20;
    }

    for (let i = 1; i <= 4; i++) {
      const r = Math.max(10, newRadius - i * 40);
      const alpha = Math.max(0, 1 - r / (width / 2));

      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 6 - i;
      ctx.shadowBlur = 20;
      ctx.shadowColor = palette.primary;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    return newRadius;
  };

  // Mode 6: Stereo Mirror Spectrum
  const renderStereo = (ctx, width, height, freqData, palette, sens) => {
    const centerY = height / 2;
    const barCount = 48;
    const barWidth = (width / barCount) * 0.6;
    const gap = (width / barCount) * 0.4;

    for (let i = 0; i < barCount; i++) {
      const val = (freqData[i * 2] / 255) * (height / 2.2) * sens;
      const x = i * (barWidth + gap) + gap / 2;

      ctx.fillStyle = palette.primary;
      ctx.shadowBlur = 10;
      ctx.shadowColor = palette.primary;

      // Top mirrored bar
      ctx.fillRect(x, centerY - val, barWidth, val);

      // Bottom mirrored bar
      ctx.fillStyle = palette.secondary;
      ctx.fillRect(x, centerY, barWidth, val);
    }
  };

  // Toggle Fullscreen Container
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        setIsFullscreen(!isFullscreen);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`visualizer-card ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {/* Top Visualizer Overlay Controls */}
      <div className="visualizer-overlay">
        <div className="visualizer-modes">
          {[
            { id: 'bars', name: 'Spectrum' },
            { id: 'radial', name: 'Radial' },
            { id: 'waveform', name: 'Wave' },
            { id: 'particles', name: 'Matrix' },
            { id: 'pulse', name: 'Pulse' },
            { id: 'stereo', name: 'Stereo' }
          ].map(m => (
            <button
              key={m.id}
              className={`mode-btn ${mode === m.id ? 'active' : ''}`}
              onClick={() => setMode(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div className="visualizer-settings">
          {Object.keys(COLOR_PALETTES).map(c => (
            <span
              key={c}
              className={`color-dot ${theme === c ? 'active' : ''}`}
              style={{ backgroundColor: COLOR_PALETTES[c].primary }}
              onClick={() => setTheme(c)}
              title={`${c} theme`}
            />
          ))}

          <button
            className="ctrl-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Visualizer Settings"
          >
            <Sliders size={18} />
          </button>

          <button
            className="ctrl-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Settings Popup Drawer */}
      {showSettings && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '16px',
          background: 'rgba(9, 12, 21, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '220px'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
            Sensitivity ({sensitivity.toFixed(1)}x)
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
            className="slider"
          />
        </div>
      )}

      {/* HTML5 Canvas */}
      <canvas ref={canvasRef} className="visualizer-canvas" />

      {/* Floating Active Track Banner */}
      {currentTrack && (
        <div className="now-playing-banner">
          <img
            src={currentTrack.coverArt}
            alt={currentTrack.title}
            className={`vinyl-artwork ${isPlaying ? 'spinning' : ''}`}
          />
          <div className="track-meta">
            <span className="track-meta-title">{currentTrack.title}</span>
            <span className="track-meta-artist">{currentTrack.artist}</span>
          </div>
        </div>
      )}
    </div>
  );
}

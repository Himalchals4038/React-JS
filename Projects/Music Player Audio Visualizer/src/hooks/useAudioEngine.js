import { useState, useEffect, useRef, useCallback } from 'react';

const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export const EQ_PRESETS = {
  Flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'Bass Boost': [8, 6, 5, 2, 0, 0, 0, 0, 1, 2],
  EDM: [6, 5, 2, 0, -2, 2, 4, 5, 5, 4],
  Rock: [5, 4, 2, 0, -1, 1, 3, 4, 5, 5],
  Pop: [-1, 1, 3, 4, 4, 3, 1, 0, 1, 2],
  Vocal: [-3, -2, 0, 3, 5, 5, 4, 2, 0, -2],
  Jazz: [3, 2, 1, 2, -1, -1, 0, 1, 2, 3]
};

export function useAudioEngine() {
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserNodeRef = useRef(null);
  const bassFilterRef = useRef(null);
  const eqFiltersRef = useRef([]);
  const gainNodeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [eqGains, setEqGains] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [bassBoost, setBassBoost] = useState(0);
  const [currentPreset, setCurrentPreset] = useState('Flat');

  // Lazy setup of Web Audio API node chain
  const initWebAudio = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Source node from audio element
      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;

      // Analyser Node for visualizer spectrum
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      analyserNodeRef.current = analyser;

      // Bass Boost filter (low shelf)
      const bassFilter = ctx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 100;
      bassFilter.gain.value = 0;
      bassFilterRef.current = bassFilter;

      // Create 10-band Equalizer filters
      const eqFilters = EQ_FREQUENCIES.map((freq, i) => {
        const filter = ctx.createBiquadFilter();
        if (i === 0) {
          filter.type = 'lowshelf';
        } else if (i === EQ_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = eqGains[i];
        return filter;
      });
      eqFiltersRef.current = eqFilters;

      // Master Gain Node
      const gainNode = ctx.createGain();
      gainNode.gain.value = isMuted ? 0 : volume;
      gainNodeRef.current = gainNode;

      // Connect node chain: source -> bassFilter -> eq[0] -> ... -> eq[9] -> analyser -> gain -> destination
      let currentNode = source;
      currentNode.connect(bassFilter);
      currentNode = bassFilter;

      eqFilters.forEach(filter => {
        currentNode.connect(filter);
        currentNode = filter;
      });

      currentNode.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(ctx.destination);
    } catch (err) {
      console.error('Web Audio API initialization failed:', err);
    }
  }, [eqGains, isMuted, volume]);

  // Audio Element Event Listeners
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Play a specified track object
  const playTrack = useCallback((track) => {
    if (!audioRef.current) return;
    initWebAudio();

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (currentTrack?.id !== track.id) {
      setCurrentTrack(track);
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
    }

    audioRef.current.play().catch(err => console.warn('Playback interrupted:', err));
  }, [currentTrack, initWebAudio]);

  // Toggle Play/Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    initWebAudio();

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.warn('Play error:', err));
    }
  }, [currentTrack, initWebAudio, isPlaying]);

  // Seek time
  const seekTo = useCallback((time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Adjust volume
  const changeVolume = useCallback((newVol) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVol;
    }
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = nextMute ? 0 : volume;
    }
  }, [isMuted, volume]);

  // Change Playback Speed
  const changePlaybackRate = useCallback((rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  // Change individual EQ band gain (-12dB to +12dB)
  const setEqBandGain = useCallback((index, gainVal) => {
    const updated = [...eqGains];
    updated[index] = gainVal;
    setEqGains(updated);
    setCurrentPreset('Custom');

    if (eqFiltersRef.current[index]) {
      eqFiltersRef.current[index].gain.value = gainVal;
    }
  }, [eqGains]);

  // Apply EQ Preset
  const applyPreset = useCallback((presetName) => {
    const presetValues = EQ_PRESETS[presetName];
    if (!presetValues) return;
    setEqGains([...presetValues]);
    setCurrentPreset(presetName);

    presetValues.forEach((val, i) => {
      if (eqFiltersRef.current[i]) {
        eqFiltersRef.current[i].gain.value = val;
      }
    });
  }, []);

  // Bass Boost control (0 to 12dB)
  const setBassBoostLevel = useCallback((level) => {
    setBassBoost(level);
    if (bassFilterRef.current) {
      bassFilterRef.current.gain.value = (level / 100) * 12;
    }
  }, []);

  // Helper to fetch frequency data array for Canvas visualizer
  const getFrequencyData = useCallback((dataArray) => {
    if (analyserNodeRef.current) {
      analyserNodeRef.current.getByteFrequencyData(dataArray);
    }
  }, []);

  // Helper to fetch time domain data (waveform)
  const getWaveformData = useCallback((dataArray) => {
    if (analyserNodeRef.current) {
      analyserNodeRef.current.getByteTimeDomainData(dataArray);
    }
  }, []);

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    eqGains,
    bassBoost,
    currentPreset,
    playTrack,
    togglePlay,
    seekTo,
    changeVolume,
    toggleMute,
    changePlaybackRate,
    setEqBandGain,
    applyPreset,
    setBassBoostLevel,
    getFrequencyData,
    getWaveformData
  };
}

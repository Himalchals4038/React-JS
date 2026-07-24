// Curated NoCopyrightSounds (NCS) & Copyright-Free Audio Catalog
export const INITIAL_NCS_TRACKS = [
  {
    id: 'ncs-1',
    title: 'Blank (NCS Release)',
    artist: 'Disfigure',
    genre: 'Electronic',
    coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=electronic-future-beats-117997.mp3',
    duration: 210,
    source: 'ncs',
    featured: true
  },
  {
    id: 'ncs-2',
    title: 'Fade (NCS Release)',
    artist: 'Alan Walker',
    genre: 'Synthwave',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cyberpunk-synthwave-20516.mp3',
    duration: 260,
    source: 'ncs',
    featured: true
  },
  {
    id: 'ncs-3',
    title: 'Hope (NCS Release)',
    artist: 'Tobu',
    genre: 'House',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=summer-tropical-house-10008.mp3',
    duration: 285,
    source: 'ncs',
    featured: true
  },
  {
    id: 'ncs-4',
    title: 'Shine (NCS Release)',
    artist: 'Spektrem',
    genre: 'Electronic',
    coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939b4b005.mp3?filename=energetic-edm-synth-123490.mp3',
    duration: 252,
    source: 'ncs',
    featured: true
  },
  {
    id: 'ncs-5',
    title: 'Superhero (feat. Chris Linton)',
    artist: 'Unknown Brain',
    genre: 'Trap',
    coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_a4d07d1d2b.mp3?filename=trap-future-bass-8765.mp3',
    duration: 182,
    source: 'ncs',
    featured: true
  },
  {
    id: 'ncs-6',
    title: 'On & On (feat. Daniel Levi)',
    artist: 'Cartoon',
    genre: 'Drum & Bass',
    coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c36399c566.mp3?filename=fast-drum-and-bass-energy-126233.mp3',
    duration: 208,
    source: 'ncs',
    featured: false
  },
  {
    id: 'ncs-7',
    title: 'Energy (NCS Release)',
    artist: 'Elektronomia',
    genre: 'Dubstep',
    coverArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_472b4c102a.mp3?filename=heavy-dubstep-drop-10852.mp3',
    duration: 198,
    source: 'ncs',
    featured: false
  },
  {
    id: 'ncs-8',
    title: 'Feel Good (NCS Release)',
    artist: 'Syn Cole',
    genre: 'Chill',
    coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6522c069.mp3?filename=chill-lofi-vibes-115324.mp3',
    duration: 220,
    source: 'ncs',
    featured: false
  }
];

// Audius Open API Base Endpoint
const AUDIUS_APP_NAME = 'NCS_Visualizer_App';

export async function fetchAudiusTrending() {
  try {
    const res = await fetch(`https://api.audius.co/v1/tracks/trending?app_name=${AUDIUS_APP_NAME}&limit=12`);
    if (!res.ok) throw new Error('Audius API request failed');
    const json = await res.json();
    
    return json.data.map(track => ({
      id: `audius-${track.id}`,
      title: track.title || 'Untitled Track',
      artist: track.user ? track.user.name : 'Unknown Artist',
      genre: track.genre || 'Electronic',
      coverArt: track.artwork ? track.artwork['480x480'] || track.artwork['150x150'] : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      audioUrl: `https://api.audius.co/v1/tracks/${track.id}/stream?app_name=${AUDIUS_APP_NAME}`,
      duration: track.duration || 180,
      source: 'audius',
      featured: false
    }));
  } catch (err) {
    console.warn('Could not fetch from Audius API, falling back to curated NCS catalog:', err);
    return [];
  }
}

export async function searchAudiusTracks(query) {
  if (!query || query.trim() === '') return [];
  try {
    const res = await fetch(`https://api.audius.co/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=${AUDIUS_APP_NAME}&limit=10`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data.map(track => ({
      id: `audius-${track.id}`,
      title: track.title || 'Untitled Track',
      artist: track.user ? track.user.name : 'Unknown Artist',
      genre: track.genre || 'Electronic',
      coverArt: track.artwork ? track.artwork['480x480'] : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      audioUrl: `https://api.audius.co/v1/tracks/${track.id}/stream?app_name=${AUDIUS_APP_NAME}`,
      duration: track.duration || 180,
      source: 'audius',
      featured: false
    }));
  } catch (err) {
    console.error('Audius search error:', err);
    return [];
  }
}

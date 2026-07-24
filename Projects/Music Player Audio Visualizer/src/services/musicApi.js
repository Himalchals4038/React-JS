// Global Multi-Source Music API Service
// Full Songs: Hindi Local Assets (158 songs), Audius, Jamendo, NCS Portal, Local Imports

const AUDIUS_APP_NAME = 'NCS_Visualizer_App';
const JAMENDO_CLIENT_ID = '56d30c4f';

const HINDI_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80'
];

export const HINDI_FILENAMES = [
  "Aaj Ki Raat  Stree 2  Tamannaah Bhatia  Sachin-Jigar  Madhubanti  Divya  Amitabh  15th August.mp3",
  "Abhi Mujh Mein Kahin (Lyrics) - Ajay-Atul, Sonu Nigam.mp3",
  "Ae Dil Hai Mushkil Title Track (From Ae Dil Hai Mushkil).mp3",
  "Ae Watan (Male).mp3",
  "Alag Aasmaan.mp3",
  "Apna Bana Le (From Bhediya).mp3",
  "Baarish.mp3",
  "Baarishein.mp3",
  "Baarishon Mein.mp3",
  "Baawra.mp3",
  "Bana Sharabi (From Govinda Naam Mera).mp3",
  "Bandey.mp3",
  "Banjaara.mp3",
  "Be Intehaan.mp3",
  "Beete Lamhein.mp3",
  "Behti Hawa Sa Tha Woh.mp3",
  "Besharam Rang  Pathaan.mp3",
  "Bheegi Si Bhaagi Si - Raajneeti.mp3",
  "Bolo Na (From 12th Fail).mp3",
  "Buddhu Sa Mann.mp3",
  "Bulleya.mp3",
  "CHAAR KADAM.mp3",
  "Chaahat.mp3",
  "Chale Aana (From De De Pyaar De).mp3",
  "Channa Mereya (From Ae Dil Hai Mushkil).mp3",
  "Chogada (From Loveyatri).mp3",
  "Choo Lo.mp3",
  "Chot Dil Pe Lagi (From Ishq Vishk Rebound).mp3",
  "DARKHAAST.mp3",
  "Dagabaaz Re.mp3",
  "Deewani.mp3",
  "Dekhha Tenu (From Mr. And Mrs. Mahi).mp3",
  "Dekhte Dekhte (From Batti Gul Meter Chalu).mp3",
  "Desh Mere.mp3",
  "Deva Deva (From Brahmastra).mp3",
  "Dil Ibaadat.mp3",
  "Dil Mein Ho Tum (From Cheat India).mp3",
  "Dil Royi Jaye (From De De Pyaar De).mp3",
  "Dooriyan.mp3",
  "Duur Na Karin.mp3",
  "Ek Ladki Ko Dekha Toh Aisa Laga - Title Track.mp3",
  "Ek Tarfa - Reprise.mp3",
  "Enna Sona.mp3",
  "Finding Her.mp3",
  "Fursat Hai Aaj Bhi.mp3",
  "Gazab (From Dil Juunglee).mp3",
  "Halka Halka (From Fanney Khan).mp3",
  "Hamari Adhuri Kahani (Title Track) (From Hamari Adhuri Kahani).mp3",
  "Hasi (Female Version).mp3",
  "Hum Toh Deewane.mp3",
  "Humdard.mp3",
  "Humnava (From Hamari Adhuri Kahani).mp3",
  "Humnava Mere.mp3",
  "Husn.mp3",
  "IJAZAT.mp3",
  "Ik Vaari Aa (From Raabta).mp3",
  "Ishq (From Lost Found).mp3",
  "JAB TAK.mp3",
  "Jaadui.mp3",
  "Jaan Ban Gaye.mp3",
  "Jaan Hai Meri.mp3",
  "Janam Janam.mp3",
  "Jeene Bhi De.mp3",
  "Jo Tere Sang.mp3",
  "Jo Tum Mere Ho.mp3",
  "KABHI JO BAADAL BARSE.mp3",
  "KAUN TUJHE.mp3",
  "KUCH TO HAI.mp3",
  "Kabhii Tumhhe (Female Version).mp3",
  "Kalank (Duet).mp3",
  "Khabar.mp3",
  "Khairiyat.mp3",
  "Khamoshiyan.mp3",
  "Kho Gaye Hum Kahan.mp3",
  "Khuda Jaane.mp3",
  "Lamhe Guzar Gaye.mp3",
  "MAIN RAHOON YA NA RAHOON.mp3",
  "MAST MAGAN.mp3",
  "Maan Meri Jaan.mp3",
  "Mahiye Jinna Sohna.mp3",
  "Main Hoon Hero Tera (Armaan Malik Version).mp3",
  "Main Hoon Saath Tere.mp3",
  "Main Rang Sharbaton Ka.mp3",
  "Maiyya Mainu.mp3",
  "Makhna.mp3",
  "Manja.mp3",
  "Meherbani.mp3",
  "Milne Hai Mujhse Aayi.mp3",
  "Morni.mp3",
  "Naina Da Kya Kasoor.mp3",
  "Namo Namo.mp3",
  "Naseeb Se.mp3",
  "Nashe Si Chadh Gayi.mp3",
  "Nazm Nazm.mp3",
  "O Maahi.mp3",
  "O Meri Jaan (KK - Vocals Only).mp3",
  "O'Meri Laila.mp3",
  "Oonchi Oonchi Deewarein.mp3",
  "PHIR KABHI-REPRISE.mp3",
  "Pal (Female).mp3",
  "Paniyon Sa (From Satyameva Jayate).mp3",
  "Pehla Nasha 2.0.mp3",
  "Pehla Pyaar.mp3",
  "Piya Aaye Na Aashiqui 2 Full Song with Lyrics  Aditya Roy Kapur, Shraddha Kapoor.mp3",
  "Pyaar Hota Kayi Baar Hai.mp3",
  "Raabta.mp3",
  "Raanjhanaa.mp3",
  "Rabba Janda (From Mission Majnu).mp3",
  "Rehna Tere Paas.mp3",
  "Roke Na Ruke Naina (From Badrinath Ki Dulhania).mp3",
  "SAB TERA.mp3",
  "SANAM RE.mp3",
  "SAUDE BAZI.mp3",
  "SAWARE.mp3",
  "SUBHANALLAH.mp3",
  "Sahiba.mp3",
  "Saibo.mp3",
  "Sajna Ve Sajna.mp3",
  "Sang Rahiyo.mp3",
  "Sapna Jahan (From Brothers).mp3",
  "Sooraj Dooba Hai.mp3",
  "Subha Hone Na De.mp3",
  "TU HAI KI NAHI.mp3",
  "Tainu Khabar Nahi (From Munjya).mp3",
  "Tera Ghata.mp3",
  "Tera Hoke Rahoon.mp3",
  "Tera Hone Laga Hoon.mp3",
  "Tera Hua (From Loveyatri).mp3",
  "Tera Rastaa Chhodoon Na.mp3",
  "Tere Bin Nahi Laage (Male Version).mp3",
  "Tere Bina.mp3",
  "Tere Sang Yaara.mp3",
  "Teri Jhuki Nazar (Film Version).mp3",
  "Teri Meri Kahaani.mp3",
  "Teri Mitti - Female Version (Kesari).mp3",
  "Thodi Der.mp3",
  "Toota Jo Kabhi Tara.mp3",
  "Tu Hai.mp3",
  "Tu Hain Toh Main Hoon (From Sky Force).mp3",
  "Tu Hi Hai Aashiqui.mp3",
  "Tu Hi Hai.mp3",
  "Tu Hi Haqeeqat.mp3",
  "Tu Jaane Na.mp3",
  "Tu Meri.mp3",
  "Tujh Mein Rab Dikhta Hai.mp3",
  "Tum Hi Ho.mp3",
  "Tum Mile (Love Reprise).mp3",
  "Tumhare Hi Rahenge Hum (From Stree 2).mp3",
  "Tune Jo Na Kaha.mp3",
  "Uska Hi Banana.mp3",
  "Ve Maahi.mp3",
  "Woh Lamhe Woh Baatein (From Zeher).mp3",
  "Yeh Dooriyan.mp3",
  "Yeh Fitoor Mera.mp3",
  "Zaalima.mp3",
  "Zamaana Lage - Rewind.mp3",
  "Zindagi Tere Naam (Soul Version).mp3",
  "dil sambhal ja zara song lyrics.mp3"
];

function cleanTitle(filename) {
  let title = filename.replace(/\.mp3$/i, '');
  title = title.replace(/Full Song with Lyrics|Lyrics|\(From[^)]+\)/gi, '');
  title = title.replace(/\s+/g, ' ').trim();
  return title || 'Hindi Track';
}

// Generate the 158 Full-Length Hindi Songs objects
export const HINDI_COLLECTION_TRACKS = HINDI_FILENAMES.map((file, idx) => ({
  id: `hindi-local-${idx}`,
  title: cleanTitle(file),
  artist: 'Bollywood Hits Collection',
  genre: 'Bollywood & Indian',
  region: 'Indian',
  era: idx % 3 === 0 ? '2020s' : idx % 3 === 1 ? '2010s' : '2000s',
  coverArt: HINDI_COVER_IMAGES[idx % HINDI_COVER_IMAGES.length],
  audioUrl: `/Hindi/${encodeURIComponent(file)}`, // 100% Full-Length MP3 URL
  duration: 240, // Estimated ~4 mins full length
  source: 'hindi',
  isFullSong: true,
  featured: idx < 10
}));

// Pre-loaded initial catalog starting with the Hindi Hits
export const INITIAL_NCS_TRACKS = HINDI_COLLECTION_TRACKS;

// Helper to infer Era (90s, 2000s, 2010s, 2020s)
function getEraFromDate(dateStr) {
  if (!dateStr) return '2020s';
  const year = parseInt(dateStr.substring(0, 4));
  if (year < 2000) return '90s';
  if (year < 2010) return '2000s';
  if (year < 2020) return '2010s';
  return '2020s';
}

// Helper to map genre & region keywords
function inferRegionAndGenre(title, artist, genreName) {
  const text = `${title} ${artist} ${genreName}`.toLowerCase();
  let region = 'Global';
  let genre = genreName || 'Pop';

  if (text.match(/(hindi|bollywood|arijit|rahman|punjabi|bhangra|tamil|telugu|singh|kiran|ishq|dil|sufi|indian)/i)) {
    region = 'Indian';
    genre = 'Bollywood & Indian';
  } else if (text.match(/(spanish|reggaeton|latin|bad bunny|rosalia|fonsi|daddy|enrique|shakira|salsa|bachata|flamenco)/i)) {
    region = 'Spanish';
    genre = 'Latin & Reggaeton';
  } else if (text.match(/(japanese|jpop|city pop|anime|yoasobi|yamashita|yonezu|utada|tokyo|naruto|ghibli)/i)) {
    region = 'Japanese';
    genre = 'J-Pop & City Pop';
  } else if (text.match(/(chinese|cpop|jay chou|g\.e\.m\.|guzheng|erhu|mandarin|cantopop|beijing)/i)) {
    region = 'Chinese';
    genre = 'C-Pop';
  } else if (text.match(/(phonk|drift|hyperpop)/i)) {
    genre = 'Phonk';
  } else if (text.match(/(lofi|chill|relax)/i)) {
    genre = 'Lofi';
  } else if (text.match(/(edm|house|dance|synth|dubstep|trap|techno)/i)) {
    genre = 'Electronic';
  } else if (text.match(/(rock|metal|indie|alt)/i)) {
    genre = 'Rock';
  } else if (text.match(/(hip-hop|rap|trap)/i)) {
    genre = 'Hip-Hop';
  } else if (text.match(/(jazz|blues|soul)/i)) {
    genre = 'Jazz';
  }

  return { region, genre };
}

// Fetch Jamendo Music API (100% FULL-LENGTH SONGS!)
export async function fetchJamendoAlbums() {
  try {
    const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=80&order=popularity_month&include=musicinfo`);
    if (!res.ok) throw new Error('Jamendo API request failed');
    const json = await res.json();

    return json.results.map(track => {
      const rawGenre = track.musicinfo && track.musicinfo.tags && track.musicinfo.tags.genres && track.musicinfo.tags.genres[0] ? track.musicinfo.tags.genres[0] : 'Pop';
      const { region, genre } = inferRegionAndGenre(track.name || '', track.artist_name || '', rawGenre);

      return {
        id: `jamendo-${track.id}`,
        title: track.name || 'Untitled Track',
        artist: track.artist_name || 'Jamendo Artist',
        genre: genre,
        region: region,
        era: '2010s',
        coverArt: track.album_image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        audioUrl: track.audio,
        duration: track.duration || 210,
        source: 'jamendo',
        isFullSong: true,
        featured: false
      };
    });
  } catch (err) {
    console.warn('Jamendo API fetch error:', err);
    return [];
  }
}

// Fetch Audius Open Music API (100% FULL-LENGTH SONGS!)
export async function fetchAudiusTrending() {
  try {
    const res = await fetch(`https://api.audius.co/v1/tracks/trending?app_name=${AUDIUS_APP_NAME}&limit=60`);
    if (!res.ok) throw new Error('Audius API request failed');
    const json = await res.json();

    return json.data.map(track => {
      const { region, genre } = inferRegionAndGenre(track.title || '', track.user ? track.user.name : '', track.genre || '');
      return {
        id: `audius-${track.id}`,
        title: track.title || 'Untitled Track',
        artist: track.user ? track.user.name : 'Unknown Artist',
        genre: genre,
        region: region,
        era: '2020s',
        coverArt: track.artwork ? track.artwork['480x480'] || track.artwork['150x150'] : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        audioUrl: `https://api.audius.co/v1/tracks/${track.id}/stream?app_name=${AUDIUS_APP_NAME}`,
        duration: track.duration || 190,
        source: 'audius',
        isFullSong: true,
        featured: false
      };
    });
  } catch (err) {
    console.warn('Audius API fetch error:', err);
    return [];
  }
}

// Fetch iTunes Search API (30-sec previews for global discovery search)
export async function fetchGlobaliTunesTracks() {
  const globalQueries = [
    { query: 'Arijit Singh Bollywood', defaultRegion: 'Indian' },
    { query: 'AR Rahman Tamil', defaultRegion: 'Indian' },
    { query: 'Punjabi Bhangra', defaultRegion: 'Indian' },
    { query: 'Bad Bunny Latin', defaultRegion: 'Spanish' },
    { query: 'Rosalia Reggaeton', defaultRegion: 'Spanish' },
    { query: 'Yoasobi J-Pop', defaultRegion: 'Japanese' },
    { query: 'Japanese City Pop', defaultRegion: 'Japanese' },
    { query: 'Jay Chou Chinese Pop', defaultRegion: 'Chinese' },
    { query: '90s Dance Hits', defaultRegion: 'Global' },
    { query: '2000s Rock Hits', defaultRegion: 'Global' },
    { query: '2010s EDM Festival', defaultRegion: 'Global' },
    { query: 'Drift Phonk 2024', defaultRegion: 'Global' }
  ];

  try {
    const promises = globalQueries.map(item =>
      fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(item.query)}&entity=song&limit=12`)
        .then(r => r.json())
        .catch(() => ({ results: [] }))
    );

    const results = await Promise.allSettled(promises);
    const tracksList = [];

    results.forEach((res, i) => {
      if (res.status === 'fulfilled' && res.value && res.value.results) {
        const defaultRegion = globalQueries[i].defaultRegion;
        res.value.results.forEach(item => {
          if (item.previewUrl) {
            const { region, genre } = inferRegionAndGenre(item.trackName || '', item.artistName || '', item.primaryGenreName || '');
            const era = getEraFromDate(item.releaseDate);
            const cover = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

            tracksList.push({
              id: `itunes-${item.trackId}`,
              title: item.trackName || 'Untitled Song',
              artist: item.artistName || 'Unknown Artist',
              genre: genre,
              region: region !== 'Global' ? region : defaultRegion,
              era: era,
              coverArt: cover,
              audioUrl: item.previewUrl,
              duration: 30,
              source: 'itunes',
              isFullSong: false,
              featured: false
            });
          }
        });
      }
    });

    return tracksList;
  } catch (err) {
    console.warn('iTunes API fetch error:', err);
    return [];
  }
}

// Live Global Search
export async function searchGlobalTracks(query) {
  if (!query || !query.trim()) return [];

  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=25`);
    if (!res.ok) return [];
    const json = await res.json();

    return json.results.map(item => {
      const { region, genre } = inferRegionAndGenre(item.trackName || '', item.artistName || '', item.primaryGenreName || '');
      const era = getEraFromDate(item.releaseDate);
      const cover = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

      return {
        id: `search-${item.trackId}`,
        title: item.trackName || 'Untitled Song',
        artist: item.artistName || 'Unknown Artist',
        genre: genre,
        region: region,
        era: era,
        coverArt: cover,
        audioUrl: item.previewUrl,
        duration: 30,
        source: 'itunes',
        isFullSong: false,
        featured: false
      };
    });
  } catch (err) {
    console.error('Search global error:', err);
    return [];
  }
}

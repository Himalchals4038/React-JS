// Simulated REST API Layer for Cloud DB Sync, Leaderboards & Dynamic Market Ticker
import { dbService } from './database';

const FAKE_LATENCY_MS = 250;

// Default Seed Leaderboard Data for Medieval Feudal Lords
const SEED_LEADERBOARD = [
  { id: 1, rank: 1, rulerName: 'Emperor Valerius IX', realmName: 'Valeria Citadel', netWorth: 4850000000, crownJewels: 42, title: 'Grand Emperor' },
  { id: 2, rank: 2, rulerName: 'Duchess Genevieve', realmName: 'Silverwing Spire', netWorth: 2910000000, crownJewels: 28, title: 'Grand Duchess' },
  { id: 3, rank: 3, rulerName: 'Lord Commander Vane', realmName: 'Ironhold Fortress', netWorth: 1450000000, crownJewels: 19, title: 'Warlord' },
  { id: 4, rank: 4, rulerName: 'High Archmage Theron', realmName: 'Aetheria Arcana', netWorth: 89000000, crownJewels: 14, title: 'Archmage' },
  { id: 5, rank: 5, rulerName: 'Baroness Cordelia', realmName: 'Golden Fields', netWorth: 52000000, crownJewels: 9, title: 'Baroness' },
  { id: 6, rank: 6, rulerName: 'Sir Gareth the Swift', realmName: 'Falcon Keep', netWorth: 18000000, crownJewels: 5, title: 'High Paladin' },
  { id: 7, rank: 7, rulerName: 'Earl Montgomery', realmName: 'Oakheart Dominion', netWorth: 9500000, crownJewels: 3, title: 'Earl' },
  { id: 8, rank: 8, rulerName: 'Lady Celeste', realmName: 'Moonlight Haven', netWorth: 4200000, crownJewels: 2, title: 'Viscountess' }
];

export const saveKingdomStateApi = async (gameSave) => {
  await new Promise(r => setTimeout(r, FAKE_LATENCY_MS));
  const success = await dbService.saveGame(gameSave);
  return {
    status: 200,
    success,
    message: 'Kingdom state synchronized with Royal Cloud Archives.',
    timestamp: Date.now()
  };
};

export const fetchLeaderboardApi = async () => {
  await new Promise(r => setTimeout(r, FAKE_LATENCY_MS));
  // Read current player save to insert player rank dynamically
  const currentSave = await dbService.loadGame();
  let playerEntry = null;

  if (currentSave) {
    const totalGold = currentSave.resources?.gold || 0;
    playerEntry = {
      id: 'player_you',
      rank: 1, // calculated below
      rulerName: currentSave.rulerName || 'You (Royal Sovereign)',
      realmName: currentSave.realmName || 'Crown Colony',
      netWorth: totalGold,
      crownJewels: currentSave.crownJewels || 0,
      title: 'Current Sovereign',
      isPlayer: true
    };
  }

  const combined = [...SEED_LEADERBOARD];
  if (playerEntry) {
    combined.push(playerEntry);
  }

  // Sort by netWorth descending
  combined.sort((a, b) => b.netWorth - a.netWorth);

  // Assign ranks
  combined.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  return {
    status: 200,
    leaderboard: combined,
    updatedAt: Date.now()
  };
};

export const fetchMarketTickerApi = async () => {
  await new Promise(r => setTimeout(r, 100));

  // Dynamic fluctuating trade prices for feudal resources in Gold Coins
  const now = Date.now();
  const timeFactor = Math.sin(now / 15000);

  return {
    status: 200,
    rates: {
      timber: Math.max(1, Math.round(5 + timeFactor * 3)),
      stone: Math.max(2, Math.round(10 + Math.cos(now / 12000) * 5)),
      provisions: Math.max(3, Math.round(15 + Math.sin(now / 8000) * 8)),
      iron: Math.max(5, Math.round(35 + Math.cos(now / 20000) * 15)),
      mana: Math.max(10, Math.round(80 + Math.sin(now / 10000) * 40))
    },
    trend: timeFactor > 0 ? 'bullish' : 'bearish',
    timestamp: now
  };
};

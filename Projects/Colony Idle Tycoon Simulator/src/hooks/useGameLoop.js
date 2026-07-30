import { useEffect, useRef, useState } from 'react';
import { calculateTotalProduction, calculateOfflineEarnings } from '../utils/gameMath';
import { dbService } from '../services/database';
import { TIMED_EVENTS } from '../utils/constants';

export const INITIAL_GAME_STATE = {
  characterId: 'arthur',
  rulerName: 'Sovereign Arthur',
  realmName: 'Crown Dominion',
  resources: {
    gold: 100,
    timber: 50,
    stone: 20,
    provisions: 20,
    iron: 0,
    mana: 0
  },
  buildings: {
    lumberyard: { level: 1, hasManager: false },
    quarry: { level: 0, hasManager: false },
    dwarvenmasonry: { level: 0, hasManager: false },
    windmill: { level: 0, hasManager: false },
    fishery: { level: 0, hasManager: false },
    ironmine: { level: 0, hasManager: false },
    volcanicfoundry: { level: 0, hasManager: false },
    barracks: { level: 0, hasManager: false },
    siegeworkshop: { level: 0, hasManager: false },
    goldmint: { level: 0, hasManager: false },
    wizardtower: { level: 0, hasManager: false },
    alchemistlab: { level: 0, hasManager: false },
    observatory: { level: 0, hasManager: false },
    merchantguild: { level: 0, hasManager: false },
    cathedral: { level: 0, hasManager: false },
    dragonsanctuary: { level: 0, hasManager: false },
    royalcitadel: { level: 0, hasManager: false }
  },
  autoHarvesters: {
    golem: 1,
    arcane_clicker: 0,
    tax_drone: 0
  },
  unlockedTechs: [],
  crownJewels: 0,
  completedQuests: [],
  activeSeasonalEvent: 'winter',
  seasonalCurrencies: {
    winter: 50,
    halloween: 0,
    solstice: 0
  },
  purchasedSkins: [],
  activeSkin: 'default',
  activeCrest: 'lion',
  weather: 'sunny',
  timeOfDay: 'day',
  lastSaveTime: Date.now()
};

export function useGameLoop(initialSaveData, activeSlotId) {
  const [gameState, setGameState] = useState(() => {
    return initialSaveData ? { ...INITIAL_GAME_STATE, ...initialSaveData } : INITIAL_GAME_STATE;
  });

  const [productionPerSec, setProductionPerSec] = useState({ gold: 0, timber: 0, stone: 0, provisions: 0, iron: 0, mana: 0 });
  const [syncStatus, setSyncStatus] = useState('synced');
  const [activeTimedEvent, setActiveTimedEvent] = useState(null);
  const [offlineReport, setOfflineReport] = useState(null);

  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  // Re-calculate production rate whenever buildings, techs, jewels, or character changes
  useEffect(() => {
    const prod = calculateTotalProduction(gameState);
    setProductionPerSec(prod);
  }, [
    gameState.buildings,
    gameState.unlockedTechs,
    gameState.crownJewels,
    gameState.activeSeasonalEvent,
    gameState.characterId,
    gameState.autoHarvesters
  ]);

  // Check offline earnings on initial load
  useEffect(() => {
    if (initialSaveData && initialSaveData.lastSaveTime) {
      const { elapsedSeconds, earnings } = calculateOfflineEarnings(initialSaveData.lastSaveTime, initialSaveData);
      if (elapsedSeconds > 10) {
        setOfflineReport({ elapsedSeconds, earnings });
        setGameState(prev => {
          const newRes = { ...prev.resources };
          Object.entries(earnings).forEach(([k, v]) => {
            newRes[k] = (newRes[k] || 0) + v;
          });
          return { ...prev, resources: newRes };
        });
      }
    }
  }, []);

  // Main 1-second Tick Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const prod = calculateTotalProduction(prev);
        const updatedRes = { ...prev.resources };

        Object.entries(prod).forEach(([resId, rate]) => {
          updatedRes[resId] = Math.max(0, (updatedRes[resId] || 0) + rate);
        });

        return {
          ...prev,
          resources: updatedRes,
          lastSaveTime: Date.now()
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-Save Cloud Sync every 10 seconds for the active slot
  useEffect(() => {
    if (!activeSlotId) return;

    const autoSaveInterval = setInterval(async () => {
      setSyncStatus('saving');
      try {
        const success = await dbService.saveSlot(activeSlotId, stateRef.current);
        if (success) {
          setSyncStatus('synced');
        } else {
          setSyncStatus('error');
        }
      } catch (err) {
        setSyncStatus('error');
      }
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [activeSlotId]);

  // Random Timed Events Generator
  useEffect(() => {
    const eventTimer = setInterval(() => {
      if (!activeTimedEvent) {
        const randomEvt = TIMED_EVENTS[Math.floor(Math.random() * TIMED_EVENTS.length)];
        setActiveTimedEvent({
          ...randomEvt,
          expiresAt: Date.now() + randomEvt.duration * 1000
        });
      }
    }, 85000);

    return () => clearInterval(eventTimer);
  }, [activeTimedEvent]);

  useEffect(() => {
    if (!activeTimedEvent) return;
    const expiryCheck = setInterval(() => {
      if (Date.now() >= activeTimedEvent.expiresAt) {
        setActiveTimedEvent(null);
      }
    }, 1000);
    return () => clearInterval(expiryCheck);
  }, [activeTimedEvent]);

  return {
    gameState,
    setGameState,
    productionPerSec,
    syncStatus,
    activeTimedEvent,
    setActiveTimedEvent,
    offlineReport,
    setOfflineReport
  };
}

import React, { useEffect, useState } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { dbService } from './services/database';
import { audioSynth } from './utils/audioSynth';

import Navbar from './components/Navbar';
import ResourceBar from './components/ResourceBar';
import ColonyCanvasMap from './components/ColonyCanvasMap';
import BuildingGrid from './components/BuildingGrid';
import FooterCredits from './components/FooterCredits';

import CharacterSelectModal from './components/CharacterSelectModal';
import AutoHarvesterPanel from './components/AutoHarvesterPanel';
import RealmCustomizerModal from './components/RealmCustomizerModal';
import AlchemyTransmuteModal from './components/AlchemyTransmuteModal';

import TechTreeModal from './components/TechTreeModal';
import PrestigeModal from './components/PrestigeModal';
import NPCModal from './components/NPCModal';
import SeasonalFestiveModal from './components/SeasonalFestiveModal';
import MarketTradeModal from './components/MarketTradeModal';
import LeaderboardModal from './components/LeaderboardModal';

import EventBannerModal from './components/EventBannerModal';
import OfflineReportModal from './components/OfflineReportModal';

export default function App() {
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loadingDb, setLoadingDb] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    dbService.listAllSlots().then(slots => {
      if (slots.length > 0) {
        setActiveSlotId(slots[0].slotId);
        setInitialData(slots[0].data);
      }
      setLoadingDb(false);
    });
  }, []);

  const handleSelectProfile = (saveData, slotId) => {
    setInitialData(saveData);
    setActiveSlotId(slotId);
    setActiveModal(null);
  };

  const handleExitToProfiles = () => {
    setActiveModal('characterSelect');
  };

  if (loadingDb) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0a06',
        color: '#ffd700',
        fontFamily: 'Cinzel Decorative, serif',
        fontSize: '1.5rem'
      }}>
        Loading Sovereign Archives...
      </div>
    );
  }

  if (!activeSlotId || !initialData) {
    return (
      <CharacterSelectModal
        onSelectProfile={handleSelectProfile}
        currentActiveSlot={null}
      />
    );
  }

  return (
    <GameMain
      key={activeSlotId}
      activeSlotId={activeSlotId}
      initialData={initialData}
      activeModal={activeModal}
      setActiveModal={setActiveModal}
      soundEnabled={soundEnabled}
      setSoundEnabled={setSoundEnabled}
      onSelectProfile={handleSelectProfile}
      onExitToProfiles={handleExitToProfiles}
    />
  );
}

function GameMain({
  activeSlotId,
  initialData,
  activeModal,
  setActiveModal,
  soundEnabled,
  setSoundEnabled,
  onSelectProfile,
  onExitToProfiles
}) {
  const {
    gameState,
    setGameState,
    productionPerSec,
    syncStatus,
    activeTimedEvent,
    setActiveTimedEvent,
    offlineReport,
    setOfflineReport
  } = useGameLoop(initialData, activeSlotId);

  // Upgrade building level
  const handleUpgradeBuilding = (buildingId, countToBuy, costs) => {
    setGameState(prev => {
      const updatedRes = { ...prev.resources };
      Object.entries(costs).forEach(([resId, amt]) => {
        updatedRes[resId] = Math.max(0, (updatedRes[resId] || 0) - amt);
      });

      const currentLvl = prev.buildings[buildingId]?.level || 0;
      const updatedBuildings = {
        ...prev.buildings,
        [buildingId]: {
          ...(prev.buildings[buildingId] || {}),
          level: currentLvl + countToBuy
        }
      };

      return {
        ...prev,
        resources: updatedRes,
        buildings: updatedBuildings
      };
    });
  };

  // Hire manager automation
  const handleHireManager = (buildingId, goldCost) => {
    setGameState(prev => {
      if ((prev.resources.gold || 0) < goldCost) return prev;

      return {
        ...prev,
        resources: {
          ...prev.resources,
          gold: prev.resources.gold - goldCost
        },
        buildings: {
          ...prev.buildings,
          [buildingId]: {
            ...(prev.buildings[buildingId] || {}),
            hasManager: true
          }
        }
      };
    });
  };

  // Upgrade Auto-Gold Harvester
  const handleUpgradeHarvester = (harvesterId, costs) => {
    setGameState(prev => {
      const updatedRes = { ...prev.resources };
      Object.entries(costs).forEach(([resId, amt]) => {
        updatedRes[resId] = Math.max(0, (updatedRes[resId] || 0) - amt);
      });

      const curLvl = prev.autoHarvesters[harvesterId] || 0;

      return {
        ...prev,
        resources: updatedRes,
        autoHarvesters: {
          ...prev.autoHarvesters,
          [harvesterId]: curLvl + 1
        }
      };
    });
  };

  // Transmute resources in Alchemy Lab
  const handleTransmuteResource = (fromRes, toRes, costAmount, gainedAmount) => {
    setGameState(prev => {
      const owned = prev.resources[fromRes] || 0;
      if (owned < costAmount) return prev;

      return {
        ...prev,
        resources: {
          ...prev.resources,
          [fromRes]: owned - costAmount,
          [toRes]: (prev.resources[toRes] || 0) + gainedAmount
        }
      };
    });
  };

  // Fortune Shrine Wheel Spin win
  const handleSpinShrine = (winObj) => {
    setGameState(prev => {
      if (winObj.res === 'crownJewels') {
        return { ...prev, crownJewels: (prev.crownJewels || 0) + winObj.amount };
      }
      return {
        ...prev,
        resources: {
          ...prev.resources,
          [winObj.res]: (prev.resources[winObj.res] || 0) + winObj.amount
        }
      };
    });
  };

  // Realm Customization handlers
  const handleChangeSkin = (skinId) => {
    setGameState(prev => ({ ...prev, activeSkin: skinId }));
  };

  const handleChangeCrest = (crestId) => {
    setGameState(prev => ({ ...prev, activeCrest: crestId }));
  };

  const handleChangeWeather = (weatherType) => {
    setGameState(prev => ({ ...prev, weather: weatherType }));
  };

  const handleChangeTimeOfDay = (timeType) => {
    setGameState(prev => ({ ...prev, timeOfDay: timeType }));
  };

  // Research Tech
  const handleResearchTech = (techId, costs) => {
    setGameState(prev => {
      const updatedRes = { ...prev.resources };
      Object.entries(costs).forEach(([resId, amt]) => {
        updatedRes[resId] = Math.max(0, (updatedRes[resId] || 0) - amt);
      });

      return {
        ...prev,
        resources: updatedRes,
        unlockedTechs: [...prev.unlockedTechs, techId]
      };
    });
  };

  // Crown Jewels Rebirth
  const handlePrestigeRebirth = (earnedJewels) => {
    setGameState(prev => ({
      ...prev,
      crownJewels: (prev.crownJewels || 0) + earnedJewels,
      resources: { gold: 100, timber: 50, stone: 20, provisions: 20, iron: 0, mana: 0 },
      buildings: {
        lumberyard: { level: 1, hasManager: false },
        quarry: { level: 0, hasManager: false },
        windmill: { level: 0, hasManager: false },
        ironmine: { level: 0, hasManager: false },
        goldmint: { level: 0, hasManager: false },
        wizardtower: { level: 0, hasManager: false },
        barracks: { level: 0, hasManager: false },
        merchantguild: { level: 0, hasManager: false },
        dragonsanctuary: { level: 0, hasManager: false },
        royalcitadel: { level: 0, hasManager: false }
      }
    }));
  };

  // Claim NPC dialogue bonus
  const handleClaimNPCBonus = (rewardObj) => {
    setGameState(prev => {
      const newRes = { ...prev.resources };
      Object.entries(rewardObj).forEach(([k, v]) => {
        newRes[k] = (newRes[k] || 0) + v;
      });
      return { ...prev, resources: newRes };
    });
  };

  // Claim Quest reward
  const handleClaimQuest = (questId, rewardObj) => {
    setGameState(prev => {
      if (prev.completedQuests?.includes(questId)) return prev;

      const newRes = { ...prev.resources };
      Object.entries(rewardObj).forEach(([k, v]) => {
        newRes[k] = (newRes[k] || 0) + v;
      });

      return {
        ...prev,
        resources: newRes,
        completedQuests: [...(prev.completedQuests || []), questId]
      };
    });
  };

  // Buy Mercenary Contract
  const handleBuyContract = (contractId, goldCost) => {
    setGameState(prev => {
      if ((prev.resources.gold || 0) < goldCost) return prev;

      return {
        ...prev,
        resources: {
          ...prev.resources,
          gold: prev.resources.gold - goldCost
        },
        purchasedContracts: [...(prev.purchasedContracts || []), contractId]
      };
    });
  };

  // Festival Season Switch
  const handleSelectSeason = (seasonKey) => {
    setGameState(prev => ({ ...prev, activeSeasonalEvent: seasonKey }));
  };

  // Seasonal Shop item buy
  const handleBuyShopItem = (seasonKey, itemId, cost) => {
    setGameState(prev => {
      const curVal = (prev.seasonalCurrencies || {})[seasonKey] || 0;
      if (curVal < cost) return prev;

      return {
        ...prev,
        seasonalCurrencies: {
          ...prev.seasonalCurrencies,
          [seasonKey]: curVal - cost
        },
        purchasedSkins: [...prev.purchasedSkins, itemId]
      };
    });
  };

  // Bazaar trade sell
  const handleSellResource = (resId, quantity, ratePerUnit) => {
    setGameState(prev => {
      const owned = prev.resources[resId] || 0;
      const toSell = Math.min(owned, quantity);
      if (toSell <= 0) return prev;

      const goldGained = Math.floor(toSell * ratePerUnit);

      return {
        ...prev,
        resources: {
          ...prev.resources,
          [resId]: owned - toSell,
          gold: (prev.resources.gold || 0) + goldGained
        }
      };
    });
  };

  // Bazaar trade buy
  const handleBuyResource = (resId, quantity, ratePerUnit) => {
    setGameState(prev => {
      const totalCost = ratePerUnit * quantity;
      const currentGold = prev.resources.gold || 0;
      if (currentGold < totalCost) return prev;

      return {
        ...prev,
        resources: {
          ...prev.resources,
          gold: currentGold - totalCost,
          [resId]: (prev.resources[resId] || 0) + quantity
        }
      };
    });
  };

  // Manual canvas tap resource gain
  const handleTapKingdom = () => {
    setGameState(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        timber: (prev.resources.timber || 0) + 2,
        stone: (prev.resources.stone || 0) + 1,
        gold: (prev.resources.gold || 0) + 1
      }
    }));
  };

  // Resolve timed event
  const handleResolveEvent = (evt) => {
    setGameState(prev => {
      const newRes = { ...prev.resources };
      if (evt.rewardType === 'gold') newRes.gold = (newRes.gold || 0) + evt.rewardAmount;
      if (evt.rewardType === 'provisions') newRes.provisions = (newRes.provisions || 0) + evt.rewardAmount;
      if (evt.rewardType === 'mana') newRes.mana = (newRes.mana || 0) + evt.rewardAmount;

      return { ...prev, resources: newRes };
    });
    setActiveTimedEvent(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <Navbar
        gameState={gameState}
        syncStatus={syncStatus}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenModal={modalKey => setActiveModal(modalKey)}
        onExitToProfiles={onExitToProfiles}
      />

      {/* Live Resource Gauge Bar */}
      <ResourceBar resources={gameState.resources} productionPerSec={productionPerSec} />

      {/* Main Realm Body */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        {/* 2D High-Res Interactive Canvas Realm */}
        <ColonyCanvasMap
          gameState={gameState}
          onTapKingdom={handleTapKingdom}
          activeTimedEvent={activeTimedEvent}
          onResolveEvent={handleResolveEvent}
        />

        {/* 16 Structure Tiers & Upgrades */}
        <BuildingGrid
          gameState={gameState}
          onUpgradeBuilding={handleUpgradeBuilding}
          onHireManager={handleHireManager}
        />
      </main>

      {/* Footer Credits with GitHub Repo Link */}
      <FooterCredits />

      {/* Modals */}
      {activeModal === 'characterSelect' && (
        <CharacterSelectModal
          currentActiveSlot={activeSlotId}
          onSelectProfile={onSelectProfile}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'alchemy' && (
        <AlchemyTransmuteModal
          gameState={gameState}
          onClose={() => setActiveModal(null)}
          onTransmuteResource={handleTransmuteResource}
          onSpinShrine={handleSpinShrine}
        />
      )}

      {activeModal === 'autoHarvester' && (
        <AutoHarvesterPanel
          gameState={gameState}
          onClose={() => setActiveModal(null)}
          onUpgradeHarvester={handleUpgradeHarvester}
        />
      )}

      {activeModal === 'customizer' && (
        <RealmCustomizerModal
          gameState={gameState}
          onClose={() => setActiveModal(null)}
          onChangeSkin={handleChangeSkin}
          onChangeCrest={handleChangeCrest}
          onChangeWeather={handleChangeWeather}
          onChangeTimeOfDay={handleChangeTimeOfDay}
        />
      )}

      {activeModal === 'tech' && (
        <TechTreeModal
          gameState={gameState}
          onClose={() => setActiveModal(null)}
          onResearchTech={handleResearchTech}
        />
      )}

      {activeModal === 'prestige' && (
        <PrestigeModal
          gameState={gameState}
          onClose={() => setActiveModal(null)}
          onPrestigeRebirth={handlePrestigeRebirth}
        />
      )}

      {activeModal === 'npcs' && (
        <NPCModal
          gameState={gameState}
          onClose={() => setActiveModal(null)}
          onClaimNPCBonus={handleClaimNPCBonus}
          onClaimQuest={handleClaimQuest}
          onBuyContract={handleBuyContract}
        />
      )}

      {activeModal === 'seasonal' && (
        <SeasonalFestiveModal
          gameState={gameState}
          onClose={() => setActiveModal(null)}
          onSelectSeason={handleSelectSeason}
          onBuyShopItem={handleBuyShopItem}
        />
      )}

      {activeModal === 'bazaar' && (
        <MarketTradeModal
          gameState={gameState}
          onClose={() => setActiveModal(null)}
          onSellResource={handleSellResource}
          onBuyResource={handleBuyResource}
        />
      )}

      {activeModal === 'leaderboard' && (
        <LeaderboardModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Timed Event Banner */}
      <EventBannerModal
        activeTimedEvent={activeTimedEvent}
        onResolveEvent={handleResolveEvent}
        onDismiss={() => setActiveTimedEvent(null)}
      />

      {/* Offline Earnings Report */}
      <OfflineReportModal
        offlineReport={offlineReport}
        onClose={() => setOfflineReport(null)}
      />
    </div>
  );
}

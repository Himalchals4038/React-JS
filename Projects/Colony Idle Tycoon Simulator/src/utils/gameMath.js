import { BUILDINGS, TECH_TREE, SOVEREIGN_CHARACTERS, AUTO_HARVESTERS } from './constants';

// Calculate cost for purchasing building level taking character discount into account
export const getBuildingCost = (building, currentLevel, countToBuy = 1, charDiscount = 1.0) => {
  const costs = {};
  for (let i = 0; i < countToBuy; i++) {
    const level = currentLevel + i;
    const levelMultiplier = Math.pow(building.costMultiplier, level);

    Object.entries(building.baseCost).forEach(([resId, amount]) => {
      const rawCost = Math.floor(amount * levelMultiplier * charDiscount);
      costs[resId] = (costs[resId] || 0) + rawCost;
    });
  }
  return costs;
};

// Calculate total production per second for all resources
export const calculateTotalProduction = (gameSave) => {
  const {
    buildings = {},
    unlockedTechs = [],
    crownJewels = 0,
    activeSeasonalEvent = null,
    characterId = 'arthur',
    autoHarvesters = {}
  } = gameSave;

  const charCfg = SOVEREIGN_CHARACTERS.find(c => c.id === characterId) || SOVEREIGN_CHARACTERS[0];

  const totalProd = {
    gold: 0,
    timber: 0,
    stone: 0,
    provisions: 0,
    iron: 0,
    mana: 0
  };

  // Base prestige multiplier
  const prestigeMult = 1 + (crownJewels * 1.0);

  // Check global tech tree multipliers
  let globalMult = 1;
  unlockedTechs.forEach(techId => {
    const tech = TECH_TREE.find(t => t.id === techId);
    if (tech && tech.bonusType === 'all_mult') {
      globalMult *= tech.multiplier;
    }
  });

  // Calculate building level contributions
  BUILDINGS.forEach(b => {
    const level = buildings[b.id]?.level || 0;
    const hasManager = buildings[b.id]?.hasManager || false;

    if (level > 0) {
      let bMult = 1;
      unlockedTechs.forEach(techId => {
        const tech = TECH_TREE.find(t => t.id === techId);
        if (tech && tech.bonusType === 'building_mult' && tech.targetBuilding === b.id) {
          bMult *= tech.multiplier;
        }
      });

      const efficiency = hasManager ? 1.0 : 0.8;

      Object.entries(b.baseProduction).forEach(([resId, baseAmount]) => {
        let resMult = 1;
        unlockedTechs.forEach(techId => {
          const tech = TECH_TREE.find(t => t.id === techId);
          if (tech && tech.bonusType === 'global_resource_mult' && tech.targetResource === resId) {
            resMult *= tech.multiplier;
          }
        });

        // Character Trait Multipliers
        if (resId === 'gold') resMult *= charCfg.goldMult || 1.0;
        if (resId === 'mana') resMult *= charCfg.manaMult || 1.0;
        if (resId === 'iron') resMult *= charCfg.ironMult || 1.0;

        // Seasonal event bonus
        if (activeSeasonalEvent === 'winter' && resId === 'provisions') resMult *= 2.0;
        if (activeSeasonalEvent === 'halloween' && resId === 'mana') resMult *= 2.0;
        if (activeSeasonalEvent === 'solstice' && resId === 'gold') resMult *= 2.0;

        const resRate = baseAmount * level * bMult * resMult * globalMult * prestigeMult * efficiency;
        totalProd[resId] = (totalProd[resId] || 0) + resRate;
      });
    }
  });

  // Calculate Automated Gold Harvesters output
  AUTO_HARVESTERS.forEach(h => {
    const hLvl = autoHarvesters[h.id] || 0;
    if (hLvl > 0) {
      const autoGoldRate = h.goldPerSec * hLvl * (charCfg.goldMult || 1.0) * prestigeMult;
      totalProd.gold = (totalProd.gold || 0) + autoGoldRate;
    }
  });

  return totalProd;
};

// Calculate offline earnings based on elapsed seconds
export const calculateOfflineEarnings = (lastSaveTime, currentGameSave) => {
  const now = Date.now();
  const elapsedSeconds = Math.max(0, Math.floor((now - lastSaveTime) / 1000));

  if (elapsedSeconds < 5) {
    return { elapsedSeconds: 0, earnings: {} };
  }

  const cappedSeconds = Math.min(elapsedSeconds, 86400);
  const productionPerSec = calculateTotalProduction(currentGameSave);

  const earnings = {};
  Object.entries(productionPerSec).forEach(([resId, rate]) => {
    earnings[resId] = Math.floor(rate * cappedSeconds * 0.7);
  });

  return {
    elapsedSeconds,
    earnings
  };
};

// Resource definitions with icons, colors, and display names
export const RESOURCES = {
  gold: { id: 'gold', name: 'Gold Coins', icon: 'Coins', color: '#ffd700', bg: 'rgba(255, 215, 0, 0.15)', desc: 'Primary currency of the Realm used for construction and trade.' },
  timber: { id: 'timber', name: 'Timber Wood', icon: 'Trees', color: '#a0522d', bg: 'rgba(160, 82, 45, 0.15)', desc: 'Harvested from royal forests for building structures.' },
  stone: { id: 'stone', name: 'Quarry Stone', icon: 'Mountain', color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.15)', desc: 'Mined granite and slate for fortifications.' },
  provisions: { id: 'provisions', name: 'Provisions', icon: 'Wheat', color: '#e6b800', bg: 'rgba(230, 184, 0, 0.15)', desc: 'Wheat and grain to feed peasant laborers and workers.' },
  iron: { id: 'iron', name: 'Iron Ore', icon: 'Hammer', color: '#708090', bg: 'rgba(112, 128, 144, 0.15)', desc: 'Refined ore for blacksmiths, tools, and armor.' },
  mana: { id: 'mana', name: 'Arcane Mana', icon: 'Sparkles', color: '#9370db', bg: 'rgba(147, 112, 219, 0.15)', desc: 'Mystical energy harnessed by Wizard Spires.' }
};

// 6 Selectable Sovereign Characters with Custom Traits & Visual Models
export const SOVEREIGN_CHARACTERS = [
  {
    id: 'arthur',
    name: 'King Arthur Pendragon',
    title: 'The High Sovereign',
    avatar: '👑',
    portraitColor: '#ffd700',
    traitName: 'Royal Treasury',
    traitDesc: '+25% Gold Production & Starts with Auto-Gold Collector Golem',
    goldMult: 1.25,
    manaMult: 1.0,
    ironMult: 1.0,
    costDiscount: 1.0,
    tradeBonus: 1.0,
    freeHarvesterLevel: 1
  },
  {
    id: 'elaria',
    name: 'High Priestess Elaria',
    title: 'Keeper of Ley Lines',
    avatar: '✨',
    portraitColor: '#9370db',
    traitName: 'Arcane Conduit',
    traitDesc: '+35% Mana Generation & Free Auto-Clicker Spell',
    goldMult: 1.0,
    manaMult: 1.35,
    ironMult: 1.0,
    costDiscount: 1.0,
    tradeBonus: 1.0,
    freeHarvesterLevel: 0
  },
  {
    id: 'vane',
    name: 'Ironclad General Vane',
    title: 'Warlord of Ironhold',
    avatar: '⚔️',
    portraitColor: '#e63946',
    traitName: 'Fortress Defense',
    traitDesc: '+40% Iron Ore Yield & Auto-Defends Dragon Raids',
    goldMult: 1.0,
    manaMult: 1.0,
    ironMult: 1.40,
    costDiscount: 1.0,
    tradeBonus: 1.0,
    freeHarvesterLevel: 0
  },
  {
    id: 'freya',
    name: 'Guildmistress Freya',
    title: 'Baroness of Trade',
    avatar: '⚖️',
    portraitColor: '#2a9d8f',
    traitName: 'Trade Monopoly',
    traitDesc: '+35% Grand Bazaar Sell Rates & Extra Trade Profits',
    goldMult: 1.15,
    manaMult: 1.0,
    ironMult: 1.0,
    costDiscount: 1.0,
    tradeBonus: 1.35,
    freeHarvesterLevel: 0
  },
  {
    id: 'ignis',
    name: 'Dragon Lord Ignis',
    title: 'Rider of Flames',
    avatar: '🐉',
    portraitColor: '#ffb703',
    traitName: 'Draconic Blessing',
    traitDesc: '+25% All Resource Yields & Flying Red Dragon Companion',
    goldMult: 1.25,
    manaMult: 1.25,
    ironMult: 1.25,
    costDiscount: 1.0,
    tradeBonus: 1.0,
    freeHarvesterLevel: 0
  },
  {
    id: 'cedric',
    name: 'Grand Steward Cedric',
    title: 'Master Architect',
    avatar: '🏰',
    portraitColor: '#a0522d',
    traitName: 'Master Builder',
    traitDesc: '-20% Building Upgrade Costs & Faster Guild Construction',
    goldMult: 1.0,
    manaMult: 1.0,
    ironMult: 1.0,
    costDiscount: 0.80,
    tradeBonus: 1.0,
    freeHarvesterLevel: 0
  }
];

// Automated Gold & Resource Harvesters
export const AUTO_HARVESTERS = [
  {
    id: 'golem',
    name: 'Automated Gold Golem',
    icon: 'Bot',
    desc: 'Constructed from enchanted granite to harvest +5 Gold per second automatically.',
    baseCost: { gold: 200, stone: 100 },
    costMultiplier: 1.25,
    goldPerSec: 5
  },
  {
    id: 'arcane_clicker',
    name: 'Arcane Auto-Tapper Spell',
    icon: 'Zap',
    desc: 'An automated spell that taps the kingdom realm every 0.5s for instant resources.',
    baseCost: { gold: 1000, mana: 200 },
    costMultiplier: 1.30,
    goldPerSec: 25
  },
  {
    id: 'tax_drone',
    name: 'Royal Collector Drone',
    icon: 'Crown',
    desc: 'A mechanical flying drone that collects taxes across all kingdom buildings.',
    baseCost: { gold: 5000, iron: 800 },
    costMultiplier: 1.35,
    goldPerSec: 100
  }
];

// Realm Customization Skins & Crests
export const CASTLE_SKINS = [
  { id: 'default', name: 'Sturdy Granite Stone', border: '#4a2e12', primary: '#4a4a4a', desc: 'Classic castle stone walls.' },
  { id: 'marble', name: 'Imperial White Marble', border: '#ffffff', primary: '#e0e0e0', desc: 'Elegant polished white marble.' },
  { id: 'obsidian', name: 'Dark Obsidian Spire', border: '#7209b7', primary: '#1a0033', desc: 'Volcanic dark glass obsidian.' },
  { id: 'gold_frost', name: 'Golden Frost Citadel', border: '#ffd700', primary: '#b8860b', desc: 'Glittering gold leaf and ice.' },
  { id: 'dragon_skin', name: 'Obsidian Dragon Scale', border: '#e63946', primary: '#800020', desc: 'Forged from red dragon scales.' }
];

export const CREST_BANNERS = [
  { id: 'lion', name: 'Lion Rampant', icon: '🦁', color: '#ffd700' },
  { id: 'dragon', name: 'Flying Red Dragon', icon: '🐉', color: '#e63946' },
  { id: 'phoenix', name: 'Golden Phoenix', icon: '🦅', color: '#ffb703' },
  { id: 'griffin', name: 'Royal Griffin', icon: '🦅', color: '#2a9d8f' }
];

// 18 Categorized Feudal Realm Structures & Guilds (Including 3 Stone-producing Guilds)
export const BUILDINGS = [
  // CATEGORY 1: BASIC RESOURCE GUILDS
  {
    id: 'lumberyard',
    name: 'Lumberjack Lodge',
    category: 'basic',
    icon: 'Trees',
    desc: 'Chops royal timber trees to supply wood for construction.',
    baseCost: { gold: 15, provisions: 5 },
    costMultiplier: 1.15,
    baseProduction: { timber: 1 },
    unlockedAt: 0,
    maxLevel: 100,
    managerCost: 100,
    managerName: 'Master Forester Bram'
  },
  {
    id: 'quarry',
    name: 'Granite Stone Quarry',
    category: 'basic',
    icon: 'Mountain',
    desc: 'Extracts sturdy slate and stone for kingdom foundations.',
    baseCost: { gold: 50, timber: 20 },
    costMultiplier: 1.15,
    baseProduction: { stone: 1.5 },
    unlockedAt: 1,
    maxLevel: 100,
    managerCost: 500,
    managerName: 'Guild Mason Thorgar'
  },
  {
    id: 'dwarvenmasonry',
    name: 'Dwarven Stonemasonry Guild',
    category: 'basic',
    icon: 'Mountain',
    desc: 'Dwarven craftsmen carve heavy granite blocks and slate for royal walls.',
    baseCost: { gold: 300, timber: 120, stone: 80 },
    costMultiplier: 1.16,
    baseProduction: { stone: 6, gold: 2 },
    unlockedAt: 2,
    maxLevel: 100,
    managerCost: 2500,
    managerName: 'Master Dwarven Mason Orin'
  },
  {
    id: 'windmill',
    name: 'Wheat Farm & Windmill',
    category: 'basic',
    icon: 'Wheat',
    desc: 'Grows golden grain and grinds flour to feed your realm.',
    baseCost: { gold: 120, timber: 50, stone: 30 },
    costMultiplier: 1.16,
    baseProduction: { provisions: 3 },
    unlockedAt: 2,
    maxLevel: 100,
    managerCost: 1200,
    managerName: 'Miller Barnaby'
  },
  {
    id: 'fishery',
    name: 'Royal Fishery & Pier',
    category: 'basic',
    icon: 'Fish',
    desc: 'Harvests fresh river fish and pearls to boost provisions and gold.',
    baseCost: { gold: 250, timber: 100, provisions: 40 },
    costMultiplier: 1.16,
    baseProduction: { provisions: 5, gold: 2 },
    unlockedAt: 2,
    maxLevel: 100,
    managerCost: 2000,
    managerName: 'Captain Finn'
  },

  // CATEGORY 2: MILITARY & INDUSTRY GUILDS
  {
    id: 'ironmine',
    name: 'Deep Iron Mine & Forge',
    category: 'military',
    icon: 'Hammer',
    desc: 'Smelts raw iron ore into steeled ingots for armor and tools.',
    baseCost: { gold: 400, stone: 150, provisions: 80 },
    costMultiplier: 1.17,
    baseProduction: { iron: 4 },
    unlockedAt: 3,
    maxLevel: 100,
    managerCost: 3500,
    managerName: 'Blacksmith Vorn'
  },
  {
    id: 'volcanicfoundry',
    name: 'Volcanic Basalt Rock Quarry',
    category: 'military',
    icon: 'Mountain',
    desc: 'Extracts magma basalt rock and obsidian stone from volcanic shafts.',
    baseCost: { gold: 6000, iron: 1500, stone: 2000 },
    costMultiplier: 1.20,
    baseProduction: { stone: 18, iron: 8 },
    unlockedAt: 4,
    maxLevel: 100,
    managerCost: 45000,
    managerName: 'Foundry Warden Ignar'
  },
  {
    id: 'barracks',
    name: 'Knight Barracks & Watchtower',
    category: 'military',
    icon: 'Shield',
    desc: 'Trains armored paladins. Boosts overall colony production by +5% per level.',
    baseCost: { gold: 15000, iron: 1200, provisions: 1500 },
    costMultiplier: 1.22,
    baseProduction: { gold: 25, iron: 15 },
    unlockedAt: 6,
    maxLevel: 100,
    managerCost: 120000,
    managerName: 'Captain Sir Roderick'
  },
  {
    id: 'siegeworkshop',
    name: 'Warcraft Siege Workshop',
    category: 'military',
    icon: 'Swords',
    desc: 'Constructs siege engines and ballistas to defend kingdom borders.',
    baseCost: { gold: 35000, iron: 3000, stone: 5000 },
    costMultiplier: 1.23,
    baseProduction: { iron: 30, gold: 40 },
    unlockedAt: 6,
    maxLevel: 100,
    managerCost: 250000,
    managerName: 'Commander Harek'
  },

  // CATEGORY 3: ARCANE & ALCHEMY SPIRES
  {
    id: 'wizardtower',
    name: 'Arcane Wizard Spire',
    category: 'arcane',
    icon: 'Sparkles',
    desc: 'Channel mystical Ley Line Mana to fuel magical tech research.',
    baseCost: { gold: 5000, stone: 1000, iron: 400 },
    costMultiplier: 1.20,
    baseProduction: { mana: 8 },
    unlockedAt: 5,
    maxLevel: 100,
    managerCost: 40000,
    managerName: 'High Archmage Eldrin'
  },
  {
    id: 'alchemistlab',
    name: 'Alchemist Laboratory',
    category: 'arcane',
    icon: 'FlaskConical',
    desc: 'Brew glowing elixirs to boost overall resource production.',
    baseCost: { gold: 12000, mana: 800, stone: 1500 },
    costMultiplier: 1.21,
    baseProduction: { mana: 15, gold: 15 },
    unlockedAt: 5,
    maxLevel: 100,
    managerCost: 80000,
    managerName: 'Alchemist Nicolas'
  },
  {
    id: 'observatory',
    name: 'Astronomer Observatory',
    category: 'arcane',
    icon: 'Eye',
    desc: 'Observes cosmic stellar constellations for starlight mana.',
    baseCost: { gold: 45000, mana: 4000, stone: 8000 },
    costMultiplier: 1.24,
    baseProduction: { mana: 45, gold: 30 },
    unlockedAt: 7,
    maxLevel: 100,
    managerCost: 300000,
    managerName: 'Stargazer Cassandra'
  },

  // CATEGORY 4: ROYAL TREASURY & PRESTIGE ESTATES
  {
    id: 'goldmint',
    name: 'Royal Treasury & Mint',
    category: 'royal',
    icon: 'Coins',
    desc: 'Coins gold bullions to exponentially boost kingdom revenue.',
    baseCost: { gold: 1200, iron: 100, stone: 300 },
    costMultiplier: 1.18,
    baseProduction: { gold: 10 },
    unlockedAt: 4,
    maxLevel: 100,
    managerCost: 10000,
    managerName: 'Chancellor Corvus'
  },
  {
    id: 'merchantguild',
    name: 'Grand Merchant Bazaar',
    category: 'royal',
    icon: 'Store',
    desc: 'Attracts interstellar & feudal traders for automatic market barter deals.',
    baseCost: { gold: 60000, timber: 15000, mana: 2000 },
    costMultiplier: 1.24,
    baseProduction: { gold: 75, timber: 50 },
    unlockedAt: 7,
    maxLevel: 100,
    managerCost: 350000,
    managerName: 'Guildmistress Isabella'
  },
  {
    id: 'cathedral',
    name: 'Cathedral of Sun & Light',
    category: 'royal',
    icon: 'Sun',
    desc: 'Inspires kingdom morale and attracts royal pilgrims.',
    baseCost: { gold: 120000, stone: 20000, mana: 8000 },
    costMultiplier: 1.25,
    baseProduction: { gold: 150, provisions: 100 },
    unlockedAt: 8,
    maxLevel: 100,
    managerCost: 750000,
    managerName: 'Bishop Gregory'
  },
  {
    id: 'dragonsanctuary',
    name: 'Dragontamer Sanctum',
    category: 'royal',
    icon: 'Flame',
    desc: 'Houses ancient dragons that amplify ALL kingdom production rates drastically.',
    baseCost: { gold: 250000, mana: 15000, iron: 20000 },
    costMultiplier: 1.26,
    baseProduction: { gold: 250, mana: 100 },
    unlockedAt: 8,
    maxLevel: 100,
    managerCost: 1500000,
    managerName: 'Draconic Rider Ignis'
  },
  {
    id: 'royalcitadel',
    name: 'Grand Royal Citadel',
    category: 'royal',
    icon: 'Crown',
    desc: 'The seat of the Sovereign! Unlocks Crown Jewels and huge kingdom glory.',
    baseCost: { gold: 1000000, stone: 100000, mana: 50000 },
    costMultiplier: 1.30,
    baseProduction: { gold: 1000, mana: 300, provisions: 500 },
    unlockedAt: 9,
    maxLevel: 100,
    managerCost: 5000000,
    managerName: 'Queen Regent Beatrice'
  }
];

// Guild Research Tech Tree
export const TECH_TREE = [
  // SECTION 1: RESOURCE-SPECIFIC PRODUCTION BOOSTS
  {
    id: 'heavy_axes',
    name: 'Mithril Steel Axes',
    category: 'resource',
    targetResource: 'timber',
    icon: 'Trees',
    cost: { gold: 250, timber: 200 },
    desc: 'Increases Timber Wood production from Lumberjack Lodges by +75%.',
    bonusType: 'building_mult',
    targetBuilding: 'lumberyard',
    multiplier: 1.75,
    prereq: []
  },
  {
    id: 'sawmill_boost',
    name: 'Royal Sawmill Mechanization',
    category: 'resource',
    targetResource: 'timber',
    icon: 'Trees',
    cost: { gold: 1500, timber: 1200 },
    desc: 'Increases Timber Wood yields by +100%.',
    bonusType: 'global_resource_mult',
    targetResource: 'timber',
    multiplier: 2.0,
    prereq: ['heavy_axes']
  },
  {
    id: 'stone_carving',
    name: 'Dwarven Stonemasonry',
    category: 'resource',
    targetResource: 'stone',
    icon: 'Mountain',
    cost: { gold: 600, stone: 500 },
    desc: 'Quarry Stone production increased by +100%.',
    bonusType: 'building_mult',
    targetBuilding: 'quarry',
    multiplier: 2.0,
    prereq: ['heavy_axes']
  },
  {
    id: 'granite_quarrying',
    name: 'Deep Granite Drilling',
    category: 'resource',
    targetResource: 'stone',
    icon: 'Mountain',
    cost: { gold: 3500, stone: 3000 },
    desc: 'Quarry Stone production increased by +150%.',
    bonusType: 'global_resource_mult',
    targetResource: 'stone',
    multiplier: 2.5,
    prereq: ['stone_carving']
  },
  {
    id: 'crop_rotation',
    name: 'Crop Rotation & Irrigation',
    category: 'resource',
    targetResource: 'provisions',
    icon: 'Wheat',
    cost: { gold: 100, provisions: 50 },
    desc: 'Increases Provisions grain yield from Windmills by +50%.',
    bonusType: 'building_mult',
    targetBuilding: 'windmill',
    multiplier: 1.5,
    prereq: []
  },
  {
    id: 'heavy_plows',
    name: 'Iron Plows & Granaries',
    category: 'resource',
    targetResource: 'provisions',
    icon: 'Wheat',
    cost: { gold: 2000, provisions: 1500 },
    desc: 'Increases Provisions production by +100%.',
    bonusType: 'global_resource_mult',
    targetResource: 'provisions',
    multiplier: 2.0,
    prereq: ['crop_rotation']
  },
  {
    id: 'blast_furnace',
    name: 'Magma Smelting',
    category: 'resource',
    targetResource: 'iron',
    icon: 'Hammer',
    cost: { gold: 2000, iron: 800, stone: 1000 },
    desc: 'Iron Mines produce +100% more Iron Ore.',
    bonusType: 'building_mult',
    targetBuilding: 'ironmine',
    multiplier: 2.0,
    prereq: ['stone_carving']
  },
  {
    id: 'bellows_blast',
    name: 'Titan Bellows Forging',
    category: 'resource',
    targetResource: 'iron',
    icon: 'Hammer',
    cost: { gold: 10000, iron: 4000 },
    desc: 'All Iron Ore yields increased by +150%.',
    bonusType: 'global_resource_mult',
    targetResource: 'iron',
    multiplier: 2.5,
    prereq: ['blast_furnace']
  },
  {
    id: 'alcemia',
    name: 'Philosopher Alchemy',
    category: 'resource',
    targetResource: 'gold',
    icon: 'Coins',
    cost: { gold: 8000, mana: 1000 },
    desc: 'Converts base lead to gold! All Gold Coins production +50%.',
    bonusType: 'global_resource_mult',
    targetResource: 'gold',
    multiplier: 1.5,
    prereq: ['blast_furnace']
  },
  {
    id: 'royal_mint_expansion',
    name: 'Royal Bullion Standard',
    category: 'resource',
    targetResource: 'gold',
    icon: 'Coins',
    cost: { gold: 50000, mana: 8000 },
    desc: 'All Gold Coins production increased by +100%.',
    bonusType: 'global_resource_mult',
    targetResource: 'gold',
    multiplier: 2.0,
    prereq: ['alcemia']
  },
  {
    id: 'ley_infusion',
    name: 'Arcane Ley Line Infusion',
    category: 'resource',
    targetResource: 'mana',
    icon: 'Sparkles',
    cost: { gold: 12000, mana: 2000 },
    desc: 'Arcane Mana generation increased by +100%.',
    bonusType: 'global_resource_mult',
    targetResource: 'mana',
    multiplier: 2.0,
    prereq: ['alcemia']
  },
  {
    id: 'astral_resonance',
    name: 'Astral Crystal Resonance',
    category: 'resource',
    targetResource: 'mana',
    icon: 'Sparkles',
    cost: { gold: 80000, mana: 15000 },
    desc: 'Arcane Mana generation increased by +200%.',
    bonusType: 'global_resource_mult',
    targetResource: 'mana',
    multiplier: 3.0,
    prereq: ['ley_infusion']
  },

  // SECTION 2: OVERALL KINGDOM REALM MULTIPLIERS
  {
    id: 'feudal_guild_charter',
    name: 'Feudal Guild Alliance',
    category: 'overall',
    icon: 'Crown',
    cost: { gold: 15000, stone: 5000, provisions: 5000 },
    desc: 'Increases ALL Kingdom resource production rates across the board by +50%.',
    bonusType: 'all_mult',
    multiplier: 1.5,
    prereq: ['sawmill_boost']
  },
  {
    id: 'dragon_lore',
    name: 'Dragon Whisperer Codex',
    category: 'overall',
    icon: 'Flame',
    cost: { gold: 30000, mana: 5000, iron: 4000 },
    desc: 'Dragontamer Sanctums and overall realm output increased by +150%.',
    bonusType: 'building_mult',
    targetBuilding: 'dragonsanctuary',
    multiplier: 2.5,
    prereq: ['feudal_guild_charter']
  },
  {
    id: 'sovereign_edict',
    name: 'Sovereign Edict of Industry',
    category: 'overall',
    icon: 'Crown',
    cost: { gold: 100000, mana: 15000 },
    desc: 'Increases ALL Kingdom building production rates across the board by +100%.',
    bonusType: 'all_mult',
    multiplier: 2.0,
    prereq: ['dragon_lore']
  },
  {
    id: 'imperial_charter',
    name: 'Imperial Sovereign Charter',
    category: 'overall',
    icon: 'Crown',
    cost: { gold: 500000, mana: 50000, iron: 50000 },
    desc: 'Ultimate Realm Multiplier! Increases ALL Kingdom yields across the board by +200%.',
    bonusType: 'all_mult',
    multiplier: 3.0,
    prereq: ['sovereign_edict']
  }
];

// Interactive NPCs with Multiple Story Quests
export const NPCS = [
  {
    id: 'eldrin',
    name: 'High Archmage Eldrin',
    title: 'Grand Master of Arcane Arts',
    avatar: '🔮',
    color: '#9370db',
    dialogues: [
      {
        id: 'e1',
        text: 'Greetings, Royal Sovereign. The Ley Lines ripple with ancient magic today. Have you gathered enough Mana for our research?',
        options: [
          { text: 'How do I generate more Mana?', next: 'e2' },
          { text: 'I am building Wizard Spires now.', next: 'e3' }
        ]
      },
      {
        id: 'e2',
        text: 'Construct Arcane Wizard Spires and research Alchemy in the Tech Tree. Mana unlocks profound kingdom enchantments!',
        options: [{ text: 'Understood, Archmage.', next: null }]
      },
      {
        id: 'e3',
        text: 'Magnificent! Here is a blessing of +500 Arcane Mana to accelerate your realm.',
        reward: { mana: 500 },
        options: [{ text: 'Thank you, Eldrin!', next: null }]
      }
    ],
    quests: [
      {
        id: 'quest_eldrin_1',
        title: 'Arcane Foundations',
        description: 'Gather 200 Arcane Mana for Eldrin to weave a barrier.',
        requirement: { mana: 200 },
        reward: { gold: 1000, mana: 300 }
      },
      {
        id: 'quest_eldrin_2',
        title: 'Alchemical Transmutation',
        description: 'Gather 1,000 Arcane Mana to unlock lead-to-gold alchemy.',
        requirement: { mana: 1000 },
        reward: { gold: 10000, mana: 2000 }
      },
      {
        id: 'quest_eldrin_3',
        title: 'Ley Line Mastery',
        description: 'Reach Level 5 in Wizard Spire to channel sovereign spells.',
        requirement: { wizardtowerLevel: 5 },
        reward: { gold: 50000, crownJewels: 1 }
      }
    ]
  },
  {
    id: 'roderick',
    name: 'Captain Sir Roderick',
    title: 'Commander of the Royal Guard',
    avatar: '⚔️',
    color: '#e63946',
    dialogues: [
      {
        id: 'r1',
        text: 'My Lord! The perimeter watchtowers report rogue dragons and bandit raiders near our borders. We must reinforce our barracks!',
        options: [
          { text: 'Are our defenses prepared?', next: 'r2' },
          { text: 'Take 500 Iron for armaments.', next: 'r3' }
        ]
      },
      {
        id: 'r2',
        text: 'With a high Knight Barracks level, our paladins easily repel dragon raids and siege attacks, earning extra Gold bounties!',
        options: [{ text: 'I will upgrade the Barracks.', next: null }]
      },
      {
        id: 'r3',
        text: 'A noble donation! My knights shall defend our grain fields with honor!',
        reward: { gold: 2000, iron: 100 },
        options: [{ text: 'For the Realm!', next: null }]
      }
    ],
    quests: [
      {
        id: 'quest_roderick_1',
        title: 'Arming the Knights',
        description: 'Collect 500 Iron Ore to forge shields for the Royal Guard.',
        requirement: { iron: 500 },
        reward: { gold: 5000, provisions: 2000 }
      },
      {
        id: 'quest_roderick_2',
        title: 'Fortress Garrison',
        description: 'Reach Level 5 Knight Barracks to fortify kingdom walls.',
        requirement: { barracksLevel: 5 },
        reward: { gold: 20000, iron: 2000 }
      },
      {
        id: 'quest_roderick_3',
        title: 'Dragon Slayer Banner',
        description: 'Accumulate 5,000 Iron Ore to arm dragon-slaying ballistas.',
        requirement: { iron: 5000 },
        reward: { gold: 100000, crownJewels: 2 }
      }
    ]
  },
  {
    id: 'isabella',
    name: 'Lady Isabella',
    title: 'Merchant Guildmistress',
    avatar: '⚖️',
    color: '#ffd700',
    dialogues: [
      {
        id: 'i1',
        text: 'Welcome, Sovereign! Caravans from exotic distant lands wish to trade in your Grand Bazaar. Commodity rates fluctuate every few seconds!',
        options: [
          { text: 'How do market trades work?', next: 'i2' },
          { text: 'Here is a trade grant of 1,000 Wood.', next: 'i3' }
        ]
      },
      {
        id: 'i2',
        text: 'Sell surplus Timber, Stone, or Iron in the Grand Bazaar when prices spike high to gain massive Gold profits!',
        options: [{ text: 'I will watch the bazaar prices closely.', next: null }]
      },
      {
        id: 'i3',
        text: 'Splendid timber! Allow me to exchange this for 1,500 Gold Coins directly from the Guild vaults.',
        reward: { gold: 1500 },
        options: [{ text: 'A fine bargain, Lady Isabella.', next: null }]
      }
    ],
    quests: [
      {
        id: 'quest_isabella_1',
        title: 'Grand Trade Order',
        description: 'Accumulate 10,000 Gold Coins in your Treasury to gain Guild favor.',
        requirement: { gold: 10000 },
        reward: { gold: 5000, timber: 2000, stone: 2000 }
      },
      {
        id: 'quest_isabella_2',
        title: 'Interstellar Monopoly',
        description: 'Accumulate 100,000 Gold Coins to control the Trade Guild.',
        requirement: { gold: 100000 },
        reward: { gold: 50000, timber: 10000 }
      },
      {
        id: 'quest_isabella_3',
        title: 'Merchant Guild Investment',
        description: 'Accumulate 500,000 Gold Coins for royal merchant charters.',
        requirement: { gold: 500000 },
        reward: { gold: 200000, crownJewels: 3 }
      }
    ]
  },
  {
    id: 'beatrice',
    name: 'Queen Regent Beatrice',
    title: 'Steward of Kingdom Prosperity',
    avatar: '👑',
    color: '#3a86ef',
    dialogues: [
      {
        id: 'b1',
        text: 'Your Grace! The peasantry thrives under your rule. When your kingdom reaches peak prosperity, you may Found a New Realm to claim Crown Jewels!',
        options: [
          { text: 'What do Crown Jewels do?', next: 'b2' },
          { text: 'How is peasant morale today?', next: 'b3' }
        ]
      },
      {
        id: 'b2',
        text: 'Prestige with Crown Jewels grants permanent legacy multipliers (+100% per Crown Jewel) to all future realm playthroughs!',
        options: [{ text: 'A legacy worthy of kings!', next: null }]
      },
      {
        id: 'b3',
        text: 'Morale is sky-high thanks to abundant Wheat and Provisions! Take this royal boon of 1,000 Provisions.',
        reward: { provisions: 1000 },
        options: [{ text: 'Long live the Kingdom!', next: null }]
      }
    ],
    quests: [
      {
        id: 'quest_beatrice_1',
        title: 'Realm Expansion',
        description: 'Construct at least 5 different building types in your realm.',
        requirement: { buildingTypesCount: 5 },
        reward: { gold: 12000, mana: 1000 }
      },
      {
        id: 'quest_beatrice_2',
        title: 'Peasant Harvest Feast',
        description: 'Accumulate 10,000 Provisions to host a kingdom festival.',
        requirement: { provisions: 10000 },
        reward: { gold: 30000, provisions: 5000 }
      },
      {
        id: 'quest_beatrice_3',
        title: 'Sovereign Coronation',
        description: 'Build Level 1 Royal Citadel to solidify your sovereign throne.',
        requirement: { royalcitadelLevel: 1 },
        reward: { gold: 250000, crownJewels: 5 }
      }
    ]
  }
];

// Buyable Bounty Mercenary Contracts
export const BUYABLE_CONTRACTS = [
  {
    id: 'contract_dragon_hunter',
    title: '🐉 Dragon Hunter Contract',
    buyCost: { gold: 2500 },
    desc: 'Purchase bounty rights to hunt dragons attacking the realm.',
    requirement: { goldGained: 10000 },
    reward: { gold: 15000, mana: 1000 }
  },
  {
    id: 'contract_deep_mine',
    title: '⛏️ Deep Quarry Lease',
    buyCost: { gold: 5000 },
    desc: 'Lease deep underground granite veins for massive stone yields.',
    requirement: { stone: 5000 },
    reward: { gold: 25000, iron: 2000 }
  },
  {
    id: 'contract_arcane_spire',
    title: '🔮 High Arcane Pact',
    buyCost: { gold: 15000 },
    desc: 'Fund Archmage Eldrin\'s secret Ley Line portal research.',
    requirement: { mana: 3000 },
    reward: { gold: 50000, crownJewels: 1 }
  }
];

// Regularly Refreshed Timed Quests Pool
export const TIMED_QUESTS_POOL = [
  { id: 'tq_lumber', title: '🪓 Timber Rush', desc: 'Gather 1,000 Timber Wood before the timer expires!', reqType: 'timber', reqAmount: 1000, reward: { gold: 5000, provisions: 1000 } },
  { id: 'tq_grain', title: '🌾 Grain Storage Bounty', desc: 'Gather 2,000 Provisions for the royal granary!', reqType: 'provisions', reqAmount: 2000, reward: { gold: 8000, timber: 2000 } },
  { id: 'tq_stone', title: '🪨 Fortress Masonry', desc: 'Gather 1,500 Quarry Stone for watchtower repairs!', reqType: 'stone', reqAmount: 1500, reward: { gold: 10000, iron: 500 } },
  { id: 'tq_iron', title: '⚔️ Forge Iron Rush', desc: 'Smelt 800 Iron Ore for paladin weaponry!', reqType: 'iron', reqAmount: 800, reward: { gold: 15000, mana: 800 } },
  { id: 'tq_mana', title: '✨ Arcane Surge', desc: 'Channel 1,000 Arcane Mana before Ley Lines shift!', reqType: 'mana', reqAmount: 1000, reward: { gold: 25000, crownJewels: 1 } }
];

// Seasonal Festive Events
export const SEASONAL_EVENTS = {
  winter: {
    id: 'winter',
    name: 'Midwinter Yule Feast',
    icon: '❄️',
    currency: 'Yule Logs',
    currencyIcon: '🪵',
    color: '#00f5d4',
    bgGradient: 'linear-[#003566], [#001d3d]',
    shopItems: [
      { id: 'frost_skin', name: 'Frost Crystal Castle Skin', cost: 100, desc: 'Covers your Citadel in glittering winter ice.', skin: 'frost' },
      { id: 'yule_multiplier', name: 'Yule Warmth Multiplier', cost: 250, desc: 'All Wheat & Provision yields +100% permanently.', bonus: 'provisions_x2' },
      { id: 'santa_dragon', name: 'Winter Reindeer Dragon', cost: 500, desc: 'A majestic festive dragon that flies over your realm!', pet: 'santa_dragon' }
    ]
  },
  halloween: {
    id: 'halloween',
    name: 'Harvest Moon Outbreak',
    icon: '🎃',
    currency: 'Spooky Pumpkins',
    currencyIcon: '🎃',
    color: '#ffb703',
    bgGradient: 'linear-[#3a0ca3], [#1a002c]',
    shopItems: [
      { id: 'pumpkin_skin', name: 'Haunted Spire Skin', cost: 100, desc: 'Turns Wizard Spires into glowing pumpkin towers.', skin: 'pumpkin' },
      { id: 'spooky_multiplier', name: 'Dark Mana Multiplier', cost: 250, desc: 'Arcane Mana generation +100%.', bonus: 'mana_x2' },
      { id: 'ghost_gryphon', name: 'Phantom Spectral Gryphon', cost: 500, desc: 'Summons a phantom gryphon to patrol the skies.', pet: 'ghost_gryphon' }
    ]
  },
  solstice: {
    id: 'solstice',
    name: 'Spring Maiden Solstice',
    icon: '🌸',
    currency: 'Blossom Garlands',
    currencyIcon: '🌸',
    color: '#ff007f',
    bgGradient: 'linear-[#4d0938], [#1f001a]',
    shopItems: [
      { id: 'blossom_skin', name: 'Royal Garden Sanctuary Skin', cost: 100, desc: 'Adorns the kingdom with cherry blossoms.', skin: 'blossom' },
      { id: 'sun_multiplier', name: 'Solstice Harvest Boon', cost: 250, desc: 'Gold Coins production +100%.', bonus: 'gold_x2' },
      { id: 'fairy_sprite', name: 'Enchanted Fairy Sprites', cost: 500, desc: 'Glowing magical sprites flutter across the town canvas.', pet: 'fairies' }
    ]
  }
};

// Expanded Timed Random Events
export const TIMED_EVENTS = [
  {
    id: 'dragon_attack',
    name: '🔥 DRAGON RAID IN PROGRESS!',
    desc: 'An ancient fiery dragon is attacking kingdom farms! Tap the dragon to extinguish flames or let knights handle it!',
    type: 'alert',
    duration: 30,
    rewardType: 'gold',
    rewardAmount: 2500
  },
  {
    id: 'harvest_bounty',
    name: '🌾 GOLDEN HARVEST MOON BLESSED THE REALM!',
    desc: 'Golden wheat sheaves rain down on the kingdom canvas! Click the falling sheaves for bonus provisions!',
    type: 'bounty',
    duration: 25,
    rewardType: 'provisions',
    rewardAmount: 5000
  },
  {
    id: 'comet_shower',
    name: '💫 ARCANE COMET SHOWER DETECTED!',
    desc: 'Falling glowing comets stream across the sky! Click the falling stars on the canvas for instant Mana & Gold!',
    type: 'comet',
    duration: 35,
    rewardType: 'mana',
    rewardAmount: 3000
  },
  {
    id: 'merchant_caravan',
    name: '🐪 GRAND MERCHANT CARAVAN ARRIVED!',
    desc: 'Exotic merchants offer 50% extra Gold for all resources sold in the Bazaar for the next 2 minutes!',
    type: 'buff',
    duration: 120,
    rewardType: 'trade_boost',
    multiplier: 1.5
  },
  {
    id: 'siege_ambush',
    name: '⚔️ BANDIT SIEGE AMBUSH DETECTED!',
    desc: 'Rogue bandits are trying to raid the Royal Treasury! Capture them by tapping on the canvas map!',
    type: 'minigame',
    duration: 40,
    rewardType: 'gold',
    rewardAmount: 8000
  }
];

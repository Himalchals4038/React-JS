import React, { useEffect, useState } from 'react';
import { SOVEREIGN_CHARACTERS } from '../utils/constants';
import { dbService, MAX_SLOTS } from '../services/database';
import { formatNumber } from '../utils/formatters';
import { audioSynth } from '../utils/audioSynth';
import { Crown, Users, Plus, Trash2, Play, Sparkles, X, Shield, ArrowRight } from 'lucide-react';

export default function CharacterSelectModal({ onSelectProfile, currentActiveSlot, onClose }) {
  const [slotsData, setSlotsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingSlotId, setCreatingSlotId] = useState(null);

  // New Profile Form state
  const [selectedCharId, setSelectedCharId] = useState('arthur');
  const [customRulerName, setCustomRulerName] = useState('');
  const [customRealmName, setCustomRealmName] = useState('');

  const loadSlots = async () => {
    setLoading(true);
    const all = await dbService.listAllSlots();
    setSlotsData(all);
    setLoading(false);
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleStartCreate = (slotId) => {
    const defaultChar = SOVEREIGN_CHARACTERS[0];
    setSelectedCharId(defaultChar.id);
    setCustomRulerName(defaultChar.name);
    setCustomRealmName('Crown Dominion');
    setCreatingSlotId(slotId);
  };

  const handleConfirmCreate = async () => {
    if (!creatingSlotId) return;
    audioSynth.playQuestComplete();

    const charCfg = SOVEREIGN_CHARACTERS.find(c => c.id === selectedCharId) || SOVEREIGN_CHARACTERS[0];

    const newSave = {
      slotId: creatingSlotId,
      characterId: charCfg.id,
      rulerName: customRulerName || charCfg.name,
      realmName: customRealmName || 'Crown Dominion',
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
        windmill: { level: 0, hasManager: false },
        ironmine: { level: 0, hasManager: false },
        goldmint: { level: 0, hasManager: false },
        wizardtower: { level: 0, hasManager: false },
        barracks: { level: 0, hasManager: false },
        merchantguild: { level: 0, hasManager: false },
        dragonsanctuary: { level: 0, hasManager: false },
        royalcitadel: { level: 0, hasManager: false }
      },
      autoHarvesters: {
        golem: charCfg.freeHarvesterLevel || 0,
        arcane_clicker: 0,
        tax_drone: 0
      },
      unlockedTechs: [],
      crownJewels: 0,
      completedQuests: [],
      activeSeasonalEvent: 'winter',
      seasonalCurrencies: { winter: 50, halloween: 0, solstice: 0 },
      purchasedSkins: [],
      activeSkin: 'default',
      activeCrest: 'lion',
      weather: 'sunny',
      timeOfDay: 'day',
      lastSaveTime: Date.now()
    };

    await dbService.saveSlot(creatingSlotId, newSave);
    setCreatingSlotId(null);
    onSelectProfile(newSave, creatingSlotId);
  };

  const handleDelete = async (slotId, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete profile slot ${slotId}? This action cannot be undone.`)) {
      audioSynth.playClick();
      await dbService.deleteSlot(slotId);
      loadSlots();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users color="#ffd700" size={26} />
            <h2 className="font-royal text-gold" style={{ fontSize: '1.4rem' }}>
              Sovereign Profiles & Character Select
            </h2>
          </div>
          {onClose && (
            <button className="btn-medieval" style={{ padding: '6px' }} onClick={onClose}>
              <X size={18} />
            </button>
          )}
        </div>

        <div className="modal-body">
          {/* Creation Form Modal Subview */}
          {creatingSlotId ? (
            <div>
              <h3 className="font-royal text-gold" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
                Create New Sovereign Character (Slot {creatingSlotId.replace('slot_', '')})
              </h3>

              {/* Character Picker Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {SOVEREIGN_CHARACTERS.map((char) => {
                  const isSelected = selectedCharId === char.id;
                  return (
                    <div
                      key={char.id}
                      onClick={() => {
                        audioSynth.playClick();
                        setSelectedCharId(char.id);
                        setCustomRulerName(char.name);
                      }}
                      style={{
                        background: isSelected ? 'linear-gradient(180deg, #5c3514 0%, #381f09 100%)' : 'rgba(0,0,0,0.4)',
                        border: isSelected ? `2px solid ${char.portraitColor}` : '1px solid #4a2e12',
                        borderRadius: '10px',
                        padding: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ fontSize: '2rem' }}>{char.avatar}</div>
                        <div>
                          <div className="font-medieval" style={{ color: isSelected ? '#ffffff' : 'var(--text-muted)', fontSize: '1rem' }}>
                            {char.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: char.portraitColor }}>
                            {char.title}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: `1px solid ${char.portraitColor}40`,
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '0.75rem'
                      }}>
                        <strong style={{ color: char.portraitColor }}>Trait: {char.traitName}</strong>
                        <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{char.traitDesc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Name & Realm Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Sovereign Name:
                  </label>
                  <input
                    type="text"
                    value={customRulerName}
                    onChange={e => setCustomRulerName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.6)',
                      border: '1px solid #b8860b',
                      borderRadius: '6px',
                      padding: '10px',
                      color: '#ffffff',
                      fontFamily: 'var(--font-medieval)',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Realm Name:
                  </label>
                  <input
                    type="text"
                    value={customRealmName}
                    onChange={e => setCustomRealmName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.6)',
                      border: '1px solid #b8860b',
                      borderRadius: '6px',
                      padding: '10px',
                      color: '#ffffff',
                      fontFamily: 'var(--font-medieval)',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn-medieval" onClick={() => setCreatingSlotId(null)}>
                  Cancel
                </button>
                <button className="btn-medieval btn-gold pulse-glow" onClick={handleConfirmCreate}>
                  Confirm & Found Realm <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Select a kingdom profile slot to resume your sovereign reign, or create a brand new character.
              </p>

              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading Character Slots...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Array.from({ length: MAX_SLOTS }, (_, i) => {
                    const slotId = `slot_${i + 1}`;
                    const slotData = slotsData.find(s => s.slotId === slotId);
                    const isActive = currentActiveSlot === slotId;

                    const charCfg = slotData ? SOVEREIGN_CHARACTERS.find(c => c.id === slotData.characterId) : null;

                    return (
                      <div
                        key={slotId}
                        style={{
                          background: slotData ? 'rgba(45, 27, 14, 0.9)' : 'rgba(0,0,0,0.3)',
                          border: isActive ? '2px solid #ffd700' : slotData ? '1px solid #4a2e12' : '1px dashed #3a2008',
                          borderRadius: '12px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px'
                        }}
                      >
                        {slotData ? (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{ fontSize: '2.5rem' }}>{charCfg?.avatar || '👑'}</div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <h3 className="font-medieval text-gold" style={{ fontSize: '1.2rem' }}>
                                    {slotData.realmName}
                                  </h3>
                                  {isActive && (
                                    <span style={{ background: '#2a9d8f', color: '#ffffff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px' }}>
                                      Active Run
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                  Ruler: <strong style={{ color: '#ffffff' }}>{slotData.rulerName}</strong> ({charCfg?.name})
                                </div>
                                <div style={{ fontSize: '0.75rem', color: charCfg?.portraitColor || '#ffd700', marginTop: '2px' }}>
                                  Trait: {charCfg?.traitName} • Gold: {formatNumber(slotData.gold || 0)} • Jewels: {slotData.crownJewels || 0} 💎
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <button
                                className="btn-medieval btn-gold"
                                onClick={() => {
                                  audioSynth.playClick();
                                  onSelectProfile(slotData.data, slotId);
                                }}
                              >
                                <Play size={16} /> Load Kingdom
                              </button>
                              <button
                                className="btn-medieval btn-crimson"
                                style={{ padding: '8px' }}
                                onClick={e => handleDelete(slotId, e)}
                                title="Delete Character Slot"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <h4 className="font-medieval" style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                                Empty Slot {i + 1}
                              </h4>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Start a fresh kingdom run with any Sovereign character.
                              </span>
                            </div>

                            <button
                              className="btn-medieval"
                              onClick={() => {
                                audioSynth.playClick();
                                handleStartCreate(slotId);
                              }}
                            >
                              <Plus size={16} /> Create Character
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

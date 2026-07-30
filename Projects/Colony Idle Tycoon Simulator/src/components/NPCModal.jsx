import React, { useEffect, useState } from 'react';
import { NPCS, BUYABLE_CONTRACTS, TIMED_QUESTS_POOL, RESOURCES } from '../utils/constants';
import { formatNumber, formatTime } from '../utils/formatters';
import { audioSynth } from '../utils/audioSynth';
import { Users, X, MessageSquare, Award, CheckCircle, ShoppingBag, Clock, RefreshCw, Scroll } from 'lucide-react';

export default function NPCModal({ gameState, onClose, onClaimNPCBonus, onClaimQuest, onBuyContract }) {
  const [activeSubTab, setActiveSubTab] = useState('council'); // 'council' | 'buyable' | 'timed'
  const [selectedNpcId, setSelectedNpcId] = useState('eldrin');
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState('e1');

  // Timed quest refresh system state
  const [refreshCountdown, setRefreshCountdown] = useState(60);
  const [activeTimedQuests, setActiveTimedQuests] = useState([]);

  const selectedNpc = NPCS.find(n => n.id === selectedNpcId) || NPCS[0];
  const { completedQuests = [], purchasedContracts = [], resources = {} } = gameState;

  // Active step in NPC dialogue tree
  const activeStep = selectedNpc.dialogues.find(d => d.id === currentDialogueIdx) || selectedNpc.dialogues[0];

  // Refresh timed quests
  const refreshTimedQuestsList = () => {
    // Pick 3 random timed quests from pool
    const shuffled = [...TIMED_QUESTS_POOL].sort(() => 0.5 - Math.random());
    setActiveTimedQuests(shuffled.slice(0, 3));
    setRefreshCountdown(60);
  };

  useEffect(() => {
    refreshTimedQuestsList();
  }, []);

  // 1-second countdown for timed quest refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          refreshTimedQuestsList();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const checkQuestRequirement = (req) => {
    return Object.entries(req).every(([reqKey, reqVal]) => {
      if (reqKey === 'buildingTypesCount') {
        const count = Object.values(gameState.buildings || {}).filter(b => b.level > 0).length;
        return count >= reqVal;
      }
      if (reqKey.endsWith('Level')) {
        const buildingId = reqKey.replace('Level', '');
        return (gameState.buildings?.[buildingId]?.level || 0) >= reqVal;
      }
      return (resources[reqKey] || 0) >= reqVal;
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '920px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users color="#2a9d8f" size={26} />
            <h2 className="font-royal text-gold" style={{ fontSize: '1.3rem' }}>
              Royal Council & Quests Bureau
            </h2>
          </div>
          <button className="btn-medieval" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Sub-Tab Navigation Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[
              { id: 'council', label: 'Council Dialogues & Story Quests', icon: Users, color: '#2a9d8f' },
              { id: 'buyable', label: 'Buyable Bounty Contracts', icon: ShoppingBag, color: '#ffd700' },
              { id: 'timed', label: 'Timed Refreshed Quests', icon: Clock, color: '#ff007f' }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isSel = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`btn-medieval ${isSel ? 'btn-gold' : ''}`}
                  onClick={() => { audioSynth.playClick(); setActiveSubTab(tab.id); }}
                  style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '0.85rem' }}
                >
                  <TabIcon size={16} color={isSel ? '#000000' : tab.color} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: Council Dialogues & Story Quests */}
          {activeSubTab === 'council' && (
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
              {/* NPC Selector List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid #4a2e12', paddingRight: '16px' }}>
                {NPCS.map(npc => (
                  <button
                    key={npc.id}
                    onClick={() => {
                      audioSynth.playClick();
                      setSelectedNpcId(npc.id);
                      setCurrentDialogueIdx(npc.dialogues[0].id);
                    }}
                    style={{
                      background: selectedNpcId === npc.id ? 'linear-gradient(180deg, #5c3514 0%, #381f09 100%)' : 'rgba(0,0,0,0.3)',
                      border: selectedNpcId === npc.id ? `2px solid ${npc.color}` : '1px solid #4a2e12',
                      borderRadius: '8px',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '1.8rem' }}>{npc.avatar}</div>
                    <div>
                      <div className="font-medieval" style={{ color: selectedNpcId === npc.id ? '#ffffff' : 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {npc.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: npc.color }}>
                        {npc.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Interactive Dialogue & Story Quests Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* NPC Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '2.5rem' }}>{selectedNpc.avatar}</div>
                  <div>
                    <h3 className="font-royal text-gold" style={{ fontSize: '1.2rem' }}>{selectedNpc.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: selectedNpc.color }}>{selectedNpc.title}</div>
                  </div>
                </div>

                {/* Dialogue Parchment Box */}
                <div style={{
                  background: '#f4e4bc',
                  color: '#2b170a',
                  border: '2px solid #b8860b',
                  borderRadius: '10px',
                  padding: '14px',
                  fontFamily: 'var(--font-fantasy)',
                  fontSize: '1.05rem',
                  lineHeight: '1.4'
                }}>
                  <MessageSquare size={16} color="#b8860b" style={{ display: 'inline', marginRight: '6px' }} />
                  "{activeStep.text}"
                </div>

                {/* Dialogue Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeStep.options.map((opt, idx) => (
                    <button
                      key={idx}
                      className="btn-medieval"
                      style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '8px 12px' }}
                      onClick={() => {
                        audioSynth.playClick();
                        if (activeStep.reward) {
                          audioSynth.playCoin();
                          onClaimNPCBonus(activeStep.reward);
                        }
                        if (opt.next) {
                          setCurrentDialogueIdx(opt.next);
                        } else {
                          setCurrentDialogueIdx(selectedNpc.dialogues[0].id);
                        }
                      }}
                    >
                      👉 {opt.text}
                    </button>
                  ))}
                </div>

                {/* Story Quests List */}
                <h4 className="font-medieval text-gold" style={{ fontSize: '1rem', marginTop: '8px' }}>
                  📜 {selectedNpc.name}'s Story Quests:
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedNpc.quests.map((q) => {
                    const isDone = completedQuests.includes(q.id);
                    const canClaim = !isDone && checkQuestRequirement(q.requirement);

                    return (
                      <div
                        key={q.id}
                        style={{
                          background: 'rgba(0,0,0,0.5)',
                          border: isDone ? '1px solid #2a9d8f' : '1px solid #4a2e12',
                          borderRadius: '8px',
                          padding: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span className="font-medieval" style={{ color: '#ffffff', fontSize: '0.95rem' }}>{q.title}</span>
                          {isDone && <span style={{ color: '#2a9d8f', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Completed</span>}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{q.description}</p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {Object.entries(q.reward).map(([rId, amt]) => (
                              <span key={rId} style={{ fontSize: '0.75rem', color: '#ffd700', background: 'rgba(255, 215, 0, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #b8860b' }}>
                                +{formatNumber(amt)} {RESOURCES[rId]?.name || rId}
                              </span>
                            ))}
                          </div>

                          {!isDone && (
                            <button
                              className="btn-medieval btn-gold"
                              disabled={!canClaim}
                              onClick={() => {
                                audioSynth.playQuestComplete();
                                onClaimQuest(q.id, q.reward);
                              }}
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            >
                              Claim Reward
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Buyable Bounty Mercenary Contracts */}
          {activeSubTab === 'buyable' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Purchase lucrative royal mercenary licenses with Gold Coins. Completing contract objectives awards massive Gold, Mana, and Crown Jewels!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {BUYABLE_CONTRACTS.map(contract => {
                  const isBought = purchasedContracts.includes(contract.id);
                  const canAffordBuy = (resources.gold || 0) >= contract.buyCost.gold;
                  const isCompleted = completedQuests.includes(contract.id);
                  const canClaimReward = isBought && !isCompleted && checkQuestRequirement(contract.requirement);

                  return (
                    <div
                      key={contract.id}
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: isCompleted ? '1px solid #2a9d8f' : isBought ? '1px solid #ffd700' : '1px solid #4a2e12',
                        borderRadius: '10px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h3 className="font-medieval text-gold" style={{ fontSize: '1.1rem' }}>
                            {contract.title}
                          </h3>
                          {isCompleted && (
                            <span style={{ color: '#2a9d8f', fontSize: '0.75rem', fontWeight: 'bold' }}>✓ COMPLETED</span>
                          )}
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 8px 0' }}>
                          {contract.desc}
                        </p>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          {Object.entries(contract.reward).map(([rId, amt]) => (
                            <span key={rId} style={{ fontSize: '0.75rem', color: '#2a9d8f', background: 'rgba(42, 157, 143, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid #2a9d8f' }}>
                              Reward: +{formatNumber(amt)} {RESOURCES[rId]?.name || rId}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        {!isBought ? (
                          <button
                            className="btn-medieval btn-gold"
                            disabled={!canAffordBuy}
                            onClick={() => {
                              if (canAffordBuy) {
                                audioSynth.playCoin();
                                onBuyContract(contract.id, contract.buyCost.gold);
                              }
                            }}
                          >
                            Buy Contract ({formatNumber(contract.buyCost.gold)} Gold)
                          </button>
                        ) : isCompleted ? (
                          <span style={{ color: '#2a9d8f', fontWeight: 'bold' }}>Finished</span>
                        ) : (
                          <button
                            className="btn-medieval btn-gold"
                            disabled={!canClaimReward}
                            onClick={() => {
                              if (canClaimReward) {
                                audioSynth.playQuestComplete();
                                onClaimQuest(contract.id, contract.reward);
                              }
                            }}
                          >
                            Claim Contract Reward
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Timed Regularly Refreshed Quests */}
          {activeSubTab === 'timed' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 className="font-medieval text-gold" style={{ fontSize: '1.1rem' }}>
                    ⏳ Regularly Refreshed Kingdom Quests
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Complete these short-term emergency quests before the timer refreshes new objectives!
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#ff007f', fontWeight: 'bold' }}>
                    Auto-Refresh in: {refreshCountdown}s
                  </span>

                  <button
                    className="btn-medieval"
                    onClick={() => { audioSynth.playClick(); refreshTimedQuestsList(); }}
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    <RefreshCw size={14} /> Refresh Now
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeTimedQuests.map((tq) => {
                  const owned = resources[tq.reqType] || 0;
                  const canClaim = owned >= tq.reqAmount;
                  const isClaimed = completedQuests.includes(tq.id);

                  return (
                    <div
                      key={tq.id}
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: isClaimed ? '1px solid #2a9d8f' : '1px solid #ff007f80',
                        borderRadius: '10px',
                        padding: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div>
                        <h4 className="font-medieval" style={{ color: '#ffffff', fontSize: '1rem' }}>
                          {tq.title}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 6px 0' }}>
                          {tq.desc}
                        </p>

                        <div style={{ fontSize: '0.75rem', color: canClaim ? '#2a9d8f' : '#ff8fa3' }}>
                          Progress: {formatNumber(owned)} / {formatNumber(tq.reqAmount)} {RESOURCES[tq.reqType]?.name}
                        </div>
                      </div>

                      <div>
                        {isClaimed ? (
                          <span style={{ color: '#2a9d8f', fontWeight: 'bold' }}>Claimed ✓</span>
                        ) : (
                          <button
                            className="btn-medieval btn-gold"
                            disabled={!canClaim}
                            onClick={() => {
                              if (canClaim) {
                                audioSynth.playQuestComplete();
                                onClaimQuest(tq.id, tq.reward);
                              }
                            }}
                          >
                            Claim Rewards
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

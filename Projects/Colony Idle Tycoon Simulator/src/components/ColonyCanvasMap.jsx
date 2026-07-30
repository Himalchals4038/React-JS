import React, { useEffect, useRef, useState } from 'react';
import { audioSynth } from '../utils/audioSynth';
import { CASTLE_SKINS, CREST_BANNERS } from '../utils/constants';

// Ambient Dialogue Pairs between Kingdom NPCs
const MAP_NPC_BANTER = [
  { p1: 'Knight', p2: 'Peasant', line: 'Halt! The Royal Guards protect this realm!' },
  { p1: 'Peasant', p2: 'Knight', line: 'Long live the Sovereign! Our crops flourish!' },
  { p1: 'Wizard', p2: 'Knight', line: 'I sense ancient Ley Line mana beneath the Citadel...' },
  { p1: 'Merchant', p2: 'Wizard', line: 'Looking for rare arcane crystals, Archmage?' },
  { p1: 'Blacksmith', p2: 'Peasant', line: 'The forge is hot! Steel armor is ready!' },
  { p1: 'Crier', p2: 'All', line: 'Hear ye, hear ye! Sovereign glory fills the land!' },
  { p1: 'Wizard', p2: 'Merchant', line: 'The stars align for a prosperous harvest!' },
  { p1: 'Knight', p2: 'Blacksmith', line: 'Sharpen my broadsword for the next dragon raid!' }
];

export default function ColonyCanvasMap({ gameState, onTapKingdom, activeTimedEvent, onResolveEvent }) {
  const canvasRef = useRef(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [activeSpeechBubbles, setActiveSpeechBubbles] = useState([]);

  // Animation Engine State Ref
  const animRef = useRef({
    windmillAngle: 0,
    waterwheelAngle: 0,
    riverOffset: 0,
    smokeParticles: Array.from({ length: 15 }, () => ({ x: 260, y: 150 - Math.random() * 40, opacity: Math.random() })),
    dragonX: -150,
    dragonY: 120,
    cometY: -50,
    cometX: 400,
    weatherParticles: Array.from({ length: 45 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 700,
      speed: 1 + Math.random() * 3,
      size: 2 + Math.random() * 3
    })),
    // Interactive Walking NPCs
    mapNpcs: [
      { id: 'n1', name: 'Sir Roderick', role: 'Knight', avatar: '⚔️', x: 250, y: 350, targetX: 650, targetY: 380, speed: 1.1, color: '#e63946', talking: false },
      { id: 'n2', name: 'Peasant Barnaby', role: 'Peasant', avatar: '🌾', x: 680, y: 390, targetX: 200, targetY: 330, speed: 0.9, color: '#e6b800', talking: false },
      { id: 'n3', name: 'Archmage Eldrin', role: 'Wizard', avatar: '🔮', x: 1100, y: 480, targetX: 700, targetY: 360, speed: 0.8, color: '#9370db', talking: false },
      { id: 'n4', name: 'Lady Isabella', role: 'Merchant', avatar: '⚖️', x: 750, y: 370, targetX: 1150, targetY: 450, speed: 1.0, color: '#ffd700', talking: false },
      { id: 'n5', name: 'Blacksmith Vorn', role: 'Blacksmith', avatar: '🔨', x: 300, y: 520, targetX: 720, targetY: 400, speed: 0.85, color: '#708090', talking: false },
      { id: 'n6', name: 'Town Crier', role: 'Crier', avatar: '📜', x: 500, y: 300, targetX: 900, targetY: 320, speed: 1.0, color: '#2a9d8f', talking: false }
    ],
    lastBanterTime: 0
  });

  const skinCfg = CASTLE_SKINS.find(s => s.id === (gameState.activeSkin || 'default')) || CASTLE_SKINS[0];
  const crestCfg = CREST_BANNERS.find(c => c.id === (gameState.activeCrest || 'lion')) || CREST_BANNERS[0];
  const weather = gameState.weather || 'sunny';
  const timeOfDay = gameState.timeOfDay || 'day';

  // Handle map click
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = 1400 / rect.width;
    const scaleY = 700 / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    audioSynth.playClick();
    if (Math.random() < 0.35) audioSynth.playCoin();

    // Check if clicked an NPC walking on map
    const clickedNpc = animRef.current.mapNpcs.find(npc => Math.hypot(x - npc.x, y - npc.y) < 35);
    if (clickedNpc) {
      audioSynth.playClick();
      addSpeechBubble(clickedNpc.x, clickedNpc.y - 30, `${clickedNpc.avatar} ${clickedNpc.name}: "Long live the Sovereign!"`, clickedNpc.color);
      return;
    }

    // Check timed events (Dragon, Comet)
    if (activeTimedEvent) {
      if (activeTimedEvent.id === 'dragon_attack') {
        const { dragonX, dragonY } = animRef.current;
        if (Math.hypot(x - dragonX, y - dragonY) < 80) {
          audioSynth.playDragonRoar();
          onResolveEvent(activeTimedEvent);
          addFloatingText(x, y, `🔥 DRAGON DEFEATED! +${activeTimedEvent.rewardAmount} Gold`, '#ffd700');
          return;
        }
      } else if (activeTimedEvent.id === 'comet_shower') {
        const { cometX, cometY } = animRef.current;
        if (Math.hypot(x - cometX, y - cometY) < 70) {
          audioSynth.playQuestComplete();
          onResolveEvent(activeTimedEvent);
          addFloatingText(x, y, `💫 COMET HARVESTED! +${activeTimedEvent.rewardAmount} Mana`, '#9370db');
          return;
        }
      }
    }

    onTapKingdom();
    const gains = ['+15 Timber 🪓', '+10 Stone 🪨', '+12 Grain 🌾', '+25 Gold 💰'];
    addFloatingText(x, y, gains[Math.floor(Math.random() * gains.length)], '#ffd700');
  };

  const addFloatingText = (x, y, text, color) => {
    const newText = { id: Date.now() + Math.random(), x, y, text, color, opacity: 1 };
    setFloatingTexts(prev => [...prev.slice(-20), newText]);
  };

  const addSpeechBubble = (x, y, text, color) => {
    const bubble = { id: Date.now() + Math.random(), x, y, text, color, expiresAt: Date.now() + 4000 };
    setActiveSpeechBubbles(prev => [...prev.slice(-4), bubble]);
  };

  // Fade floating texts
  useEffect(() => {
    if (floatingTexts.length === 0) return;
    const interval = setInterval(() => {
      setFloatingTexts(prev =>
        prev
          .map(ft => ({ ...ft, y: ft.y - 1.5, opacity: ft.opacity - 0.03 }))
          .filter(ft => ft.opacity > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [floatingTexts.length]);

  // Clean expired speech bubbles
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSpeechBubbles(prev => prev.filter(b => Date.now() < b.expiresAt));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Main 60 FPS HD Kingdom Canvas Render Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const w = 1400;
      const h = 700;

      // 1. Kingdom Lush Grassland Base
      ctx.fillStyle = timeOfDay === 'night' ? '#0f1c10' : '#274221';
      ctx.fillRect(0, 0, w, h);

      // Detailed Modular Field Tiles
      for (let x = 0; x < w; x += 60) {
        for (let y = 0; y < h; y += 60) {
          ctx.fillStyle = (x + y) % 120 === 0 ? (timeOfDay === 'night' ? '#0c170d' : '#223b1c') : (timeOfDay === 'night' ? '#112112' : '#2a4724');
          ctx.fillRect(x, y, 60, 60);
        }
      }

      // 2. Surrounding Kingdom Stone Defense Walls & Watchtowers
      drawKingdomFortressWalls(ctx, w, h, skinCfg);

      // 3. Granular Cobblestone Highways & Lantern Post Light Halos
      drawCobblestoneHighways(ctx, w, h, timeOfDay);

      // 4. Winding Animated River & Waterwheel Splashing Water
      animRef.current.riverOffset += 0.7;
      drawAnimatedKingdomRiver(ctx, w, h, animRef.current.riverOffset);

      // 5. Render Full Kingdom Buildings
      const bState = gameState.buildings || {};

      // Royal Grand Palace Citadel (Center)
      drawFullKingdomPalace(ctx, w / 2 - 110, h / 2 - 120, bState.royalcitadel?.level || 0, skinCfg, crestCfg, timeOfDay);

      // Timber Mill & Woodcutter Lodge (Top Left)
      drawFullKingdomLumberyard(ctx, 160, 100, bState.lumberyard?.level || 0, animRef.current.smokeParticles);

      // Granite Stone Quarry & Crane (Bottom Left)
      drawFullKingdomQuarry(ctx, 180, h - 230, bState.quarry?.level || 0);

      // Windmill & Flour Mill (Top Right)
      animRef.current.windmillAngle += 0.035;
      drawFullKingdomWindmill(ctx, w - 240, 100, bState.windmill?.level || 0, animRef.current.windmillAngle);

      // Arcane Wizard Spire & Mana Crystals (Bottom Right)
      drawFullKingdomWizardSpire(ctx, w - 220, h - 250, bState.wizardtower?.level || 0, timeOfDay);

      // Merchant Market Stalls (Right of Citadel)
      drawKingdomMarketStalls(ctx, w / 2 + 160, h / 2 - 20);

      // Knight Barracks & Defense Posts (Left of Citadel)
      drawKingdomKnightBarracks(ctx, w / 2 - 320, h / 2 + 20, bState.barracks?.level || 0);

      // 6. Update & Render Walking NPCs + Inter-NPC Banter
      const npcs = animRef.current.mapNpcs;
      const now = Date.now();

      npcs.forEach(npc => {
        // Move toward waypoint
        const dx = npc.targetX - npc.x;
        const dy = npc.targetY - npc.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 8) {
          // Pick new waypoint along cobblestone road
          npc.targetX = 200 + Math.random() * 1000;
          npc.targetY = 150 + Math.random() * 400;
        } else {
          npc.x += (dx / dist) * npc.speed;
          npc.y += (dy / dist) * npc.speed;
        }

        // Draw Detailed NPC Character Sprite
        ctx.save();
        ctx.translate(npc.x, npc.y);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath(); ctx.ellipse(0, 10, 12, 5, 0, 0, Math.PI * 2); ctx.fill();

        // NPC Body Aura/Clothing
        ctx.fillStyle = npc.color;
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Avatar Symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(npc.avatar, 0, 0);

        // Name tag
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(-30, -26, 60, 14);
        ctx.fillStyle = '#ffd700';
        ctx.font = '10px var(--font-medieval)';
        ctx.fillText(npc.name, 0, -19);

        ctx.restore();
      });

      // Check proximity between NPCs to trigger banter speech bubbles!
      if (now - animRef.current.lastBanterTime > 8000) {
        for (let i = 0; i < npcs.length; i++) {
          for (let j = i + 1; j < npcs.length; j++) {
            const n1 = npcs[i];
            const n2 = npcs[j];
            const d = Math.hypot(n1.x - n2.x, n1.y - n2.y);
            if (d < 75) {
              const banter = MAP_NPC_BANTER[Math.floor(Math.random() * MAP_NPC_BANTER.length)];
              addSpeechBubble((n1.x + n2.x) / 2, Math.min(n1.y, n2.y) - 30, `${n1.avatar} ${n1.name}: "${banter.line}"`, n1.color);
              animRef.current.lastBanterTime = now;
              break;
            }
          }
        }
      }

      // 7. Active Timed Events (Dragon / Comet)
      if (activeTimedEvent && activeTimedEvent.id === 'dragon_attack') {
        animRef.current.dragonX += 4.5;
        if (animRef.current.dragonX > w + 180) animRef.current.dragonX = -180;
        const dX = animRef.current.dragonX;
        const dY = 130 + Math.sin(dX / 50) * 45;
        animRef.current.dragonY = dY;
        drawHDDragon(ctx, dX, dY);
      }

      if (activeTimedEvent && activeTimedEvent.id === 'comet_shower') {
        animRef.current.cometY += 5.5;
        if (animRef.current.cometY > h + 50) {
          animRef.current.cometY = -50;
          animRef.current.cometX = 250 + Math.random() * 900;
        }
        drawHDComet(ctx, animRef.current.cometX, animRef.current.cometY);
      }

      // 8. Weather Particle Engine
      ctx.fillStyle = weather === 'rainy' ? 'rgba(180, 220, 255, 0.75)' : weather === 'snowy' ? '#ffffff' : '#ffd700';
      animRef.current.weatherParticles.forEach(p => {
        p.y += p.speed;
        if (p.y > h) { p.y = -10; p.x = Math.random() * w; }
        if (weather === 'rainy') ctx.fillRect(p.x, p.y, 2, 12);
        else if (weather === 'snowy') { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
        else if (weather === 'eclipse') { ctx.fillStyle = '#9370db'; ctx.fillRect(p.x, p.y, 3, 3); }
      });

      // 9. Night Time Lighting Overlay
      if (timeOfDay === 'night') {
        ctx.fillStyle = 'rgba(8, 4, 18, 0.65)';
        ctx.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [gameState.buildings, gameState.activeSkin, gameState.activeCrest, weather, timeOfDay, activeTimedEvent]);

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '14px', overflow: 'hidden', border: '3px solid #b8860b', boxShadow: '0 12px 50px rgba(0,0,0,0.9)' }}>
      <canvas
        ref={canvasRef}
        width={1400}
        height={700}
        onClick={handleCanvasClick}
        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
      />

      {/* Speech Bubbles HTML Overlay */}
      {activeSpeechBubbles.map(b => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            left: `${(b.x / 1400) * 100}%`,
            top: `${(b.y / 700) * 100}%`,
            background: 'rgba(20, 10, 5, 0.92)',
            border: `2px solid ${b.color}`,
            borderRadius: '12px',
            padding: '6px 12px',
            color: '#ffffff',
            fontFamily: 'var(--font-fantasy)',
            fontSize: '0.85rem',
            pointerEvents: 'none',
            boxShadow: `0 4px 15px ${b.color}50`,
            transform: 'translate(-50%, -100%)',
            animation: 'fadeIn 0.2s ease-out',
            whiteSpace: 'nowrap',
            zIndex: 30
          }}
        >
          {b.text}
        </div>
      ))}

      {/* Floating text elements */}
      {floatingTexts.map(ft => (
        <div
          key={ft.id}
          style={{
            position: 'absolute',
            left: `${(ft.x / 1400) * 100}%`,
            top: `${(ft.y / 700) * 100}%`,
            color: ft.color,
            fontFamily: 'var(--font-medieval)',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            pointerEvents: 'none',
            opacity: ft.opacity,
            textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 12px #ffd700',
            transform: 'translate(-50%, -100%)',
            zIndex: 40
          }}
        >
          {ft.text}
        </div>
      ))}

      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        background: 'rgba(0,0,0,0.8)',
        border: '1px solid #b8860b',
        borderRadius: '8px',
        padding: '8px 14px',
        fontSize: '0.85rem',
        color: '#ffd700',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🏰 Full Kingdom View • Citizens & Knights patrol roads and converse! Tap NPCs or kingdom canvas!
      </div>
    </div>
  );
}

// ----------------------------------------------------
// FULL KINGDOM CANVAS GRAPHICS RENDER FUNCTIONS
// ----------------------------------------------------

function drawKingdomFortressWalls(ctx, w, h, skin) {
  ctx.save();
  ctx.strokeStyle = skin.border;
  ctx.fillStyle = skin.primary;
  ctx.lineWidth = 12;

  // Outer Kingdom Wall Border
  ctx.strokeRect(20, 20, w - 40, h - 40);

  // Corner Watchtowers
  const towers = [[20, 20], [w - 20, 20], [20, h - 20], [w - 20, h - 20]];
  towers.forEach(([tx, ty]) => {
    ctx.beginPath(); ctx.arc(tx, ty, 28, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 3; ctx.stroke();
    // Conical Roof
    ctx.fillStyle = '#800020';
    ctx.beginPath(); ctx.arc(tx, ty, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = skin.primary;
  });

  ctx.restore();
}

function drawCobblestoneHighways(ctx, w, h, timeOfDay) {
  ctx.save();
  // Cobblestone Main Road
  ctx.fillStyle = '#6b533e';
  ctx.beginPath();
  ctx.moveTo(80, h / 2);
  ctx.bezierCurveTo(450, h / 3, 950, (2 * h) / 3, w - 80, h / 2);
  ctx.lineWidth = 50;
  ctx.strokeStyle = '#574230';
  ctx.stroke();

  ctx.strokeStyle = '#856a52';
  ctx.lineWidth = 38;
  ctx.stroke();

  // Lantern Post Light Halos at night
  if (timeOfDay === 'night') {
    const posts = [[300, 320], [700, 360], [1100, 340]];
    posts.forEach(([px, py]) => {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
      ctx.beginPath(); ctx.arc(px, py, 45, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(px - 2, py - 12, 4, 14);
    });
  }

  ctx.restore();
}

function drawAnimatedKingdomRiver(ctx, w, h, offset) {
  ctx.save();
  ctx.strokeStyle = '#1d70a2';
  ctx.lineWidth = 44;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 180, 0);
  ctx.quadraticCurveTo(w / 2 + 120, h / 2, w / 2 - 140, h);
  ctx.stroke();

  ctx.strokeStyle = '#64dfdf';
  ctx.lineWidth = 4;
  ctx.setLineDash([15, 20]);
  ctx.lineDashOffset = -offset;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawFullKingdomPalace(ctx, x, y, level, skin, crest, timeOfDay) {
  ctx.save();
  ctx.translate(x, y);

  // Main Palace Keep Base
  ctx.fillStyle = skin.primary;
  ctx.fillRect(0, 30, 220, 140);
  ctx.strokeStyle = skin.border;
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 30, 220, 140);

  // Side Towers
  ctx.fillRect(-35, 0, 50, 170); ctx.strokeRect(-35, 0, 50, 170);
  ctx.fillRect(205, 0, 50, 170); ctx.strokeRect(205, 0, 50, 170);

  // Roof Spires
  ctx.fillStyle = '#800020';
  ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-10, -55); ctx.lineTo(20, 0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(200, 0); ctx.lineTo(230, -55); ctx.lineTo(260, 0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(60, 30); ctx.lineTo(110, -35); ctx.lineTo(160, 30); ctx.fill();

  // Crest Banner
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(107, -70, 6, 40);
  ctx.fillStyle = crest.color;
  ctx.beginPath(); ctx.moveTo(113, -70); ctx.lineTo(150, -50); ctx.lineTo(113, -30); ctx.fill();

  // Windows with interior golden glow
  ctx.fillStyle = timeOfDay === 'night' ? '#ffd700' : '#457b9d';
  for (let wx = 20; wx <= 180; wx += 45) {
    ctx.fillRect(wx, 60, 20, 35);
  }

  // Palace Grand Gate
  ctx.fillStyle = '#3a2008';
  ctx.fillRect(85, 110, 50, 60);
  ctx.strokeStyle = '#ffd700';
  ctx.strokeRect(85, 110, 50, 60);

  ctx.restore();
}

function drawFullKingdomLumberyard(ctx, x, y, level, smokeParticles) {
  ctx.save();
  ctx.translate(x, y);

  // Wooden Cabin
  ctx.fillStyle = '#6b441a';
  ctx.fillRect(0, 0, 110, 80);
  ctx.fillStyle = '#3a2008';
  ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(55, -45); ctx.lineTo(125, 0); ctx.fill();

  // Stacked Log Pile
  ctx.fillStyle = '#a0522d';
  ctx.beginPath(); ctx.arc(20, 95, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(45, 95, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(70, 95, 12, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

function drawFullKingdomQuarry(ctx, x, y, level) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#444444';
  ctx.beginPath(); ctx.ellipse(70, 40, 75, 40, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#9e9e9e';
  ctx.fillRect(15, 20, 35, 25); ctx.fillRect(80, 25, 40, 30);

  ctx.restore();
}

function drawFullKingdomWindmill(ctx, x, y, level, angle) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#d4a373';
  ctx.beginPath(); ctx.moveTo(20, 120); ctx.lineTo(40, 0); ctx.lineTo(80, 0); ctx.lineTo(100, 120); ctx.fill();

  ctx.translate(60, 35);
  ctx.rotate(angle);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -75); ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(-12, -70, 24, 45);
  }

  ctx.restore();
}

function drawFullKingdomWizardSpire(ctx, x, y, level, timeOfDay) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#3a0ca3';
  ctx.fillRect(20, 0, 60, 140);
  ctx.fillStyle = '#9370db';
  ctx.beginPath(); ctx.moveTo(50, -55); ctx.lineTo(20, 0); ctx.lineTo(80, 0); ctx.fill();

  if (level > 0) {
    ctx.fillStyle = '#b5179e';
    ctx.beginPath(); ctx.arc(50, -25, 14, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();
}

function drawKingdomMarketStalls(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  // Striped Canopy Market Stall
  ctx.fillStyle = '#e63946'; ctx.fillRect(0, 0, 70, 20);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(15, 0, 15, 20); ctx.fillRect(45, 0, 15, 20);

  ctx.fillStyle = '#6b441a'; ctx.fillRect(5, 20, 60, 35);
  ctx.restore();
}

function drawKingdomKnightBarracks(ctx, x, y, level) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(0, 0, 90, 70);
  ctx.fillStyle = '#800020';
  ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(45, -30); ctx.lineTo(100, 0); ctx.fill();

  ctx.restore();
}

function drawHDDragon(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#e63946';
  ctx.beginPath(); ctx.ellipse(0, 0, 55, 24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(60, -12, 18, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a81c34';
  ctx.beginPath(); ctx.moveTo(-12, -12); ctx.lineTo(18, -85); ctx.lineTo(48, -12); ctx.fill();

  ctx.restore();
}

function drawHDComet(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#9370db';
  ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffd700';
  ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

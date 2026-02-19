import { useState, useEffect, useCallback, useRef } from 'react';
import FireSpot from './FireSpot';
import Machine from './Machine';
import useGameSounds from './useGameSounds';

interface Fire {
  id: number;
  x: number;
  y: number;
  intensity: number;
  clicksToExtinguish: number;
  maxClicks: number;
}

interface GameEngineProps {
  level: number;
  onWin: () => void;
  onLose: () => void;
  onScore: (s: number) => void;
}

const MAX_FIRE = 100;
const FIRE_GROW_RATE = 3;
const CLICKS_BASE = 8;
const SPAWN_INTERVAL_L1 = 4500;
const SPAWN_INTERVAL_L2 = 6000;
const AUTO_SUPPRESS_TIME = 30;
const FIRES_TO_WIN = 8;
const DAMAGE_RATE = 3;

const GameEngine = ({ level, onWin, onLose, onScore }: GameEngineProps) => {
  const [fires, setFires] = useState<Fire[]>([]);
  const [damage, setDamage] = useState(0);
  const [score, setScore] = useState(0);
  const [extinguished, setExtinguished] = useState(0);
  const [suppressBtn, setSuppressBtn] = useState<{ fireId: number; timer: number } | null>(null);
  const [screenFlash, setScreenFlash] = useState(false);
  const fireIdRef = useRef(0);
  const sounds = useGameSounds();
  const gameLoopRef = useRef<number>(0);
  const spawnRef = useRef<number>(0);
  const activeRef = useRef(true);
  const damageRef = useRef(0);
  const firesRef = useRef<Fire[]>([]);

  firesRef.current = fires;
  damageRef.current = damage;

  const spawnFire = useCallback(() => {
    if (!activeRef.current) return;
    const id = ++fireIdRef.current;
    const x = 10 + Math.random() * 80;
    const y = 8 + Math.random() * 48;
    const clicks = CLICKS_BASE + Math.floor(Math.random() * 5);
    setFires(prev => [...prev, { id, x, y, intensity: 8, clicksToExtinguish: clicks, maxClicks: clicks }]);
    if (level === 2) {
      setSuppressBtn({ fireId: id, timer: AUTO_SUPPRESS_TIME });
    }
    sounds.playFireGrow();
  }, [level, sounds]);

  useEffect(() => {
    activeRef.current = true;
    const startDelay = setTimeout(() => {
      spawnFire();
      const interval = level === 1 ? SPAWN_INTERVAL_L1 : SPAWN_INTERVAL_L2;
      spawnRef.current = window.setInterval(spawnFire, interval);
    }, 1000);
    return () => {
      activeRef.current = false;
      clearTimeout(startDelay);
      clearInterval(spawnRef.current);
    };
  }, [level, spawnFire]);

  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      if (!activeRef.current) return;
      const dt = (now - last) / 1000;
      last = now;

      setFires(prev => prev.map(f => ({
        ...f,
        intensity: Math.min(f.intensity + FIRE_GROW_RATE * dt * (1 + f.intensity * 0.005), MAX_FIRE),
      })));

      const totalIntensity = firesRef.current.reduce((s, f) => s + f.intensity, 0);
      if (totalIntensity > 0) {
        setDamage(prev => {
          const newDmg = prev + (totalIntensity / MAX_FIRE) * dt * DAMAGE_RATE;
          return Math.min(newDmg, 100);
        });
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };
    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, []);

  useEffect(() => {
    if (damage >= 100) {
      activeRef.current = false;
      clearInterval(spawnRef.current);
      sounds.playGameOver();
      onLose();
    }
  }, [damage, onLose, sounds]);

  useEffect(() => {
    if (extinguished >= FIRES_TO_WIN) {
      activeRef.current = false;
      clearInterval(spawnRef.current);
      sounds.playWin();
      onScore(score);
      onWin();
    }
  }, [extinguished, onWin, onScore, score, sounds]);

  useEffect(() => {
    if (!suppressBtn || level !== 2) return;
    const interval = setInterval(() => {
      setSuppressBtn(prev => {
        if (!prev) return null;
        if (prev.timer <= 1) {
          suppressFire(prev.fireId);
          return null;
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [suppressBtn?.fireId, level]);

  const suppressFire = useCallback((fireId: number) => {
    if (!activeRef.current) return;
    sounds.playSuppress();
    setScreenFlash(true);
    setTimeout(() => setScreenFlash(false), 300);
    setFires(prev => {
      const fire = prev.find(f => f.id === fireId);
      if (fire) {
        setScore(s => s + Math.floor(fire.intensity * 5));
        setExtinguished(e => e + 1);
      }
      return prev.filter(f => f.id !== fireId);
    });
    setSuppressBtn(null);
  }, [sounds]);

  const handleFireClick = useCallback((id: number) => {
    if (!activeRef.current) return;
    sounds.playClick();
    setFires(prev => {
      const updated = prev.map(f => {
        if (f.id !== id) return f;
        const newClicks = f.clicksToExtinguish - 1;
        if (newClicks <= 0) {
          sounds.playExtinguish();
          setScore(s => s + Math.floor(f.intensity * 10));
          setExtinguished(e => e + 1);
          setScreenFlash(true);
          setTimeout(() => setScreenFlash(false), 200);
          return null;
        }
        return { ...f, clicksToExtinguish: newClicks, intensity: Math.max(1, f.intensity - 3) };
      });
      return updated.filter(Boolean) as Fire[];
    });
  }, [sounds]);

  const healthPercent = Math.max(0, 100 - Math.floor(damage));

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <span className="game-hud-badge bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            ⭐ {score}
          </span>
          <span className="game-hud-badge bg-orange-500/20 text-orange-300 border-orange-500/30">
            🔥 {extinguished}/{FIRES_TO_WIN}
          </span>
        </div>
        <span className="game-hud-badge bg-blue-500/20 text-blue-300 border-blue-500/30">
          {level === 1 ? '🧤 Ручное тушение' : '🧯 Система тушения'}
        </span>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <Machine damage={damage} />
      </div>

      {fires.map(fire => (
        <FireSpot
          key={fire.id}
          x={fire.x}
          y={fire.y}
          intensity={fire.intensity}
          maxIntensity={MAX_FIRE}
          clicksLeft={fire.clicksToExtinguish}
          maxClicks={fire.maxClicks}
          onClick={() => handleFireClick(fire.id)}
        />
      ))}

      {level === 2 && suppressBtn && (
        <button
          className="absolute z-30 suppress-btn"
          style={{ right: '12px', top: '56px' }}
          onClick={() => suppressFire(suppressBtn.fireId)}
        >
          <span className="text-xl">🧯</span>
          <span className="ml-2 font-black text-base tracking-wide">ТУШИТЬ</span>
          <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-md text-sm font-mono">
            {suppressBtn.timer}с
          </span>
        </button>
      )}

      {damage > 40 && (
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse 120% 60% at 50% 100%, rgba(255,${Math.max(0, 80 - (damage - 40))},0,${(damage - 40) / 120}), transparent 70%)`,
          }}
        />
      )}

      {damage > 70 && (
        <div className="absolute inset-0 pointer-events-none z-0 vignette-danger" />
      )}

      {screenFlash && (
        <div className="absolute inset-0 pointer-events-none z-40 bg-white/15 transition-opacity duration-200" />
      )}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-[220px]">
        <div className="h-3 bg-gray-800/80 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full rounded-full transition-all duration-300 health-bar"
            style={{
              width: `${healthPercent}%`,
              background: healthPercent > 60 ? 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                : healthPercent > 30 ? 'linear-gradient(90deg, #FF9800, #FFC107)'
                : 'linear-gradient(90deg, #F44336, #FF5722)',
            }}
          />
        </div>
        <div className="text-xs text-center text-white/70 mt-0.5 font-bold">
          ❤️ {healthPercent}%
        </div>
      </div>
    </div>
  );
};

export default GameEngine;
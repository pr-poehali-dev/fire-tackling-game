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
}

interface GameEngineProps {
  level: number;
  onWin: () => void;
  onLose: () => void;
  onScore: (s: number) => void;
}

const MAX_FIRE = 100;
const FIRE_GROW_RATE = 2.5;
const CLICKS_BASE = 8;
const SPAWN_INTERVAL_L1 = 4000;
const AUTO_SUPPRESS_TIME = 30;
const FIRES_TO_WIN = 8;

const GameEngine = ({ level, onWin, onLose, onScore }: GameEngineProps) => {
  const [fires, setFires] = useState<Fire[]>([]);
  const [damage, setDamage] = useState(0);
  const [score, setScore] = useState(0);
  const [extinguished, setExtinguished] = useState(0);
  const [suppressBtn, setSuppressBtn] = useState<{ fireId: number; timer: number } | null>(null);
  const fireIdRef = useRef(0);
  const sounds = useGameSounds();
  const gameLoopRef = useRef<number>(0);
  const spawnRef = useRef<number>(0);
  const activeRef = useRef(true);

  const spawnFire = useCallback(() => {
    if (!activeRef.current) return;
    const id = ++fireIdRef.current;
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 45;
    setFires(prev => [...prev, { id, x, y, intensity: 10, clicksToExtinguish: CLICKS_BASE + Math.floor(Math.random() * 4) }]);
    if (level === 2) {
      setSuppressBtn({ fireId: id, timer: AUTO_SUPPRESS_TIME });
    }
    sounds.playFireGrow();
  }, [level, sounds]);

  useEffect(() => {
    activeRef.current = true;
    spawnFire();
    const interval = level === 1 ? SPAWN_INTERVAL_L1 : 5000;
    spawnRef.current = window.setInterval(spawnFire, interval);
    return () => {
      activeRef.current = false;
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
        intensity: Math.min(f.intensity + FIRE_GROW_RATE * dt * (1 + f.intensity / MAX_FIRE), MAX_FIRE),
      })));

      setDamage(prev => {
        let dmg = prev;
        setFires(curr => {
          const totalIntensity = curr.reduce((s, f) => s + f.intensity, 0);
          dmg = prev + (totalIntensity / MAX_FIRE) * dt * 4;
          return curr;
        });
        return Math.min(dmg, 100);
      });

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
          handleSuppress(prev.fireId);
          return null;
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [suppressBtn?.fireId, level]);

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
          return null;
        }
        return { ...f, clicksToExtinguish: newClicks, intensity: Math.max(1, f.intensity - 5) };
      });
      return updated.filter(Boolean) as Fire[];
    });
  }, [sounds]);

  const handleSuppress = useCallback((fireId: number) => {
    if (!activeRef.current) return;
    sounds.playSuppress();
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

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute top-3 left-3 z-20 flex gap-3 items-center">
        <span className="bg-black/70 text-yellow-300 px-3 py-1 rounded-lg font-bold text-sm">
          ⭐ {score}
        </span>
        <span className="bg-black/70 text-orange-300 px-3 py-1 rounded-lg font-bold text-sm">
          🔥 Потушено: {extinguished}/{FIRES_TO_WIN}
        </span>
        <span className="bg-black/70 text-blue-300 px-3 py-1 rounded-lg font-bold text-sm">
          Уровень {level}
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
          onClick={() => handleFireClick(fire.id)}
        />
      ))}

      {level === 2 && suppressBtn && (
        <button
          className="absolute z-30 suppress-btn"
          style={{ right: '16px', top: '60px' }}
          onClick={() => handleSuppress(suppressBtn.fireId)}
        >
          <span className="text-lg">🧯</span>
          <span className="ml-1 font-bold">ТУШИТЬ</span>
          <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-xs">
            {suppressBtn.timer}с
          </span>
        </button>
      )}

      {damage > 50 && (
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at bottom, rgba(255,${Math.max(0, 100 - damage)},0,${(damage - 50) / 150}), transparent 60%)`,
          }}
        />
      )}
    </div>
  );
};

export default GameEngine;

import { useEffect, useState } from 'react';

interface FireSpotProps {
  x: number;
  y: number;
  intensity: number;
  maxIntensity: number;
  onClick: () => void;
}

const FireSpot = ({ x, y, intensity, maxIntensity, onClick }: FireSpotProps) => {
  const [particles, setParticles] = useState<{ id: number; dx: number; dy: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const count = Math.floor(3 + (intensity / maxIntensity) * 12);
    const p = Array.from({ length: count }, (_, i) => ({
      id: i,
      dx: (Math.random() - 0.5) * 40 * (intensity / maxIntensity + 0.3),
      dy: -Math.random() * 50 * (intensity / maxIntensity + 0.3),
      size: 6 + Math.random() * 14 * (intensity / maxIntensity),
      delay: Math.random() * 0.6,
    }));
    setParticles(p);
  }, [intensity, maxIntensity]);

  const ratio = intensity / maxIntensity;
  const baseSize = 30 + ratio * 50;

  return (
    <div
      className="absolute cursor-pointer select-none fire-spot"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
    >
      <div
        className="relative"
        style={{ width: baseSize * 2, height: baseSize * 2 }}
      >
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: baseSize,
            height: baseSize,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255,${Math.max(50, 200 - ratio * 180)},0,0.95) 0%, rgba(255,${Math.max(0, 120 - ratio * 120)},0,0.6) 50%, transparent 70%)`,
            filter: `blur(${2 + ratio * 4}px)`,
            boxShadow: `0 0 ${20 + ratio * 40}px ${10 + ratio * 20}px rgba(255,${Math.max(50, 150 - ratio * 150)},0,0.5)`,
          }}
        />
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full fire-particle"
            style={{
              width: p.size,
              height: p.size,
              left: `calc(50% + ${p.dx}px)`,
              top: `calc(50% + ${p.dy}px)`,
              background: `radial-gradient(circle, rgba(255,${180 - ratio * 100},0,0.9), transparent)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${0.4 + Math.random() * 0.5}s`,
            }}
          />
        ))}
        <div
          className="absolute text-center"
          style={{ left: '50%', bottom: '-22px', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
        >
          <span className="text-xs font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
            🔥 {Math.ceil(intensity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FireSpot;

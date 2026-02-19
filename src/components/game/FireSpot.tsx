import { useEffect, useState, useRef } from 'react';

interface FireSpotProps {
  x: number;
  y: number;
  intensity: number;
  maxIntensity: number;
  clicksLeft: number;
  maxClicks: number;
  onClick: () => void;
}

const FireSpot = ({ x, y, intensity, maxIntensity, clicksLeft, maxClicks, onClick }: FireSpotProps) => {
  const [particles, setParticles] = useState<{ id: number; dx: number; dy: number; size: number; delay: number; hue: number }[]>([]);
  const [shake, setShake] = useState(false);
  const prevClicks = useRef(clicksLeft);

  useEffect(() => {
    if (clicksLeft < prevClicks.current) {
      setShake(true);
      setTimeout(() => setShake(false), 150);
    }
    prevClicks.current = clicksLeft;
  }, [clicksLeft]);

  useEffect(() => {
    const count = Math.floor(4 + (intensity / maxIntensity) * 14);
    const p = Array.from({ length: count }, (_, i) => ({
      id: i,
      dx: (Math.random() - 0.5) * 50 * (intensity / maxIntensity + 0.3),
      dy: -Math.random() * 60 * (intensity / maxIntensity + 0.3),
      size: 6 + Math.random() * 16 * (intensity / maxIntensity),
      delay: Math.random() * 0.8,
      hue: Math.random() > 0.3 ? 30 + Math.random() * 30 : 0,
    }));
    setParticles(p);
  }, [Math.floor(intensity / 5), maxIntensity]);

  const ratio = intensity / maxIntensity;
  const baseSize = 35 + ratio * 55;
  const progressPercent = ((maxClicks - clicksLeft) / maxClicks) * 100;

  return (
    <div
      className={`absolute cursor-pointer select-none fire-spot ${shake ? 'fire-hit' : ''}`}
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
    >
      <div
        className="relative"
        style={{ width: baseSize * 2.2, height: baseSize * 2.2 }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: baseSize * 1.6,
            height: baseSize * 1.6,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(255,${Math.max(30, 220 - ratio * 200)},0,0.15) 0%, transparent 70%)`,
            filter: `blur(${8 + ratio * 12}px)`,
          }}
        />

        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: baseSize,
            height: baseSize,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, 
              rgba(255,${Math.max(200, 255 - ratio * 80)},${Math.max(50, 180 - ratio * 180)},0.98) 0%, 
              rgba(255,${Math.max(50, 180 - ratio * 160)},0,0.7) 40%, 
              rgba(255,${Math.max(0, 80 - ratio * 80)},0,0.3) 60%, 
              transparent 75%)`,
            filter: `blur(${1 + ratio * 3}px)`,
            boxShadow: `
              0 0 ${15 + ratio * 35}px ${8 + ratio * 20}px rgba(255,${Math.max(50, 120 - ratio * 120)},0,0.5),
              0 0 ${5 + ratio * 15}px ${3 + ratio * 8}px rgba(255,200,0,0.3)
            `,
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
              background: `radial-gradient(circle, hsla(${p.hue},100%,${60 - ratio * 15}%,0.9), transparent)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${0.3 + Math.random() * 0.5}s`,
            }}
          />
        ))}

        <div
          className="absolute"
          style={{ left: '50%', bottom: '-28px', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
        >
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-12 h-1.5 bg-black/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${progressPercent}%`,
                  background: progressPercent > 60 ? '#4CAF50' : progressPercent > 30 ? '#FFC107' : '#FF5722',
                }}
              />
            </div>
            <span className="text-[10px] font-bold text-white/80 bg-black/50 px-1.5 py-0.5 rounded">
              {clicksLeft}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireSpot;
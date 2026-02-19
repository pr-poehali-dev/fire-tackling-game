interface MachineProps {
  damage: number;
}

const Machine = ({ damage }: MachineProps) => {
  const shakeClass = damage > 70 ? 'animate-machine-shake' : '';
  const bodyColor = damage < 30 ? '#FFD600' : damage < 60 ? '#FF9800' : damage < 85 ? '#F44336' : '#4E342E';
  const wheelColor = damage < 85 ? '#333' : '#1a1a1a';

  return (
    <div className={`machine-container ${shakeClass}`}>
      <svg viewBox="0 0 200 120" width="200" height="120">
        <rect x="20" y="35" width="160" height="55" rx="8" fill={bodyColor} stroke="#222" strokeWidth="2.5" />
        <rect x="30" y="18" width="70" height="30" rx="5" fill="#29B6F6" stroke="#222" strokeWidth="2" opacity={damage < 85 ? 1 : 0.3} />
        {damage < 85 && (
          <>
            <rect x="36" y="24" width="26" height="18" rx="2" fill="#B3E5FC" opacity="0.7" />
            <rect x="67" y="24" width="26" height="18" rx="2" fill="#B3E5FC" opacity="0.7" />
          </>
        )}
        <rect x="130" y="25" width="40" height="10" rx="3" fill="#FF7043" stroke="#222" strokeWidth="1.5" />
        <rect x="160" y="10" width="8" height="15" rx="2" fill="#666" />
        <circle cx="50" cy="100" r="18" fill={wheelColor} stroke="#555" strokeWidth="2" />
        <circle cx="50" cy="100" r="8" fill="#888" />
        <circle cx="150" cy="100" r="18" fill={wheelColor} stroke="#555" strokeWidth="2" />
        <circle cx="150" cy="100" r="8" fill="#888" />
        {damage >= 85 && (
          <>
            <line x1="30" y1="40" x2="80" y2="70" stroke="#111" strokeWidth="2" opacity="0.5" />
            <line x1="80" y1="40" x2="30" y2="70" stroke="#111" strokeWidth="2" opacity="0.5" />
          </>
        )}
        <text x="100" y="72" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#222">🚧 СТРОЙ</text>
      </svg>
      <div className="w-[200px] mt-1">
        <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${100 - damage}%`,
              background: damage < 30 ? '#4CAF50' : damage < 60 ? '#FFC107' : '#F44336',
            }}
          />
        </div>
        <div className="text-xs text-center text-white/80 mt-0.5 font-bold">
          Прочность: {Math.max(0, 100 - Math.floor(damage))}%
        </div>
      </div>
    </div>
  );
};

export default Machine;

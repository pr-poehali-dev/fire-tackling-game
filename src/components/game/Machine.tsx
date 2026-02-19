interface MachineProps {
  damage: number;
}

const Machine = ({ damage }: MachineProps) => {
  const shakeClass = damage > 70 ? 'animate-machine-shake' : '';
  const bodyColor = damage < 25 ? '#FFD600' : damage < 50 ? '#FF9800' : damage < 75 ? '#F44336' : '#5D4037';
  const cabinOpacity = damage < 80 ? 1 : 0.3;
  const showCracks = damage >= 75;
  const showSmoke = damage > 40;

  return (
    <div className={`machine-container ${shakeClass}`}>
      <svg viewBox="0 0 220 130" width="220" height="130">
        <rect x="15" y="40" width="170" height="55" rx="8" fill={bodyColor} stroke="#222" strokeWidth="2.5" />
        <rect x="18" y="43" width="164" height="8" rx="3" fill="rgba(255,255,255,0.15)" />

        <rect x="28" y="20" width="75" height="32" rx="6" fill="#29B6F6" stroke="#222" strokeWidth="2" opacity={cabinOpacity} />
        {damage < 80 && (
          <>
            <rect x="34" y="26" width="28" height="20" rx="3" fill="#B3E5FC" opacity="0.8" />
            <rect x="66" y="26" width="28" height="20" rx="3" fill="#B3E5FC" opacity="0.8" />
            <rect x="35" y="27" width="12" height="8" rx="1" fill="rgba(255,255,255,0.3)" />
            <rect x="67" y="27" width="12" height="8" rx="1" fill="rgba(255,255,255,0.3)" />
          </>
        )}

        <rect x="120" y="28" width="55" height="12" rx="4" fill="#FF7043" stroke="#222" strokeWidth="1.5" />
        <rect x="155" y="12" width="10" height="16" rx="3" fill="#666" />
        <circle cx="161" cy="10" r="4" fill="#F44336" opacity={damage > 50 ? 1 : 0.4} />

        <rect x="15" y="88" width="170" height="6" rx="2" fill="#333" />

        <circle cx="52" cy="105" r="20" fill="#333" stroke="#555" strokeWidth="2" />
        <circle cx="52" cy="105" r="12" fill="#666" />
        <circle cx="52" cy="105" r="4" fill="#999" />
        <circle cx="155" cy="105" r="20" fill="#333" stroke="#555" strokeWidth="2" />
        <circle cx="155" cy="105" r="12" fill="#666" />
        <circle cx="155" cy="105" r="4" fill="#999" />

        <rect x="182" y="60" width="8" height="14" rx="2" fill="#F44336" opacity="0.9" />
        <rect x="182" y="74" width="8" height="6" rx="1" fill="#FF9800" opacity="0.7" />

        <circle cx="20" cy="65" r="5" fill="#FFD600" stroke="#222" strokeWidth="1" opacity="0.8" />

        <text x="100" y="74" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#222" opacity="0.6">СТРОЙ</text>

        {showCracks && (
          <>
            <line x1="40" y1="45" x2="80" y2="75" stroke="#111" strokeWidth="1.5" opacity="0.5" />
            <line x1="80" y1="45" x2="50" y2="80" stroke="#111" strokeWidth="1.5" opacity="0.4" />
            <line x1="130" y1="50" x2="160" y2="80" stroke="#111" strokeWidth="1" opacity="0.3" />
          </>
        )}

        {showSmoke && (
          <>
            <circle cx="80" cy={18 - Math.sin(Date.now() / 300) * 3} r="6" fill="rgba(100,100,100,0.3)" className="smoke-particle" />
            <circle cx="90" cy={12 - Math.sin(Date.now() / 400) * 4} r="8" fill="rgba(80,80,80,0.25)" className="smoke-particle" />
            <circle cx="75" cy={8 - Math.sin(Date.now() / 350) * 5} r="5" fill="rgba(60,60,60,0.2)" className="smoke-particle" />
          </>
        )}
      </svg>
    </div>
  );
};

export default Machine;
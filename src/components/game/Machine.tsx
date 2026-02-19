import { ReactNode } from 'react';

interface MachineProps {
  damage: number;
  children?: ReactNode;
}

const Machine = ({ damage, children }: MachineProps) => {
  const shakeClass = damage > 70 ? 'animate-machine-shake' : '';
  const bodyColor = damage < 25 ? '#FFD600' : damage < 50 ? '#FF9800' : damage < 75 ? '#F44336' : '#5D4037';
  const cabinOpacity = damage < 80 ? 1 : 0.3;
  const showCracks = damage >= 75;
  const showSmoke = damage > 40;

  return (
    <div className={`machine-wrapper ${shakeClass}`}>
      <div className="relative">
        <svg viewBox="0 0 440 260" width="100%" height="100%" className="machine-svg">
          <rect x="30" y="80" width="340" height="110" rx="16" fill={bodyColor} stroke="#222" strokeWidth="3" />
          <rect x="36" y="86" width="328" height="14" rx="5" fill="rgba(255,255,255,0.15)" />

          <rect x="56" y="40" width="150" height="64" rx="10" fill="#29B6F6" stroke="#222" strokeWidth="2.5" opacity={cabinOpacity} />
          {damage < 80 && (
            <>
              <rect x="68" y="52" width="56" height="40" rx="4" fill="#B3E5FC" opacity="0.8" />
              <rect x="132" y="52" width="56" height="40" rx="4" fill="#B3E5FC" opacity="0.8" />
              <rect x="70" y="54" width="24" height="16" rx="2" fill="rgba(255,255,255,0.3)" />
              <rect x="134" y="54" width="24" height="16" rx="2" fill="rgba(255,255,255,0.3)" />
            </>
          )}

          <rect x="240" y="56" width="110" height="24" rx="6" fill="#FF7043" stroke="#222" strokeWidth="2" />
          <rect x="310" y="24" width="16" height="32" rx="4" fill="#666" />
          <circle cx="318" cy="20" r="6" fill="#F44336" opacity={damage > 50 ? 1 : 0.4} />

          <rect x="30" y="176" width="340" height="10" rx="3" fill="#333" />

          <circle cx="104" cy="210" r="36" fill="#333" stroke="#555" strokeWidth="3" />
          <circle cx="104" cy="210" r="22" fill="#666" />
          <circle cx="104" cy="210" r="8" fill="#999" />
          <circle cx="310" cy="210" r="36" fill="#333" stroke="#555" strokeWidth="3" />
          <circle cx="310" cy="210" r="22" fill="#666" />
          <circle cx="310" cy="210" r="8" fill="#999" />

          <rect x="364" y="120" width="14" height="28" rx="3" fill="#F44336" opacity="0.9" />
          <rect x="364" y="148" width="14" height="12" rx="2" fill="#FF9800" opacity="0.7" />

          <circle cx="38" cy="130" r="8" fill="#FFD600" stroke="#222" strokeWidth="1.5" opacity="0.8" />

          <text x="200" y="148" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#222" opacity="0.5">🚧 СТРОЙ</text>

          {showCracks && (
            <>
              <line x1="80" y1="90" x2="160" y2="150" stroke="#111" strokeWidth="2" opacity="0.5" />
              <line x1="160" y1="90" x2="100" y2="160" stroke="#111" strokeWidth="2" opacity="0.4" />
              <line x1="260" y1="100" x2="320" y2="160" stroke="#111" strokeWidth="1.5" opacity="0.3" />
            </>
          )}

          {showSmoke && (
            <>
              <circle cx="160" cy="30" r="10" fill="rgba(100,100,100,0.3)" className="smoke-particle" />
              <circle cx="180" cy="18" r="14" fill="rgba(80,80,80,0.25)" className="smoke-particle" />
              <circle cx="145" cy="12" r="8" fill="rgba(60,60,60,0.2)" className="smoke-particle" />
            </>
          )}
        </svg>

        <div className="absolute inset-0 z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Machine;
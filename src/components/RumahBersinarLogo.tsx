import React from 'react';

interface RumahBersinarLogoProps {
  variant?: 'primary' | 'sekunder' | 'logogram' | 'monokrom';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const RumahBersinarLogo: React.FC<RumahBersinarLogoProps> = ({
  variant = 'primary',
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { shield: 'w-10 h-12', text: 'text-sm' },
    md: { shield: 'w-14 h-16', text: 'text-base' },
    lg: { shield: 'w-20 h-24', text: 'text-xl' },
    xl: { shield: 'w-28 h-32', text: 'text-2xl' },
  };

  const isMono = variant === 'monokrom';

  // SVG Shield Logogram
  const renderShieldSvg = () => (
    <svg
      viewBox="0 0 200 240"
      className="w-full h-full drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Golden Shield with rounded curved sides converging to bottom tip */}
      <path
        d="M 100,10 C 150,15 180,25 185,45 C 185,130 155,185 100,230 C 45,185 15,130 15,45 C 20,25 50,15 100,10 Z"
        fill="#FFFFFF"
        stroke={isMono ? '#000000' : '#f1b607'}
        strokeWidth="14"
        strokeLinejoin="round"
      />
      {/* Inner Dark Contour */}
      <path
        d="M 100,20 C 145,24 170,33 174,50 C 174,125 147,175 100,216 C 53,175 26,125 26,50 C 30,33 55,24 100,20 Z"
        fill="none"
        stroke={isMono ? '#000000' : '#352106'}
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* Sun on Upper-Left */}
      <g transform="translate(48, 68)">
        {/* Sun rays */}
        <path
          d="M-20,-12 C-26,-22 -14,-28 -20,-36"
          stroke={isMono ? '#000000' : '#f7931d'}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M-10,-24 C-12,-34 0,-38 -3,-46"
          stroke={isMono ? '#000000' : '#f7931d'}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M6,-28 C8,-38 20,-38 22,-48"
          stroke={isMono ? '#000000' : '#f7931d'}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M22,-20 C28,-28 38,-24 44,-32"
          stroke={isMono ? '#000000' : '#f7931d'}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Sun Core */}
        <circle cx="0" cy="0" r="18" fill={isMono ? '#000000' : '#f1b607'} />
      </g>

      {/* House Motif in Center */}
      <g transform="translate(68, 48)">
        {/* Chimney */}
        <rect x="52" y="10" width="8" height="18" fill={isMono ? '#000000' : '#f1b607'} />
        {/* Roof */}
        <polygon
          points="25,35 60,6 95,35 88,38 60,16 32,38"
          fill={isMono ? '#000000' : '#f1b607'}
        />
        {/* Main Walls */}
        <path
          d="M 33,38 L 33,85 L 87,85 L 87,38 Z"
          fill={isMono ? '#555555' : '#fdc502'}
        />
        {/* Window */}
        <rect
          x="50"
          y="46"
          width="18"
          height="18"
          rx="2"
          fill="#FFFFFF"
          stroke={isMono ? '#000000' : '#f1b607'}
          strokeWidth="3"
        />
        <line x1="59" y1="46" x2="59" y2="64" stroke={isMono ? '#000000' : '#f1b607'} strokeWidth="2" />
        <line x1="50" y1="55" x2="68" y2="55" stroke={isMono ? '#000000' : '#f1b607'} strokeWidth="2" />
        {/* Side Extension Roof */}
        <polygon points="85,50 115,50 100,38" fill={isMono ? '#000000' : '#f7931d'} />
        <rect x="87" y="50" width="24" height="35" fill={isMono ? '#555555' : '#f1b607'} />
      </g>

      {/* Upward Rising Brown Swoosh (Garis Lengkung Ke Atas) */}
      <path
        d="M 44,120 C 40,82 72,42 135,28 C 102,46 76,82 72,124 Z"
        fill={isMono ? '#000000' : '#814f34'}
      />

      {/* RUMAH Text inside Shield */}
      <text
        x="100"
        y="148"
        textAnchor="middle"
        fontFamily="Poppins, sans-serif"
        fontWeight="800"
        fontSize="25"
        letterSpacing="1"
        fill={isMono ? '#000000' : '#f1b607'}
        stroke={isMono ? '#000000' : '#352106'}
        strokeWidth="1.5"
        style={{ paintOrder: 'stroke fill' }}
      >
        RUMAH
      </text>

      {/* BERSINAR in Rectangular Badge */}
      <g transform="translate(42, 156)">
        <rect
          x="0"
          y="0"
          width="116"
          height="28"
          rx="5"
          fill={isMono ? '#000000' : '#352106'}
          stroke={isMono ? '#000000' : '#f1b607'}
          strokeWidth="2"
        />
        <text
          x="58"
          y="19"
          textAnchor="middle"
          fontFamily="Poppins, sans-serif"
          fontWeight="800"
          fontSize="15"
          letterSpacing="2"
          fill={isMono ? '#FFFFFF' : '#f1b607'}
        >
          BERSINAR
        </text>
      </g>

      {/* EST. 2019 */}
      <text
        x="100"
        y="204"
        textAnchor="middle"
        fontFamily="Poppins, sans-serif"
        fontWeight="700"
        fontSize="12"
        letterSpacing="1.5"
        fill={isMono ? '#000000' : '#f1b607'}
      >
        EST. 2019
      </text>
    </svg>
  );

  if (variant === 'logogram') {
    return (
      <div className={`inline-block ${sizeMap[size].shield} ${className}`}>
        {renderShieldSvg()}
      </div>
    );
  }

  if (variant === 'sekunder') {
    return (
      <div className={`flex items-center gap-3.5 ${className}`}>
        <div className={sizeMap[size].shield}>{renderShieldSvg()}</div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-heading font-extrabold tracking-tight ${
                isMono ? 'text-black' : 'text-[#f1b607]'
              } drop-shadow-xs leading-none text-xl sm:text-2xl`}
            >
              RUMAH
            </span>
            <span
              className={`px-2 py-0.5 rounded font-heading font-extrabold text-xs sm:text-sm tracking-widest ${
                isMono ? 'bg-black text-white' : 'bg-[#352106] text-[#f1b607]'
              }`}
            >
              BERSINAR
            </span>
          </div>
          <span className="text-[11px] font-subheading font-medium tracking-wider text-[#814f34] mt-0.5">
            YAYASAN · EST. 2019
          </span>
        </div>
      </div>
    );
  }

  // Default Primary Layout (Vertical / Header Lockup)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={sizeMap[size].shield}>{renderShieldSvg()}</div>
      <div className="flex flex-col">
        <span className="text-lg sm:text-xl font-heading font-bold text-[#352106] tracking-tight leading-tight">
          Yayasan Rumah Bersinar
        </span>
        <span className="text-[11px] text-[#814f34] font-medium tracking-wide">
          Est. 2019 · Guiding 4 Orphanage Homes
        </span>
      </div>
    </div>
  );
};

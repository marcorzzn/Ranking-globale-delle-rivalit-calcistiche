import React from 'react';
import { ClubInfo } from '../data/rivalriesData';

interface ClubCrestProps {
  club: ClubInfo;
  size?: 'sm' | 'md' | 'lg';
}

export const ClubCrest: React.FC<ClubCrestProps> = ({ club, size = 'md' }) => {
  const dimensions = size === 'sm' ? 28 : size === 'md' ? 38 : 54;
  const clipId = `shield-${club.wikidataId}-${club.shortCode}-${size}`;

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0 select-none"
      style={{ width: dimensions, height: dimensions }}
      title={`${club.name} · Wikidata ${club.wikidataId} (P154)`}
    >
      <svg
        viewBox="0 0 100 112"
        className="w-full h-full drop-shadow-xs"
        aria-label={`${club.name} crest`}
      >
        <defs>
          <clipPath id={clipId}>
            <path d="M12,8 L88,8 L88,58 C88,84 50,104 50,104 C50,104 12,84 12,58 Z" />
          </clipPath>
        </defs>

        {/* Shield background & pattern */}
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="100" height="112" fill={club.primaryColor} />

          {club.pattern === 'stripes' && (
            <>
              <rect x="20" y="0" width="15" height="112" fill={club.secondaryColor} />
              <rect x="50" y="0" width="15" height="112" fill={club.secondaryColor} />
              <rect x="80" y="0" width="15" height="112" fill={club.secondaryColor} />
            </>
          )}

          {club.pattern === 'halves' && (
            <rect x="50" y="0" width="50" height="112" fill={club.secondaryColor} />
          )}

          {club.pattern === 'hoops' && (
            <>
              <rect x="0" y="24" width="100" height="16" fill={club.secondaryColor} />
              <rect x="0" y="54" width="100" height="16" fill={club.secondaryColor} />
              <rect x="0" y="84" width="100" height="16" fill={club.secondaryColor} />
            </>
          )}

          {club.pattern === 'diagonal' && (
            <polygon points="0,95 95,0 115,0 15,112 0,112" fill={club.secondaryColor} />
          )}

          {club.pattern === 'solid' && (
            <polygon points="0,0 100,0 100,26 0,40" fill={club.secondaryColor} opacity="0.28" />
          )}

          {/* Futurist central band */}
          <rect x="0" y="38" width="100" height="28" fill="#0D0C0B" fillOpacity="0.82" />
          <text
            x="50"
            y="57"
            textAnchor="middle"
            fill="#F7F4EE"
            fontSize="21"
            fontWeight="800"
            fontFamily="Big Shoulders Display, sans-serif"
            letterSpacing="1.5"
          >
            {club.shortCode}
          </text>
        </g>

        {/* Shield Outer Frame */}
        <path
          d="M12,8 L88,8 L88,58 C88,84 50,104 50,104 C50,104 12,84 12,58 Z"
          fill="none"
          stroke="#C5A059"
          strokeWidth="4.5"
        />
      </svg>
    </div>
  );
};

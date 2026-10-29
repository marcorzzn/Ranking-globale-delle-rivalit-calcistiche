import React from 'react';
import { OptaTop100League } from '../data/optaTop100Leagues';
import { useOfficialClubLogo } from '../utils/logoResolver';

interface LeagueCrestProps {
  league: OptaTop100League;
  size?: 'sm' | 'md' | 'lg';
}

export const LeagueCrest: React.FC<LeagueCrestProps> = ({ league, size = 'md' }) => {
  const dimensions = size === 'sm' ? 28 : size === 'md' ? 38 : 48;
  const { logoUrl, clearLogoOnError } = useOfficialClubLogo(
    league.wikidataId,
    league.wikipediaQuery
  );

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0 select-none"
      style={{ width: dimensions, height: dimensions }}
      title={`${league.name} · Opta #${league.rank} · Wikidata ${league.wikidataId}`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${league.name} official logo`}
          referrerPolicy="no-referrer"
          onError={clearLogoOnError}
          className="w-full h-full object-contain drop-shadow-xs bg-white/85 dark:bg-white/90 p-0.5 rounded-xs"
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xs"
          aria-label={`${league.name} crest`}
        >
          <polygon
            points="50,4 94,26 94,74 50,96 6,74 6,26"
            fill={league.primaryColor}
            stroke="#C5A059"
            strokeWidth="5"
          />
          <polygon
            points="50,12 86,30 86,50 14,50 14,30"
            fill={league.secondaryColor}
            opacity="0.35"
          />
          <rect x="8" y="36" width="84" height="28" fill="#0D0C0B" fillOpacity="0.88" />
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fill="#F7F4EE"
            fontSize="22"
            fontWeight="800"
            fontFamily="Big Shoulders Display, sans-serif"
            letterSpacing="1.2"
          >
            {league.shortCode}
          </text>
        </svg>
      )}
    </div>
  );
};

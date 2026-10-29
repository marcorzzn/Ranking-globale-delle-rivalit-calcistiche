import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import {
  WORLD_CLUBS_PYRAMID,
  CONFEDERATIONS_META,
  CUP_TOURNAMENTS_META,
  ConfederationId,
  LeagueTier,
  CupTournamentId,
  WorldClubEntry,
} from '../data/worldClubsData';
import { ClubCrest } from './ClubCrest';
import { mountVectorWorldBasemap } from '../utils/vectorBasemap';
import { Trophy, Layers, Search } from 'lucide-react';

interface WorldClubsAtlasProps {
  darkMode: boolean;
  lang: 'it' | 'en';
}

export const WorldClubsAtlas: React.FC<WorldClubsAtlasProps> = ({ darkMode, lang }) => {
  const [selectedConfed, setSelectedConfed] = useState<ConfederationId | 'ALL'>('ALL');
  const [selectedTier, setSelectedTier] = useState<LeagueTier | 'ALL'>('ALL');
  const [selectedCup, setSelectedCup] = useState<CupTournamentId | 'ALL'>('ALL');
  const [showConfedBoundaries, setShowConfedBoundaries] = useState<boolean>(true);
  const [showCupBoundaries, setShowCupBoundaries] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeClub, setActiveClub] = useState<WorldClubEntry | null>(WORLD_CLUBS_PYRAMID[0]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const boundariesLayerRef = useRef<L.LayerGroup | null>(null);
  const themeUpdaterRef = useRef<((isDark: boolean) => void) | null>(null);

  const filteredClubs = useMemo(() => {
    return WORLD_CLUBS_PYRAMID.filter((club) => {
      if (selectedConfed !== 'ALL' && club.confederation !== selectedConfed) return false;
      if (selectedTier !== 'ALL' && club.tier !== selectedTier) return false;
      if (selectedCup !== 'ALL' && !club.cups.includes(selectedCup)) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = club.name.toLowerCase().includes(q);
        const matchCity = club.city.toLowerCase().includes(q);
        const matchStadium = club.stadiumName.toLowerCase().includes(q);
        const matchLeague = club.leagueName.toLowerCase().includes(q);
        const matchCountry = club.country[lang].toLowerCase().includes(q);
        return matchName || matchCity || matchStadium || matchLeague || matchCountry;
      }
      return true;
    });
  }, [selectedConfed, selectedTier, selectedCup, searchQuery, lang]);

  // Initialize Leaflet Map with self-contained Vector World Basemap (zero watermark, zero API keys)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [26, 12],
      zoom: 2.4,
      minZoom: 2,
      maxZoom: 14,
      scrollWheelZoom: true,
    });

    const { updateTheme } = mountVectorWorldBasemap(map, darkMode);
    themeUpdaterRef.current = updateTheme;

    const boundariesLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    boundariesLayerRef.current = boundariesLayer;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update vector map colors on dark mode toggle
  useEffect(() => {
    if (themeUpdaterRef.current) {
      themeUpdaterRef.current(darkMode);
    }
  }, [darkMode]);

  // Render Confederation & Cup Boundaries
  useEffect(() => {
    const boundariesLayer = boundariesLayerRef.current;
    if (!boundariesLayer) return;
    boundariesLayer.clearLayers();

    if (showConfedBoundaries) {
      CONFEDERATIONS_META.forEach((conf) => {
        if (selectedConfed !== 'ALL' && selectedConfed !== conf.id) return;
        const poly = L.polygon(conf.boundaryPolygon, {
          color: conf.color,
          weight: 2,
          opacity: 0.85,
          fillColor: conf.color,
          fillOpacity: 0.1,
          dashArray: '6, 4',
        });
        poly.bindTooltip(
          `<div style="font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:700;">${conf.id} · ${conf.fullTitle[lang]} (HQ: ${conf.hqCity})</div>`,
          { sticky: true }
        );
        poly.addTo(boundariesLayer);
      });
    }

    if (showCupBoundaries) {
      CUP_TOURNAMENTS_META.forEach((cup) => {
        if (selectedCup !== 'ALL' && selectedCup !== cup.id) return;
        const poly = L.polygon(cup.zonePolygon, {
          color: cup.color,
          weight: 2.5,
          opacity: 0.9,
          fillColor: cup.color,
          fillOpacity: 0.14,
        });
        poly.bindTooltip(
          `<div style="font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:700;">🏆 ${cup.name[lang]}</div>`,
          { sticky: true }
        );
        poly.addTo(boundariesLayer);
      });
    }
  }, [showConfedBoundaries, showCupBoundaries, selectedConfed, selectedCup, lang]);

  // Render Club Pins with Crest & Trophy Badge
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    filteredClubs.forEach((club) => {
      const isSelected = activeClub?.id === club.id;
      const hasInternationalCup = club.cups.some((c) => c !== 'DOMESTIC_CUP');
      const hasQuadrennialCWC = club.cups.includes('FIFA_CWC');

      const cachedLogo = (() => {
        try {
          return localStorage.getItem(`club_logo_v2_${club.wikidataId}:${club.name}`);
        } catch {
          return null;
        }
      })();

      const tierBorderColor =
        club.tier === 1 ? '#C5A059' : club.tier === 2 ? '#9E1B1B' : '#57534E';

      const iconHtml = `
        <div style="position:relative;width:${isSelected ? 40 : 32}px;height:${isSelected ? 40 : 32}px;display:flex;align-items:center;justify-content:center;background:#0D0C0B;border:2px solid ${
        isSelected ? '#FFFFFF' : tierBorderColor
      };border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.45);transition:transform 0.15s;">
          ${
            cachedLogo
              ? `<img src="${cachedLogo}" alt="${club.shortCode}" referrerpolicy="no-referrer" style="width:82%;height:82%;object-fit:contain;" />`
              : `<div style="width:100%;height:100%;background:${club.primaryColor};color:${
                  club.primaryColor === '#FFFFFF' ||
                  club.primaryColor === '#FFCC00' ||
                  club.primaryColor === '#FDE100'
                    ? '#0D0C0B'
                    : '#F7F4EE'
                };display:flex;align-items:center;justify-content:center;font-family:'Big Shoulders Display',sans-serif;font-weight:800;font-size:11px;letter-spacing:0.5px;">${
                  club.shortCode
                }</div>`
          }
          ${
            hasInternationalCup
              ? `<div title="Partecipante Coppa Internazionale" style="position:absolute;top:-7px;right:-7px;width:16px;height:16px;border-radius:50%;background:${
                  hasQuadrennialCWC ? '#C5A059' : '#9E1B1B'
                };border:1.5px solid #0D0C0B;display:flex;align-items:center;justify-content:center;font-size:9px;line-height:1;">🏆</div>`
              : ''
          }
          <div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);background:#0D0C0B;color:#C5A059;font-family:'IBM Plex Mono',monospace;font-size:8px;padding:0 3px;border:1px solid ${tierBorderColor};line-height:1.1;">
            T${club.tier}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-world-club-pin',
        iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
        iconAnchor: [isSelected ? 20 : 16, isSelected ? 20 : 16],
      });

      const marker = L.marker([club.lat, club.lng], { icon: customIcon });

      const cupsHtml = club.cups
        .map((cId) => {
          const meta = CUP_TOURNAMENTS_META.find((m) => m.id === cId);
          return `<span style="display:inline-block;margin-right:6px;color:#C5A059;">🏆 ${
            meta ? meta.shortLabel : lang === 'it' ? 'Coppa Nazionale' : 'Domestic Cup'
          }</span>`;
        })
        .join(' · ');

      const popupHtml = `
        <div style="background:#0D0C0B;color:#F7F4EE;padding:12px 14px;min-width:250px;font-family:'Plus Jakarta Sans',sans-serif;">
          <div style="font-size:10px;color:#C5A059;letter-spacing:0.08em;text-transform:uppercase;">
            ${club.confederation} · ${club.country[lang]} · TIER ${club.tier} (${club.leagueName})
          </div>
          <div style="font-size:16px;font-weight:700;margin-top:3px;">${club.name}</div>
          <div style="font-size:12px;color:#D6CEBE;margin-top:2px;">
            🏟️ ${club.stadiumName} (${club.city}) · Cap: ${club.capacity.toLocaleString()}
          </div>
          <div style="font-size:11px;font-family:'IBM Plex Mono',monospace;margin-top:8px;padding-top:6px;border-top:1px solid #292524;">
            ${cupsHtml}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => setActiveClub(club));
      marker.addTo(markersLayer);
    });
  }, [filteredClubs, activeClub, lang]);

  const handleConfedClick = (confId: ConfederationId | 'ALL') => {
    setSelectedConfed(confId);
    const map = mapInstanceRef.current;
    if (!map) return;
    if (confId === 'ALL') {
      map.setView([26, 12], 2.4);
    } else {
      const meta = CONFEDERATIONS_META.find((c) => c.id === confId);
      if (meta) {
        map.setView(meta.center, meta.zoom);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="border border-stone-300 dark:border-stone-800 p-6 bg-[#FBF9F5] dark:bg-[#141311] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
          <div>
            <div className="text-xs font-mono-tabular tracking-widest text-[#9E1B1B] dark:text-[#C5A059]">
              {lang === 'it'
                ? 'ATLANTE CARTOGRAFICO VETTORIALE · SERIE A, B E C · CONFEDERAZIONI E COPPE'
                : 'VECTOR CARTOGRAPHIC ATLAS · TIERS 1, 2 & 3 · CONFEDERATIONS & CUPS'}
            </div>
            <h2 className="text-3xl font-display font-bold tracking-wide mt-1">
              {lang === 'it'
                ? 'Mappa Globale delle Squadre (Serie A, B, C), Confederazioni e Tornei'
                : 'Global Club Pyramid Map (Tiers 1, 2, 3), Confederations & Cup Tournaments'}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
              {lang === 'it'
                ? 'Cartografia vettoriale integrata (Natural Earth 110m, zero dipendenza da server tile esterni o API key). Esplora gli stadi di Serie A, B e C, i confini delle 6 Confederazioni FIFA e le Coppe contrassegnate dall\'icona del trofeo 🏆.'
                : 'Self-contained Natural Earth 110m vector cartography (zero external tile API keys or watermarks). Explore Tier 1, 2, and 3 stadiums, FIFA Confederation borders, and Cup qualifiers marked with 🏆.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowConfedBoundaries((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                showConfedBoundaries
                  ? 'bg-[#0D0C0B] dark:bg-[#F7F4EE] text-[#F7F4EE] dark:text-[#0D0C0B]'
                  : 'border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'it' ? 'Confini Confederazioni' : 'Confederation Borders'}</span>
            </button>

            <button
              onClick={() => setShowCupBoundaries((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                showCupBoundaries
                  ? 'bg-[#C5A059] text-[#0D0C0B]'
                  : 'border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{lang === 'it' ? 'Aree Geografiche Coppe' : 'Cup Tournament Zones'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'it'
                  ? 'Cerca club (es. Catania, Palermo, Wrexham, Santos...)'
                  : 'Search club (e.g. Catania, Palermo, Wrexham, Santos...)'
              }
              className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:border-[#9E1B1B]"
            />
          </div>

          <div className="lg:col-span-4 flex flex-wrap items-center gap-1.5">
            {(['ALL', 1, 2, 3] as const).map((tierVal) => {
              const label =
                tierVal === 'ALL'
                  ? lang === 'it'
                    ? 'Tutte le Categorie'
                    : 'All Divisions'
                  : tierVal === 1
                  ? lang === 'it'
                    ? '1ª Div (Serie A / Top)'
                    : 'Tier 1 (Serie A / Top)'
                  : tierVal === 2
                  ? lang === 'it'
                    ? '2ª Div (Serie B / Champ.)'
                    : 'Tier 2 (Serie B / 2nd)'
                  : lang === 'it'
                  ? '3ª Div (Serie C / L1)'
                  : 'Tier 3 (Serie C / 3rd)';
              return (
                <button
                  key={String(tierVal)}
                  onClick={() => setSelectedTier(tierVal)}
                  className={`px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedTier === tierVal
                      ? 'bg-[#9E1B1B] text-white font-semibold'
                      : 'border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-500'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-4 flex flex-wrap items-center gap-1.5">
            {(['ALL', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'] as const).map((cId) => (
              <button
                key={cId}
                onClick={() => handleConfedClick(cId)}
                className={`px-2.5 py-1.5 text-xs font-mono-tabular transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedConfed === cId
                    ? 'bg-[#0D0C0B] dark:bg-[#F7F4EE] text-[#F7F4EE] dark:text-[#0D0C0B] font-bold'
                    : 'border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-500'
                }`}
              >
                {cId === 'ALL' ? (lang === 'it' ? 'Tutte (6)' : 'All (6)') : cId}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono-tabular text-stone-500 flex items-center gap-1 mr-1">
            <Trophy className="w-3.5 h-3.5 text-[#C5A059]" />
            {lang === 'it' ? 'Filtra per Coppa / Torneo:' : 'Filter by Cup / Tournament:'}
          </span>

          <button
            onClick={() => setSelectedCup('ALL')}
            className={`px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedCup === 'ALL'
                ? 'bg-[#C5A059] text-[#0D0C0B] font-bold'
                : 'border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
            }`}
          >
            {lang === 'it' ? 'Tutti i Tornei' : 'All Tournaments'}
          </button>

          {CUP_TOURNAMENTS_META.map((cup) => (
            <button
              key={cup.id}
              onClick={() => {
                setSelectedCup(cup.id);
                setShowCupBoundaries(true);
              }}
              className={`px-2.5 py-1 text-xs font-mono-tabular transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCup === cup.id
                  ? 'bg-[#C5A059] text-[#0D0C0B] font-bold'
                  : 'border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-[#C5A059]'
              }`}
            >
              🏆 {cup.shortLabel} ({cup.cadence === 'quadrennial' ? '4Y' : '1Y'})
            </button>
          ))}
        </div>
      </div>

      {/* Giant Interactive World Map + Active Club Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-9 h-[640px] border border-stone-300 dark:border-stone-800 relative overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>

        <div className="lg:col-span-3 border border-stone-300 dark:border-stone-800 p-5 bg-[#FBF9F5] dark:bg-[#141311] flex flex-col justify-between">
          {activeClub ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono-tabular text-stone-500">
                <span>
                  {activeClub.confederation} · TIER {activeClub.tier}
                </span>
                <span>Wikidata {activeClub.wikidataId}</span>
              </div>

              <div className="flex items-center gap-3.5 pt-1">
                <ClubCrest club={activeClub} size="lg" />
                <div>
                  <h3 className="text-xl font-display font-bold leading-tight">
                    {activeClub.name}
                  </h3>
                  <div className="text-xs text-stone-600 dark:text-stone-400">
                    {activeClub.leagueName} · {activeClub.country[lang]}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs">
                <div className="font-semibold text-stone-900 dark:text-stone-100">
                  🏟️ {activeClub.stadiumName}
                </div>
                <div className="text-stone-600 dark:text-stone-400">
                  {activeClub.city} · Capienza: {activeClub.capacity.toLocaleString()}
                </div>
                <div className="font-mono-tabular text-[11px] text-stone-500">
                  Coord: {activeClub.lat.toFixed(4)}° N, {activeClub.lng.toFixed(4)}° E
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                  {lang === 'it'
                    ? 'Tornei & Coppe (Annuali / Cicliche)'
                    : 'Cup Participation (Annual / Cyclic)'}
                </div>
                <div className="space-y-1.5">
                  {activeClub.cups.map((cId) => {
                    const meta = CUP_TOURNAMENTS_META.find((m) => m.id === cId);
                    return (
                      <div
                        key={cId}
                        className="flex items-center justify-between p-2 border border-stone-200 dark:border-stone-800 text-xs"
                      >
                        <span className="font-medium flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          {meta
                            ? meta.name[lang]
                            : lang === 'it'
                            ? 'Coppa Nazionale (Annuale)'
                            : 'Domestic National Cup (Annual)'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          <div className="pt-4 mt-6 border-t border-stone-200 dark:border-stone-800 text-xs font-mono-tabular text-stone-500 space-y-1">
            <div>
              {lang === 'it' ? 'Club visibili sulla mappa' : 'Visible clubs on map'}:{' '}
              <strong>{filteredClubs.length}</strong> / {WORLD_CLUBS_PYRAMID.length}
            </div>
            <div>
              🏆 = {lang === 'it' ? 'Qualificata a Coppe Internazionali' : 'International Cup Qualifier'}
            </div>
          </div>
        </div>
      </div>

      {/* Club Pyramid Directory Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold tracking-wide">
            {lang === 'it'
              ? `Elenco Stadi e Club Georeferenziati (${filteredClubs.length} Squadre)`
              : `Geo-Referenced Club & Stadium Directory (${filteredClubs.length} Clubs)`}
          </h3>
          <span className="text-xs font-mono-tabular text-stone-500">
            {lang === 'it'
              ? 'Clicca su una squadra per centrare lo stadio sulla mappa'
              : 'Click any club card to focus its stadium on the map'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredClubs.map((club) => (
            <button
              key={club.id}
              onClick={() => {
                setActiveClub(club);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setView([club.lat, club.lng], 8);
                }
              }}
              className={`p-3.5 text-left border transition-colors cursor-pointer flex items-start gap-3 ${
                activeClub?.id === club.id
                  ? 'border-[#9E1B1B] bg-[#9E1B1B]/5 dark:bg-[#9E1B1B]/15'
                  : 'border-stone-300 dark:border-stone-800 bg-[#FBF9F5] dark:bg-[#141311] hover:border-stone-500'
              }`}
            >
              <ClubCrest club={club} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 text-[10px] font-mono-tabular text-stone-500">
                  <span>
                    {club.confederation} · T{club.tier}
                  </span>
                  <span>{club.leagueName}</span>
                </div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate mt-0.5">
                  {club.name}
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 truncate">
                  {club.stadiumName} ({club.city})
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px] font-mono-tabular text-[#9E1B1B] dark:text-[#C5A059]">
                  {club.cups.map((c) => (
                    <span key={c}>🏆 {c === 'DOMESTIC_CUP' ? 'Cup' : c}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

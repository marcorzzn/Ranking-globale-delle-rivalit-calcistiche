import React, { useState } from 'react';
import { RivalryRecord } from '../data/rivalriesData';

export interface ScoredRivalry extends RivalryRecord {
  L: number;
  P: number;
  M: number;
  B: number;
  H: number; // Shannon entropy competitive balance (0 to 100)
  finalScore: number;
}

interface FuturistChartsProps {
  scoredRivalries: ScoredRivalry[];
  lang: 'it' | 'en';
  darkMode: boolean;
}

export const FuturistCharts: React.FC<FuturistChartsProps> = ({
  scoredRivalries,
  lang,
}) => {
  const [compareA, setCompareA] = useState<string>(scoredRivalries[0]?.id || 'old_firm');
  const [compareB, setCompareB] = useState<string>(scoredRivalries[1]?.id || 'superclasico_argentina');

  const rivalryA = scoredRivalries.find((r) => r.id === compareA) || scoredRivalries[0];
  const rivalryB = scoredRivalries.find((r) => r.id === compareB) || scoredRivalries[1];

  // Radar Axes: L (League), P (Precedents), M (Longevity), B_norm (Geog Bonus), H (Shannon Entropy)
  const axes = [
    { key: 'L', label: lang === 'it' ? 'Prestigio Lega (L)' : 'League Prestige (L)' },
    { key: 'P', label: lang === 'it' ? 'Precedenti Log (P)' : 'Log Precedents (P)' },
    { key: 'M', label: lang === 'it' ? 'Longevità Decenni (M)' : 'Decade Longevity (M)' },
    { key: 'H', label: lang === 'it' ? 'Equilibrio W/D/L (H)' : 'W/D/L Balance (H)' },
    { key: 'B_norm', label: lang === 'it' ? 'Prossimità Civica (B)' : 'Civic Proximity (B)' },
  ];

  const getAxisVal = (r: ScoredRivalry, key: string) => {
    if (key === 'L') return r.L;
    if (key === 'P') return r.P;
    if (key === 'M') return r.M;
    if (key === 'H') return r.H;
    if (key === 'B_norm') return r.B === 1.15 ? 100 : r.B === 1.05 ? 70 : 45;
    return 50;
  };

  const buildPolygonPoints = (r: ScoredRivalry, radius = 110, cx = 160, cy = 150) => {
    return axes
      .map((axis, idx) => {
        const angle = (Math.PI * 2 * idx) / axes.length - Math.PI / 2;
        const val = getAxisVal(r, axis.key) / 100;
        const x = cx + Math.cos(angle) * radius * val;
        const y = cy + Math.sin(angle) * radius * val;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  // Continent aggregations
  const continentTotals = scoredRivalries.reduce<Record<string, { matches: number; count: number; avgScore: number }>>(
    (acc, r) => {
      if (!acc[r.continent]) {
        acc[r.continent] = { matches: 0, count: 0, avgScore: 0 };
      }
      acc[r.continent].matches += r.pRaw;
      acc[r.continent].count += 1;
      acc[r.continent].avgScore += r.finalScore;
      return acc;
    },
    {}
  );

  const totalMatchesAll = Object.values(continentTotals).reduce((sum, c) => sum + c.matches, 0);

  return (
    <div className="space-y-12">
      {/* Row 1: Radar Comparator + Continental Proportion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Chart 1: 5-Axis Spider Comparator */}
        <div className="border border-stone-300 dark:border-stone-800 p-6 flex flex-col justify-between bg-[#FBF9F5] dark:bg-[#141311]">
          <div>
            <div className="text-xs tracking-widest text-stone-500 dark:text-stone-400">
              {lang === 'it' ? 'DIAGRAMMA 01 · CONFRONTO POLARE A 5 ASSI' : 'DIAGRAM 01 · 5-AXIS POLAR COMPARATOR'}
            </div>
            <h3 className="text-2xl font-display font-bold tracking-wide mt-1 text-stone-900 dark:text-stone-100">
              {lang === 'it' ? 'Geometria Comparata della Rivalità' : 'Comparative Rivalry Geometry'}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              {lang === 'it'
                ? 'Confronta due rivalità sui 4 parametri della formula più l\'Entropia di Shannon (equilibrio storico W/D/L).'
                : 'Compare any two rivalries across the 4 formula parameters plus Shannon Entropy (historical W/D/L balance).'}
            </p>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs text-[#9E1B1B] font-semibold mb-1">
                  {lang === 'it' ? 'Rivalità Rosso Carminio' : 'Crimson Rivalry'}
                </label>
                <select
                  value={compareA}
                  onChange={(e) => setCompareA(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                >
                  {scoredRivalries.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name[lang]} ({r.finalScore.toFixed(1)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#C5A059] font-semibold mb-1">
                  {lang === 'it' ? 'Rivalità Oro Imperiale' : 'Imperial Gold Rivalry'}
                </label>
                <select
                  value={compareB}
                  onChange={(e) => setCompareB(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                >
                  {scoredRivalries.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name[lang]} ({r.finalScore.toFixed(1)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Radar SVG */}
          <div className="my-4 flex justify-center">
            <svg viewBox="0 0 320 300" className="w-full max-w-[340px] h-auto">
              {/* Concentric Pentagons */}
              {[0.25, 0.5, 0.75, 1].map((scale) => {
                const pts = axes
                  .map((_, idx) => {
                    const angle = (Math.PI * 2 * idx) / axes.length - Math.PI / 2;
                    const x = 160 + Math.cos(angle) * 110 * scale;
                    const y = 150 + Math.sin(angle) * 110 * scale;
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  })
                  .join(' ');
                return (
                  <polygon
                    key={scale}
                    points={pts}
                    fill="none"
                    stroke="currentColor"
                    className="text-stone-300 dark:text-stone-700"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Radial Spokes & Labels */}
              {axes.map((axis, idx) => {
                const angle = (Math.PI * 2 * idx) / axes.length - Math.PI / 2;
                const x2 = 160 + Math.cos(angle) * 110;
                const y2 = 150 + Math.sin(angle) * 110;
                const lx = 160 + Math.cos(angle) * 134;
                const ly = 150 + Math.sin(angle) * 128;
                return (
                  <g key={axis.key}>
                    <line
                      x1="160"
                      y1="150"
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      className="text-stone-300 dark:text-stone-700"
                      strokeWidth="1"
                    />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-stone-700 dark:fill-stone-300 text-[9px] font-mono-tabular"
                    >
                      {axis.label}
                    </text>
                  </g>
                );
              })}

              {/* Rivalry B Polygon */}
              {rivalryB && (
                <polygon
                  points={buildPolygonPoints(rivalryB)}
                  fill="#C5A059"
                  fillOpacity="0.25"
                  stroke="#C5A059"
                  strokeWidth="2.5"
                />
              )}

              {/* Rivalry A Polygon */}
              {rivalryA && (
                <polygon
                  points={buildPolygonPoints(rivalryA)}
                  fill="#9E1B1B"
                  fillOpacity="0.32"
                  stroke="#9E1B1B"
                  strokeWidth="2.5"
                />
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs font-mono-tabular border-t border-stone-200 dark:border-stone-800 pt-3 text-stone-600 dark:text-stone-400">
            <span>
              {rivalryA?.name[lang]}: <strong>{rivalryA?.finalScore.toFixed(2)} pt</strong>
            </span>
            <span>·</span>
            <span>
              {rivalryB?.name[lang]}: <strong>{rivalryB?.finalScore.toFixed(2)} pt</strong>
            </span>
          </div>
        </div>

        {/* Chart 2: Continental Volume & Proportion Treemap Bars */}
        <div className="border border-stone-300 dark:border-stone-800 p-6 flex flex-col justify-between bg-[#FBF9F5] dark:bg-[#141311]">
          <div>
            <div className="text-xs tracking-widest text-stone-500 dark:text-stone-400">
              {lang === 'it' ? 'DIAGRAMMA 02 · DENSITÀ CONTINENTALE E VOLUME STORICO' : 'DIAGRAM 02 · CONTINENTAL DENSITY & MATCH VOLUME'}
            </div>
            <h3 className="text-2xl font-display font-bold tracking-wide mt-1 text-stone-900 dark:text-stone-100">
              {lang === 'it' ? 'Ripartizione per Massa Critica di Incontri' : 'Distribution by Historical Match Mass'}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              {lang === 'it'
                ? `Volume complessivo certificato: ${totalMatchesAll.toLocaleString()} partite ufficiali distribuite su 6 confederazioni.`
                : `Total certified volume: ${totalMatchesAll.toLocaleString()} official fixtures distributed across 6 confederations.`}
            </p>

            <div className="mt-6 space-y-4">
              {Object.entries(continentTotals)
                .sort((a, b) => b[1].matches - a[1].matches)
                .map(([cont, stats]) => {
                  const pct = ((stats.matches / totalMatchesAll) * 100).toFixed(1);
                  const avg = (stats.avgScore / stats.count).toFixed(1);
                  return (
                    <div key={cont} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono-tabular">
                        <span className="font-semibold text-stone-900 dark:text-stone-100">
                          {cont} ({stats.count} {lang === 'it' ? 'rivalità' : 'rivalries'})
                        </span>
                        <span className="text-stone-600 dark:text-stone-400">
                          {stats.matches.toLocaleString()} match · {pct}% · Media R={avg}
                        </span>
                      </div>
                      <div className="w-full h-5 bg-stone-200 dark:bg-stone-800 overflow-hidden flex">
                        <div
                          className="h-full bg-[#9E1B1B] transition-all duration-200"
                          style={{ width: `${Math.max(Number(pct), 4)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="text-xs font-mono-tabular border-t border-stone-200 dark:border-stone-800 pt-3 text-stone-500 dark:text-stone-400">
            {lang === 'it'
              ? 'Fonte: Infobox Wikipedia verificati · Nessuna stima ammessa'
              : 'Source: Verified Wikipedia Infoboxes · Zero estimations permitted'}
          </div>
        </div>
      </div>

      {/* Row 2: Chronological Longevity Span (1880 - 2025) */}
      <div className="border border-stone-300 dark:border-stone-800 p-6 bg-[#FBF9F5] dark:bg-[#141311]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs tracking-widest text-stone-500 dark:text-stone-400">
              {lang === 'it' ? 'DIAGRAMMA 03 · CRONOLOGIA ININTERROTTA (1881–2025)' : 'DIAGRAM 03 · CONTINUOUS LONGEVITY TIMELINE (1881–2025)'}
            </div>
            <h3 className="text-2xl font-display font-bold tracking-wide mt-1 text-stone-900 dark:text-stone-100">
              {lang === 'it' ? 'Arco Storico e Decenni Consecutivi (Parametro M)' : 'Historical Arc & Consecutive Decades (Parameter M)'}
            </h3>
          </div>
          <div className="text-xs font-mono-tabular text-stone-500 dark:text-stone-400">
            1880 ──────────────────────── 1950 ──────────────────────── 2025
          </div>
        </div>

        <div className="space-y-2.5">
          {scoredRivalries
            .slice()
            .sort((a, b) => a.firstYear - b.firstYear)
            .slice(0, 14)
            .map((r) => {
              const minYear = 1880;
              const maxYear = 2026;
              const leftPct = ((r.firstYear - minYear) / (maxYear - minYear)) * 100;
              const widthPct = ((r.lastYear - r.firstYear) / (maxYear - minYear)) * 100;

              return (
                <div key={r.id} className="grid grid-cols-12 items-center gap-3 text-xs">
                  <div className="col-span-4 sm:col-span-3 truncate font-medium text-stone-800 dark:text-stone-200">
                    {r.name[lang]}
                  </div>
                  <div className="col-span-6 sm:col-span-7 relative h-4 bg-stone-200 dark:bg-stone-800">
                    <div
                      className="absolute top-0 bottom-0 bg-[#0D0C0B] dark:bg-[#C5A059] border-l-2 border-[#9E1B1B]"
                      style={{
                        left: `${Math.max(0, leftPct)}%`,
                        width: `${Math.min(100 - leftPct, Math.max(widthPct, 2))}%`,
                      }}
                    />
                  </div>
                  <div className="col-span-2 text-right font-mono-tabular text-stone-600 dark:text-stone-400">
                    {r.firstYear}–{r.lastYear} ({r.consecutiveDecades}d)
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

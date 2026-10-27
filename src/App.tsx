import React, { useMemo, useState, useEffect } from 'react';
import {
  VERIFIED_RIVALRIES,
  OPTA_LEAGUES,
  EXCLUDED_AUDIT_RECORDS,
  Continent,
  RivalryType,
} from './data/rivalriesData';
import { ADDITIONAL_RIVALRIES } from './data/additionalRivalries';
import { ClubCrest } from './components/ClubCrest';
import { StadiumMap } from './components/StadiumMap';
import { FuturistCharts, ScoredRivalry } from './components/FuturistCharts';
import { PosterExporter } from './components/PosterExporter';
import { usePWAInstall, useOnlineStatus } from './usePWAInstall';
import { Search, ExternalLink, RotateCcw, Download, Globe, Sun, Moon } from 'lucide-react';

type ActiveSection = 'ranking' | 'encyclopaedia' | 'map' | 'charts' | 'method';

const ALL_RIVALRIES = [...VERIFIED_RIVALRIES, ...ADDITIONAL_RIVALRIES];

export default function App() {
  const [lang, setLang] = useState<'it' | 'en'>('it');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('ranking');

  // Formula raw slider values (auto-normalized to sum = 1.00)
  const [rawWL, setRawWL] = useState<number>(40);
  const [rawWP, setRawWP] = useState<number>(35);
  const [rawWM, setRawWM] = useState<number>(25);

  // Encyclopaedia & Ranking filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [continentFilter, setContinentFilter] = useState<Continent | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<RivalryType | 'ALL'>('ALL');
  const [selectedRivalryId, setSelectedRivalryId] = useState<string | null>('old_firm');
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Normalized weights
  const weights = useMemo(() => {
    const total = rawWL + rawWP + rawWM || 1;
    return {
      wL: rawWL / total,
      wP: rawWP / total,
      wM: rawWM / total,
    };
  }, [rawWL, rawWP, rawWM]);

  // Calculate R = (wL*L + wP*P + wM*M) * B for all verified rivalries
  const scoredRivalries = useMemo<ScoredRivalry[]>(() => {
    const maxP = Math.max(...ALL_RIVALRIES.map((r) => r.pRaw), 569);
    const maxDecades = Math.max(...ALL_RIVALRIES.map((r) => r.consecutiveDecades), 14);

    return ALL_RIVALRIES.map((r) => {
      const leagueObj = OPTA_LEAGUES.find((l) => l.rank === r.leagueRank);
      const L = leagueObj ? leagueObj.optaRating : Math.max(50, 100 - r.leagueRank * 0.7);
      const P = (Math.log(1 + r.pRaw) / Math.log(1 + maxP)) * 100;
      const M = (r.consecutiveDecades / maxDecades) * 100;
      const B = r.type === 'city' ? 1.15 : r.type === 'regional' ? 1.05 : 1.0;

      // Shannon entropy of W/D/L distribution (normalized to 0-100)
      const totalWDL = r.winsA + r.draws + r.winsB || 1;
      const probs = [r.winsA / totalWDL, r.draws / totalWDL, r.winsB / totalWDL].filter(
        (p) => p > 0
      );
      const shannonRaw = -probs.reduce((acc, p) => acc + p * Math.log(p), 0);
      const H = (shannonRaw / Math.log(3)) * 100;

      const baseScore = weights.wL * L + weights.wP * P + weights.wM * M;
      const finalScore = baseScore * B;

      return {
        ...r,
        L,
        P,
        M,
        B,
        H,
        finalScore,
      };
    }).sort((a, b) => b.finalScore - a.finalScore);
  }, [weights]);

  // Filtered rivalries
  const filteredRivalries = useMemo(() => {
    return scoredRivalries.filter((r) => {
      if (continentFilter !== 'ALL' && r.continent !== continentFilter) return false;
      if (typeFilter !== 'ALL' && r.type !== typeFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = r.name[lang].toLowerCase().includes(q);
        const matchClubs =
          r.clubA.name.toLowerCase().includes(q) || r.clubB.name.toLowerCase().includes(q);
        const matchCountry = r.country[lang].toLowerCase().includes(q);
        const matchLeague = r.leagueName.toLowerCase().includes(q);
        return matchName || matchClubs || matchCountry || matchLeague;
      }
      return true;
    });
  }, [scoredRivalries, continentFilter, typeFilter, searchQuery, lang]);

  const resetWeights = () => {
    setRawWL(40);
    setRawWP(35);
    setRawWM(25);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] dark:bg-[#0D0C0B] text-[#141311] dark:text-[#F7F4EE] transition-colors duration-150">
      {/* Offline banner if needed */}
      {!isOnline && (
        <div className="bg-[#9E1B1B] text-[#F7F4EE] text-xs font-mono-tabular px-6 py-2 text-center">
          {lang === 'it'
            ? 'Modalità Offline attiva — consultazione dell\'archivio locale verificato.'
            : 'Offline Mode active — browsing verified local archive.'}
        </div>
      )}

      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 bg-[#F7F4EE]/95 dark:bg-[#0D0C0B]/95 backdrop-blur-xs border-b border-stone-300 dark:border-stone-800">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection('ranking');
          }}
          className="text-2xl font-display font-extrabold tracking-wider text-[#9E1B1B] dark:text-[#F7F4EE] whitespace-nowrap shrink-0"
        >
          RIVALITÀ
        </a>

        {/* Zone 2: 5 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700 dark:text-stone-300">
          <button
            onClick={() => setActiveSection('ranking')}
            className={`hover:text-[#9E1B1B] dark:hover:text-[#C5A059] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeSection === 'ranking'
                ? 'border-b-2 border-[#9E1B1B] text-stone-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            {lang === 'it' ? 'Classifica' : 'Ranking'}
          </button>
          <button
            onClick={() => setActiveSection('encyclopaedia')}
            className={`hover:text-[#9E1B1B] dark:hover:text-[#C5A059] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeSection === 'encyclopaedia'
                ? 'border-b-2 border-[#9E1B1B] text-stone-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            {lang === 'it' ? 'Enciclopedia' : 'Encyclopaedia'}
          </button>
          <button
            onClick={() => setActiveSection('map')}
            className={`hover:text-[#9E1B1B] dark:hover:text-[#C5A059] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeSection === 'map'
                ? 'border-b-2 border-[#9E1B1B] text-stone-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            {lang === 'it' ? 'Mappa Stadi' : 'Stadium Map'}
          </button>
          <button
            onClick={() => setActiveSection('charts')}
            className={`hover:text-[#9E1B1B] dark:hover:text-[#C5A059] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeSection === 'charts'
                ? 'border-b-2 border-[#9E1B1B] text-stone-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            {lang === 'it' ? 'Diagrammi' : 'Diagrams'}
          </button>
          <button
            onClick={() => setActiveSection('method')}
            className={`hover:text-[#9E1B1B] dark:hover:text-[#C5A059] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeSection === 'method'
                ? 'border-b-2 border-[#9E1B1B] text-stone-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            {lang === 'it' ? 'Metodo & Audit' : 'Method & Audit'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => {
              setActiveSection('ranking');
              const el = document.getElementById('poster-export-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 text-xs font-semibold bg-[#9E1B1B] text-[#F7F4EE] hover:bg-[#7f1515] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {lang === 'it' ? 'Esporta Tavole 1:2' : 'Export 1:2 Slides'}
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="top" className="max-w-[1360px] mx-auto px-6 lg:px-12 py-10 space-y-12">
        {/* Hero & Operational Utility Bar (Language, Theme, PWA Install, Source Snapshot) */}
        <section className="border-b border-stone-300 dark:border-stone-800 pb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200 dark:border-stone-800/80 text-xs font-mono-tabular text-stone-600 dark:text-stone-400">
            <div className="flex flex-wrap items-center gap-2">
              <span>
                {lang === 'it'
                  ? 'Snapshot Opta Power Rankings: Settembre 2025'
                  : 'Opta Power Rankings Snapshot: September 2025'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {lang === 'it'
                  ? 'Orizzonte storico: 50 stagioni (1975/76–2025/26)'
                  : 'Historical horizon: 50 seasons (1975/76–2025/26)'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {lang === 'it'
                  ? 'Coordinate Wikidata P625: 100% verificate'
                  : 'Wikidata P625 Coordinates: 100% verified'}
              </span>
            </div>

            {/* Workspace Controls: Bilingual IT/EN Switcher + Dark/Light Mode + PWA Install */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="inline-flex border border-stone-300 dark:border-stone-700">
                <button
                  onClick={() => setLang('it')}
                  className={`px-3 py-1 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    lang === 'it'
                      ? 'bg-[#0D0C0B] dark:bg-[#F7F4EE] text-[#F7F4EE] dark:text-[#0D0C0B]'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  IT · Italiano
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    lang === 'en'
                      ? 'bg-[#0D0C0B] dark:bg-[#F7F4EE] text-[#F7F4EE] dark:text-[#0D0C0B]'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  EN · English
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode((d) => !d)}
                className="inline-flex items-center gap-1.5 px-3 py-1 border border-stone-300 dark:border-stone-700 text-xs font-medium hover:border-stone-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                aria-label="Toggle Dark or Light Mode"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{darkMode ? (lang === 'it' ? 'Chiaro' : 'Light') : lang === 'it' ? 'Scuro' : 'Dark'}</span>
              </button>

              {/* PWA Install Button */}
              {!isInstalled && isInstallable && (
                <button
                  onClick={install}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C5A059] text-[#0D0C0B] text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'it' ? 'Installa App' : 'Install App'}</span>
                </button>
              )}
              {!isInstalled && !isInstallable && isIOS && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#C5A059] text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>iOS PWA</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Section Navigation */}
          <div className="flex md:hidden overflow-x-auto gap-2 pb-4 mb-6 border-b border-stone-200 dark:border-stone-800">
            {(['ranking', 'encyclopaedia', 'map', 'charts', 'method'] as ActiveSection[]).map(
              (sec) => (
                <button
                  key={sec}
                  onClick={() => setActiveSection(sec)}
                  className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 ${
                    activeSection === sec
                      ? 'bg-[#9E1B1B] text-white'
                      : 'border border-stone-300 dark:border-stone-700'
                  }`}
                >
                  {sec.toUpperCase()}
                </button>
              )
            )}
          </div>

          {/* Futurist Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="text-xs font-mono-tabular tracking-widest text-[#9E1B1B] dark:text-[#C5A059] uppercase">
                {lang === 'it'
                  ? 'ATLANTE ENCICLOPEDICO E CLASSIFICA SCIENTIFICA DELLE RIVALITÀ CALCISTICHE'
                  : 'ENCYCLOPAEDIC ATLAS & SCIENTIFIC RANKING OF ASSOCIATION FOOTBALL RIVALRIES'}
              </div>
              <h1
                className="font-display font-extrabold text-stone-950 dark:text-[#F7F4EE] tracking-tight mt-2 leading-[0.95]"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.25rem)', textWrap: 'balance' }}
              >
                {lang === 'it'
                  ? 'IL CANONE MONDIALE DELLE RIVALITÀ CALCISTICHE'
                  : 'THE GLOBAL CANON OF FOOTBALL RIVALRIES'}
              </h1>
              <p className="text-base text-stone-700 dark:text-stone-300 mt-4 max-w-2xl leading-relaxed">
                {lang === 'it'
                  ? 'Un archivio rigoroso basato su Wikipedia (Category:Association football rivalries) e ponderato sull\'intera classifica mondiale dei campionati stilata da Opta. Ogni scontro diretto, decennio consecutivo e coordinata geografica è verificato da fonte primaria, senza dati stimati.'
                  : 'A rigorous archive grounded in Wikipedia (Category:Association football rivalries) and weighted across the full global Opta league ranking. Every head-to-head total, consecutive decade, and stadium coordinate is verified from primary records with zero estimated values.'}
              </p>
            </div>

            {/* Hero Formula Summary Box */}
            <div className="lg:col-span-4 border border-stone-300 dark:border-stone-800 p-5 bg-[#FBF9F5] dark:bg-[#141311]">
              <div className="text-xs font-mono-tabular text-stone-500 dark:text-stone-400">
                {lang === 'it' ? 'EQUAZIONE ATTIVA IN TEMPO REALE' : 'LIVE SCIENTIFIC EQUATION'}
              </div>
              <div className="font-mono-tabular text-lg font-bold text-[#9E1B1B] dark:text-[#C5A059] mt-1">
                R = ({weights.wL.toFixed(2)}·L + {weights.wP.toFixed(2)}·P + {weights.wM.toFixed(2)}·M) × B
              </div>
              <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-1 font-mono-tabular">
                <div>L = Opta Power Ranking (Snapshot Settembre 2025)</div>
                <div>P = Log(1 + Precedenti) / Log(1 + 569 max)</div>
                <div>M = Decenni consecutivi (max 14 decadi)</div>
                <div>B = ×1.15 Cittadino · ×1.05 Regionale · ×1.00 Nazionale</div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Filter & Parameter Control Bar */}
        <section className="border border-stone-300 dark:border-stone-800 p-6 bg-[#FBF9F5] dark:bg-[#141311] space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h2 className="text-xl font-display font-bold tracking-wide">
                {lang === 'it'
                  ? '01. Calibrazione Parametri Scientifica & Filtri Geografici'
                  : '01. Scientific Parameter Calibration & Geographic Filters'}
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                {lang === 'it'
                  ? 'Modifica i pesi di Prestigio Lega (wL), Precedenti Storici (wP) e Longevità (wM). La somma è normalizzata automaticamente a 1.00.'
                  : 'Adjust weights for League Prestige (wL), Historical Precedents (wP), and Longevity (wM). Weights auto-normalize to 1.00.'}
              </p>
            </div>
            <button
              onClick={resetWeights}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-tabular border border-stone-300 dark:border-stone-700 hover:border-[#9E1B1B] transition-colors cursor-pointer self-start lg:self-auto whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'it' ? 'Ripristina Default (0.40 / 0.35 / 0.25)' : 'Reset Default (0.40 / 0.35 / 0.25)'}</span>
            </button>
          </div>

          {/* 3 Weight Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono-tabular">
                <label htmlFor="slider-wl" className="font-semibold">
                  {lang === 'it' ? 'wL · Prestigio Lega Opta' : 'wL · Opta League Prestige'}
                </label>
                <span className="text-[#9E1B1B] dark:text-[#C5A059] font-bold">
                  {(weights.wL * 100).toFixed(0)}% ({weights.wL.toFixed(2)})
                </span>
              </div>
              <input
                id="slider-wl"
                type="range"
                min="0"
                max="100"
                value={rawWL}
                onChange={(e) => setRawWL(Number(e.target.value))}
                className="w-full accent-[#9E1B1B] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono-tabular">
                <label htmlFor="slider-wp" className="font-semibold">
                  {lang === 'it' ? 'wP · Precedenti Storici (Log)' : 'wP · Historical Matches (Log)'}
                </label>
                <span className="text-[#9E1B1B] dark:text-[#C5A059] font-bold">
                  {(weights.wP * 100).toFixed(0)}% ({weights.wP.toFixed(2)})
                </span>
              </div>
              <input
                id="slider-wp"
                type="range"
                min="0"
                max="100"
                value={rawWP}
                onChange={(e) => setRawWP(Number(e.target.value))}
                className="w-full accent-[#9E1B1B] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono-tabular">
                <label htmlFor="slider-wm" className="font-semibold">
                  {lang === 'it' ? 'wM · Longevità Decenni Consecutivi' : 'wM · Consecutive Decades'}
                </label>
                <span className="text-[#9E1B1B] dark:text-[#C5A059] font-bold">
                  {(weights.wM * 100).toFixed(0)}% ({weights.wM.toFixed(2)})
                </span>
              </div>
              <input
                id="slider-wm"
                type="range"
                min="0"
                max="100"
                value={rawWM}
                onChange={(e) => setRawWM(Number(e.target.value))}
                className="w-full accent-[#9E1B1B] cursor-pointer"
              />
            </div>
          </div>

          {/* Search & Continent / Type Segmented Controls */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'it'
                    ? 'Cerca derby, squadra, nazione o campionato...'
                    : 'Search derby, club, country, or league...'
                }
                className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:border-[#9E1B1B]"
              />
            </div>

            {/* Continent Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                ['ALL', 'Europa', 'Sud America', 'Nord America', 'Asia', 'Africa', 'Oceania'] as const
              ).map((c) => (
                <button
                  key={c}
                  onClick={() => setContinentFilter(c)}
                  className={`px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    continentFilter === c
                      ? 'bg-[#0D0C0B] dark:bg-[#F7F4EE] text-[#F7F4EE] dark:text-[#0D0C0B]'
                      : 'border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-500'
                  }`}
                >
                  {c === 'ALL' ? (lang === 'it' ? 'Tutti i Continenti' : 'All Continents') : c}
                </button>
              ))}
            </div>

            {/* Rivalry Type Filter */}
            <div className="flex items-center gap-1.5">
              {(['ALL', 'city', 'regional', 'national'] as const).map((t) => {
                const label =
                  t === 'ALL'
                    ? lang === 'it'
                      ? 'Tutti i Tipi'
                      : 'All Types'
                    : t === 'city'
                    ? lang === 'it'
                      ? 'Cittadino (×1.15)'
                      : 'City (×1.15)'
                    : t === 'regional'
                    ? lang === 'it'
                      ? 'Regionale (×1.05)'
                      : 'Regional (×1.05)'
                    : lang === 'it'
                    ? 'Nazionale (×1.00)'
                    : 'National (×1.00)';
                return (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      typeFilter === t
                        ? 'bg-[#9E1B1B] text-white'
                        : 'border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-500'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 1: SCIENTIFIC RANKING + 1:2 SLIDE EXPORT */}
        {activeSection === 'ranking' && (
          <div className="space-y-12">
            <section className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-display font-bold tracking-wide">
                  {lang === 'it'
                    ? `02. Classifica Scientifica Ponderata (${filteredRivalries.length} Rivalità Verificate)`
                    : `02. Weighted Scientific Ranking (${filteredRivalries.length} Verified Rivalries)`}
                </h2>
                <span className="text-xs font-mono-tabular text-stone-500">
                  {lang === 'it'
                    ? 'Zero voci con flag assumed_ongoing · 100% fonti primarie'
                    : 'Zero assumed_ongoing flags · 100% primary sources'}
                </span>
              </div>

              <div className="overflow-x-auto border border-stone-300 dark:border-stone-800 bg-[#FBF9F5] dark:bg-[#141311]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-300 dark:border-stone-800 text-[11px] font-mono-tabular text-stone-500 dark:text-stone-400 bg-stone-100/70 dark:bg-stone-900/60">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">{lang === 'it' ? 'Rivalità & Storia' : 'Rivalry & History'}</th>
                      <th className="py-3 px-4">{lang === 'it' ? 'Club Contendenti (Wikidata P154)' : 'Contending Clubs (Wikidata P154)'}</th>
                      <th className="py-3 px-4">{lang === 'it' ? 'Lega Opta' : 'Opta League'}</th>
                      <th className="py-3 px-4 text-right">{lang === 'it' ? 'Precedenti (P)' : 'Matches (P)'}</th>
                      <th className="py-3 px-4 text-right">{lang === 'it' ? 'Longevità (M)' : 'Longevity (M)'}</th>
                      <th className="py-3 px-4 text-right">Bonus (B)</th>
                      <th className="py-3 px-4 text-right text-[#9E1B1B] dark:text-[#C5A059]">
                        {lang === 'it' ? 'Indice R' : 'Index R'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-sm">
                    {filteredRivalries.map((r, index) => (
                      <tr
                        key={r.id}
                        className="hover:bg-stone-200/40 dark:hover:bg-stone-800/40 transition-colors align-top"
                      >
                        <td className="py-4 px-4 font-display font-bold text-xl text-[#9E1B1B] dark:text-[#C5A059] font-mono-tabular">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="py-4 px-4 max-w-md">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 dark:text-stone-100">
                              {r.name[lang]}
                            </span>
                            <a
                              href={r.wikipediaUrl[lang]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-stone-400 hover:text-[#9E1B1B] inline-flex items-center"
                              title="Wikipedia Fonte"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                            {r.history[lang]}
                          </p>
                          <div className="text-[11px] font-mono-tabular text-stone-500 mt-2">
                            {r.country[lang]} · {r.continent} · W/D/L: {r.winsA}/{r.draws}/{r.winsB} ·{' '}
                            {r.lastYearSource}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                              <ClubCrest club={r.clubA} size="sm" />
                              <div>
                                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                                  {r.clubA.name}
                                </div>
                                <div className="text-[11px] text-stone-500">{r.clubA.stadiumName}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <ClubCrest club={r.clubB} size="sm" />
                              <div>
                                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                                  {r.clubB.name}
                                </div>
                                <div className="text-[11px] text-stone-500">{r.clubB.stadiumName}</div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono-tabular text-xs">
                          <div className="font-semibold text-stone-900 dark:text-stone-100">
                            #{r.leagueRank} {r.leagueName}
                          </div>
                          <div className="text-stone-500">L = {r.L.toFixed(1)}</div>
                        </td>
                        <td className="py-4 px-4 text-right font-mono-tabular">
                          <div className="font-bold text-stone-900 dark:text-stone-100">{r.pRaw}</div>
                          <div className="text-[11px] text-stone-500">P = {r.P.toFixed(1)}</div>
                        </td>
                        <td className="py-4 px-4 text-right font-mono-tabular">
                          <div className="font-bold text-stone-900 dark:text-stone-100">
                            {r.consecutiveDecades} {lang === 'it' ? 'dec.' : 'dec.'}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {r.firstYear}–{r.lastYear}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-mono-tabular text-xs">
                          ×{r.B.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-right font-mono-tabular">
                          <span className="text-lg font-bold text-[#9E1B1B] dark:text-[#C5A059]">
                            {r.finalScore.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Opta League Matrix Grouped by League Rank */}
            <section className="space-y-4">
              <div>
                <h3 className="text-xl font-display font-bold tracking-wide">
                  {lang === 'it'
                    ? '03. Matrice Globale per Posizione nel Ranking Opta dei Campionati'
                    : '03. Global Matrix by Opta League Ranking Position'}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {lang === 'it'
                    ? 'Elenco ordinato dal 1° posto (Premier League) fino oltre la 50ª posizione della classifica mondiale Opta (Snapshot Settembre 2025).'
                    : 'Ordered from Rank #1 (Premier League) beyond Rank #50 of the global Opta Power Rankings (September 2025 Snapshot).'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {OPTA_LEAGUES.map((league) => {
                  const leagueRivalries = scoredRivalries.filter(
                    (r) => r.leagueRank === league.rank
                  );
                  return (
                    <div
                      key={league.id}
                      className="border border-stone-300 dark:border-stone-800 p-4 bg-[#FBF9F5] dark:bg-[#141311] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono-tabular text-stone-500">
                          <span>OPTA RANK #{String(league.rank).padStart(2, '0')}</span>
                          <span>RATING {league.optaRating.toFixed(1)}</span>
                        </div>
                        <div className="font-display font-bold text-lg mt-0.5 text-stone-900 dark:text-stone-100">
                          {league.name} · {league.country[lang]}
                        </div>
                        {leagueRivalries.length > 0 ? (
                          <ul className="mt-3 space-y-1.5 border-t border-stone-200 dark:border-stone-800 pt-2.5 text-xs">
                            {leagueRivalries.map((lr) => (
                              <li key={lr.id} className="flex items-center justify-between">
                                <span className="font-medium text-stone-800 dark:text-stone-200 truncate pr-2">
                                  {lr.name[lang]}
                                </span>
                                <span className="font-mono-tabular text-[#9E1B1B] dark:text-[#C5A059] shrink-0">
                                  R={lr.finalScore.toFixed(1)} ({lr.pRaw}m)
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-3 pt-2.5 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-400 italic">
                            {lang === 'it'
                              ? 'Lega censita nel denominatore Opta L'
                              : 'League indexed in Opta L denominator'}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 1:2 Slide Export Anchor */}
            <div id="poster-export-anchor">
              <PosterExporter scoredRivalries={scoredRivalries} weights={weights} lang={lang} />
            </div>
          </div>
        )}

        {/* SECTION 2: ENCYCLOPAEDIA */}
        {activeSection === 'encyclopaedia' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold tracking-wide">
                {lang === 'it'
                  ? 'Enciclopedia Storica Bilingue (Wikipedia Category:Association football rivalries)'
                  : 'Bilingual Historical Encyclopaedia (Wikipedia Category:Association football rivalries)'}
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                {lang === 'it'
                  ? 'Ogni scheda include i loghi ufficiali vettoriali (Wikidata P154), il motivo storico della rivalità, il bilancio W/D/L e il collegamento diretto alla voce Wikipedia.'
                  : 'Every entry features official club crests (Wikidata P154), the historical origin of the rivalry, W/D/L records, and direct Wikipedia links.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRivalries.map((r) => (
                <article
                  key={r.id}
                  className="border border-stone-300 dark:border-stone-800 p-6 bg-[#FBF9F5] dark:bg-[#141311] flex flex-col justify-between"
                >
                  <div>
                    {/* Quiet unboxed metadata line */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-stone-500 dark:text-stone-400">
                      <span>{r.continent}</span>
                      <span aria-hidden="true">·</span>
                      <span>{r.country[lang]}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {r.leagueName} (Opta #{r.leagueRank})
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {r.firstYear}–{r.lastYear}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4 mt-2">
                      <h3 className="text-2xl font-display font-bold tracking-wide text-stone-900 dark:text-stone-100">
                        {r.name[lang]}
                      </h3>
                      <span className="font-mono-tabular text-sm font-bold text-[#9E1B1B] dark:text-[#C5A059] shrink-0">
                        R = {r.finalScore.toFixed(2)}
                      </span>
                    </div>

                    {/* Club Crests Banner */}
                    <div className="my-4 py-3 px-4 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <ClubCrest club={r.clubA} size="md" />
                        <div className="min-w-0">
                          <div className="text-sm font-bold truncate">{r.clubA.name}</div>
                          <div className="text-xs text-stone-500 truncate">{r.clubA.stadiumName}</div>
                        </div>
                      </div>

                      <div className="text-xs font-mono-tabular font-bold text-stone-400 shrink-0">
                        VS
                      </div>

                      <div className="flex items-center gap-3 min-w-0 text-right">
                        <div className="min-w-0">
                          <div className="text-sm font-bold truncate">{r.clubB.name}</div>
                          <div className="text-xs text-stone-500 truncate">{r.clubB.stadiumName}</div>
                        </div>
                        <ClubCrest club={r.clubB} size="md" />
                      </div>
                    </div>

                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {r.history[lang]}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tabular">
                    <span className="text-stone-600 dark:text-stone-400">
                      {lang === 'it' ? 'Incontri ufficiali' : 'Official matches'}:{' '}
                      <strong>{r.pRaw}</strong> ({r.winsA}V · {r.draws}N · {r.winsB}P)
                    </span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          setSelectedRivalryId(r.id);
                          setActiveSection('map');
                        }}
                        className="text-[#9E1B1B] dark:text-[#C5A059] hover:underline cursor-pointer"
                      >
                        {lang === 'it' ? 'Vedi Stadi su Mappa' : 'View Stadiums on Map'}
                      </button>
                      <a
                        href={r.wikipediaUrl[lang]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-stone-700 dark:text-stone-300 hover:text-[#9E1B1B] underline"
                      >
                        <span>Wikipedia</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: INTERACTIVE STADIUM MAP */}
        {activeSection === 'map' && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold tracking-wide">
                  {lang === 'it'
                    ? 'Atlante Cartografico degli Stadi (Copertura 100% Wikidata P625)'
                    : 'Cartographic Stadium Atlas (100% Wikidata P625 Coordinate Coverage)'}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                  {lang === 'it'
                    ? 'Tutti i 56 stadi delle rivalità classificate sono georeferenziati e collegati da vettori direzionali. Clicca su uno stadio o seleziona una rivalità qui sotto per centrare la mappa.'
                    : 'All 56 stadiums across the ranked rivalries are geo-referenced and linked by directional vectors. Click any marker or select a rivalry below to focus the map.'}
                </p>
              </div>
              <div className="text-xs font-mono-tabular text-stone-500">
                {lang === 'it'
                  ? 'Linea continua = Derby Cittadino · Tratteggiata = Regionale/Nazionale'
                  : 'Solid line = City Derby · Dashed = Regional/National'}
              </div>
            </div>

            <StadiumMap
              rivalries={filteredRivalries}
              darkMode={darkMode}
              lang={lang}
              selectedRivalryId={selectedRivalryId}
              onSelectRivalry={(id) => setSelectedRivalryId(id)}
            />

            {/* Quick Stadium Selector Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredRivalries.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRivalryId(r.id)}
                  className={`p-3 text-left border transition-colors cursor-pointer ${
                    selectedRivalryId === r.id
                      ? 'border-[#9E1B1B] bg-[#9E1B1B]/5 dark:bg-[#9E1B1B]/15'
                      : 'border-stone-300 dark:border-stone-800 bg-[#FBF9F5] dark:bg-[#141311] hover:border-stone-500'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                    {r.name[lang]}
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400 truncate mt-0.5">
                    {r.clubA.stadiumName} ↔ {r.clubB.stadiumName}
                  </div>
                  <div className="text-[10px] font-mono-tabular text-stone-500 mt-1">
                    {r.clubA.lat.toFixed(2)}°, {r.clubA.lng.toFixed(2)}° · {r.country[lang]}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: CHARTS & DIAGRAMS */}
        {activeSection === 'charts' && (
          <section className="space-y-6">
            <FuturistCharts scoredRivalries={scoredRivalries} lang={lang} darkMode={darkMode} />
          </section>
        )}

        {/* SECTION 5: METHODOLOGY, TRANSPARENCY & DATA AUDIT */}
        {activeSection === 'method' && (
          <section className="space-y-10">
            <div className="border border-stone-300 dark:border-stone-800 p-6 lg:p-8 bg-[#FBF9F5] dark:bg-[#141311] space-y-6">
              <div className="text-xs font-mono-tabular tracking-widest text-[#9E1B1B] dark:text-[#C5A059]">
                {lang === 'it'
                  ? 'PROTOCOLLO DI TRASPARENZA SCIENTIFICA E FONTI DATA'
                  : 'SCIENTIFIC TRANSPARENCY PROTOCOL & DATA SOURCES'}
              </div>
              <h2 className="text-3xl font-display font-bold tracking-wide">
                {lang === 'it'
                  ? 'Metodologia, Coerenza delle Date e Registro di Esclusione Anti-Rumore'
                  : 'Methodology, Date Consistency & Anti-Noise Exclusion Ledger'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-stone-200 dark:border-stone-800 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                <div className="space-y-3">
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    {lang === 'it'
                      ? '1. Allineamento Rigoroso delle Fonti Temporali'
                      : '1. Strict Alignment of Temporal Snapshots'}
                  </h3>
                  <p>
                    {lang === 'it'
                      ? 'Tutte le sezioni dell\'applicazione adottano in modo univoco lo Snapshot Opta Power Rankings di Settembre 2025 per il parametro L (Prestigio Lega), eliminando la precedente discrepanza tra hero e tabella metodologica. L\'orizzonte storico complessivo del progetto copre 50 stagioni (1975/76 – 2025/26), mentre i conteggi di precedenti (P) e decenni consecutivi (M) tengono conto dell\'intera serie storica ufficiale dal 1881 a oggi.'
                      : 'All sections of the application uniformly reference the September 2025 Opta Power Rankings Snapshot for parameter L (League Prestige), resolving earlier discrepancies. While the modern reference horizon spans 50 seasons (1975/76–2025/26), head-to-head totals (P) and consecutive decades (M) encompass the complete official historical record from 1881 to the present.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    {lang === 'it'
                      ? '2. Esclusione Consapevole del Fill-Rate Stadi'
                      : '2. Deliberate Exclusion of Stadium Fill-Rate'}
                  </h3>
                  <p>
                    {lang === 'it'
                      ? 'Come stabilito in sede di progettazione scientifica, il tasso di riempimento degli stadi (1976–2026) per ogni singolo incontro è stato escluso dalla formula di calcolo poiché non disponibile con uniformità certificata per tutte le leghe oltre la Top 10. Il progetto utilizza esclusivamente dati completi e verificabili al 100%.'
                      : 'As established in the scientific design brief, stadium fill-rate data (1976–2026) for every individual match is excluded from the ranking formula because certified match-by-match attendance is not uniformly available across all global leagues. Only 100% verified, complete parameters are included.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Audit Log of Excluded Single-Match Pages & Triage of assumed_ongoing_2025 */}
            <div className="border border-stone-300 dark:border-stone-800 p-6 lg:p-8 bg-[#FBF9F5] dark:bg-[#141311] space-y-6">
              <div>
                <div className="text-xs font-mono-tabular text-[#9E1B1B] dark:text-[#C5A059]">
                  {lang === 'it'
                    ? 'REGISTRO DI AUDIT · DATA/RANKING_EXCLUDED.JSON'
                    : 'AUDIT LEDGER · DATA/RANKING_EXCLUDED.JSON'}
                </div>
                <h3 className="text-2xl font-display font-bold tracking-wide mt-1">
                  {lang === 'it'
                    ? 'Voci Escluse e Bonifica del Flag "assumed_ongoing_2025"'
                    : 'Excluded Entries & Remediation of "assumed_ongoing_2025" Flag'}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                  {lang === 'it'
                    ? 'In conformità alla regola "mai stimato", il filtro anti-rumore scarta automaticamente qualsiasi voce Wikipedia che descriva una singola partita anziché una rivalità storica o il cui anno di ultimo incontro non sia verificabile dall\'infobox.'
                    : 'In compliance with the "never estimated" rule, the anti-noise filter automatically rejects any Wikipedia page describing a single match rather than an ongoing rivalry, or any entry whose last-played year cannot be verified from primary records.'}
                </p>
              </div>

              <div className="space-y-4">
                {EXCLUDED_AUDIT_RECORDS.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-4 border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/50 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
                      <span className="font-bold text-[#9E1B1B] dark:text-[#C5A059]">
                        ID: {ex.id} ({ex.wikipediaTitle})
                      </span>
                      <span className="text-stone-500">{ex.reasonCode}</span>
                    </div>
                    <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      {ex.clubsMentioned}
                      {ex.pRawMisattributed ? ` · Errore intercettato: ${ex.pRawMisattributed}` : ''}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {ex.auditDetail[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* iOS PWA Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-w-sm w-full bg-[#F7F4EE] dark:bg-[#141311] border border-[#C5A059] p-6 space-y-4">
            <h3 className="text-lg font-display font-bold">
              {lang === 'it' ? 'Installa RIVALITÀ su iOS' : 'Install RIVALITÀ on iOS'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {lang === 'it'
                ? '1. Tocca il pulsante Condividi nella barra di Safari. 2. Scorri e seleziona "Aggiungi alla schermata Home".'
                : '1. Tap the Share button in Safari. 2. Scroll down and select "Add to Home Screen".'}
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 text-xs font-semibold bg-[#9E1B1B] text-white cursor-pointer"
            >
              {lang === 'it' ? 'Chiudi' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Clean Editorial Footer */}
      <footer className="border-t border-stone-300 dark:border-stone-800 mt-16 py-8 px-6 lg:px-12 text-xs font-mono-tabular text-stone-500 dark:text-stone-400">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            RIVALITÀ — L&apos;Atlante del Calcio Mondiale · Stile Futurista Italiano Anni &apos;20
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span>Fonti: Wikipedia Category:Association football rivalries</span>
            <span>·</span>
            <span>Opta Power Rankings (Snapshot Settembre 2025)</span>
            <span>·</span>
            <span>Wikidata P154 &amp; P625</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useMemo, useState, useEffect } from 'react';
import {
  VERIFIED_RIVALRIES,
  EXCLUDED_AUDIT_RECORDS,
  Continent,
  RivalryType,
} from './data/rivalriesData';
import { ADDITIONAL_RIVALRIES } from './data/additionalRivalries';
import { TIER2_3_RIVALRIES } from './data/tier23Rivalries';
import { OPTA_TOP_100_LEAGUES } from './data/optaTop100Leagues';
import { ClubCrest } from './components/ClubCrest';
import { LeagueCrest } from './components/LeagueCrest';
import { StadiumMap } from './components/StadiumMap';
import { WorldClubsAtlas } from './components/WorldClubsAtlas';
import { FuturistCharts, ScoredRivalry } from './components/FuturistCharts';
import { PosterExporter } from './components/PosterExporter';
import { usePWAInstall, useOnlineStatus } from './usePWAInstall';
import { Search, ExternalLink, RotateCcw, Download, Sun, Moon } from 'lucide-react';

type ActiveSection = 'ranking' | 'encyclopaedia' | 'world_atlas' | 'map' | 'charts' | 'method';

const ALL_RIVALRIES = [...VERIFIED_RIVALRIES, ...ADDITIONAL_RIVALRIES, ...TIER2_3_RIVALRIES];

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
  const [leagueSearch, setLeagueSearch] = useState<string>('');
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

  // Calculate R = (wL*L + wP*P + wM*M) * B for all verified rivalries using OPTA_TOP_100_LEAGUES
  const scoredRivalries = useMemo<ScoredRivalry[]>(() => {
    const maxP = Math.max(...ALL_RIVALRIES.map((r) => r.pRaw), 569);
    const maxDecades = Math.max(...ALL_RIVALRIES.map((r) => r.consecutiveDecades), 14);

    return ALL_RIVALRIES.map((r) => {
      const leagueObj =
        OPTA_TOP_100_LEAGUES.find(
          (l) => l.name.toLowerCase() === r.leagueName.toLowerCase() || l.rank === r.leagueRank
        ) || OPTA_TOP_100_LEAGUES[0];

      const L = leagueObj ? leagueObj.optaRating : Math.max(60, 91 - r.leagueRank * 0.28);
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

  // Filtered Top 100 Opta Leagues
  const filteredTop100Leagues = useMemo(() => {
    return OPTA_TOP_100_LEAGUES.filter((league) => {
      if (continentFilter !== 'ALL' && league.continent !== continentFilter) return false;
      if (leagueSearch.trim() !== '') {
        const q = leagueSearch.toLowerCase();
        return (
          league.name.toLowerCase().includes(q) ||
          league.country[lang].toLowerCase().includes(q) ||
          league.confederation.toLowerCase().includes(q) ||
          String(league.rank) === q
        );
      }
      return true;
    });
  }, [continentFilter, leagueSearch, lang]);

  const resetWeights = () => {
    setRawWL(40);
    setRawWP(35);
    setRawWM(25);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] dark:bg-[#0D0C0B] text-[#141311] dark:text-[#F7F4EE] transition-colors duration-150">
      {!isOnline && (
        <div className="bg-[#9E1B1B] text-[#F7F4EE] text-xs font-mono-tabular px-6 py-2 text-center">
          {lang === 'it'
            ? "Modalità Offline attiva — consultazione dell'archivio locale verificato."
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
            {lang === 'it' ? 'Classifica & Top 100 Leghe' : 'Ranking & Top 100 Leagues'}
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
            onClick={() => setActiveSection('world_atlas')}
            className={`hover:text-[#9E1B1B] dark:hover:text-[#C5A059] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeSection === 'world_atlas'
                ? 'border-b-2 border-[#9E1B1B] text-stone-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            {lang === 'it' ? 'Atlante Club & Coppe' : 'World Clubs & Cups'}
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
        {/* Hero & Operational Utility Bar */}
        <section className="border-b border-stone-300 dark:border-stone-800 pb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200 dark:border-stone-800/80 text-xs font-mono-tabular text-stone-600 dark:text-stone-400">
            <div className="flex flex-wrap items-center gap-2">
              <span>
                {lang === 'it'
                  ? 'Top 100 Leghe Opta Power Rankings (con Logo Ufficiale)'
                  : 'Top 100 Opta Power Rankings Leagues (with Official Logos)'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {lang === 'it'
                  ? 'Cartografia Vettoriale Integrata (Zero API Key / Zero Watermark)'
                  : 'Self-Contained Vector Cartography (Zero API Keys / Zero Watermarks)'}
              </span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setActiveSection('map')}
                className="underline hover:text-[#9E1B1B] dark:hover:text-[#C5A059] cursor-pointer"
              >
                {lang === 'it' ? 'Mappa Derby' : 'Derby Map'}
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setActiveSection('world_atlas')}
                className="underline hover:text-[#9E1B1B] dark:hover:text-[#C5A059] cursor-pointer font-semibold text-[#9E1B1B] dark:text-[#C5A059]"
              >
                {lang === 'it'
                  ? 'Atlante Mondiale Serie A, B, C & Coppe 🏆'
                  : 'World Serie A, B, C & Cups Atlas 🏆'}
              </button>
            </div>

            {/* Workspace Controls */}
            <div className="flex items-center gap-3">
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

              <button
                onClick={() => setDarkMode((d) => !d)}
                className="inline-flex items-center gap-1.5 px-3 py-1 border border-stone-300 dark:border-stone-700 text-xs font-medium hover:border-stone-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                aria-label="Toggle Dark or Light Mode"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>
                  {darkMode ? (lang === 'it' ? 'Chiaro' : 'Light') : lang === 'it' ? 'Scuro' : 'Dark'}
                </span>
              </button>

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
            {(
              ['ranking', 'encyclopaedia', 'world_atlas', 'map', 'charts', 'method'] as ActiveSection[]
            ).map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 ${
                  activeSection === sec
                    ? 'bg-[#9E1B1B] text-white'
                    : 'border border-stone-300 dark:border-stone-700'
                }`}
              >
                {sec.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Futurist Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="text-xs font-mono-tabular tracking-widest text-[#9E1B1B] dark:text-[#C5A059] uppercase">
                {lang === 'it'
                  ? 'TOP 100 CAMPIONATI OPTA · ATLANTE VETTORIALE MONDIALE · LOGHI UFFICIALI WIKIDATA P154'
                  : 'TOP 100 OPTA LEAGUES · WORLD VECTOR ATLAS · OFFICIAL WIKIDATA P154 LOGOS'}
              </div>
              <h1
                className="font-display font-extrabold text-stone-950 dark:text-[#F7F4EE] tracking-tight mt-2 leading-[0.95]"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.25rem)', textWrap: 'balance' }}
              >
                {lang === 'it'
                  ? 'IL CANONE MONDIALE DELLE RIVALITÀ E DELLE 100 LEGHE OPTA'
                  : 'THE GLOBAL CANON OF RIVALRIES & TOP 100 OPTA LEAGUES'}
              </h1>
              <p className="text-base text-stone-700 dark:text-stone-300 mt-4 max-w-2xl leading-relaxed">
                {lang === 'it'
                  ? 'Archivio completo basato su Wikipedia (Category:Association football rivalries) e sulle prime 100 leghe mondiali classificate da Opta Power Rankings (#1 Premier League 91.0 – #100 NIFL Premiership 62.9), ciascuna corredata dal proprio logo ufficiale e cartografia vettoriale senza watermark.'
                  : 'Complete archive grounded in Wikipedia (Category:Association football rivalries) and the Top 100 global leagues ranked by Opta Power Rankings (#1 Premier League 91.0 to #100 NIFL Premiership 62.9), each with its official logo and watermark-free vector cartography.'}
              </p>
            </div>

            <div className="lg:col-span-4 border border-stone-300 dark:border-stone-800 p-5 bg-[#FBF9F5] dark:bg-[#141311]">
              <div className="text-xs font-mono-tabular text-stone-500 dark:text-stone-400">
                {lang === 'it' ? 'EQUAZIONE ATTIVA IN TEMPO REALE' : 'LIVE SCIENTIFIC EQUATION'}
              </div>
              <div className="font-mono-tabular text-lg font-bold text-[#9E1B1B] dark:text-[#C5A059] mt-1">
                R = ({weights.wL.toFixed(2)}·L + {weights.wP.toFixed(2)}·P + {weights.wM.toFixed(2)}·M) × B
              </div>
              <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-1 font-mono-tabular">
                <div>L = Opta Power Ranking (Top 100 Leghe · Snapshot Sett. 2025)</div>
                <div>P = Log(1 + Precedenti) / Log(1 + 569 max)</div>
                <div>M = Decenni consecutivi (max 14 decadi)</div>
                <div>B = ×1.15 Cittadino · ×1.05 Regionale · ×1.00 Nazionale</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: WORLD CLUBS ATLAS (SERIE A, B, C + CONFEDERATIONS + CUPS) */}
        {activeSection === 'world_atlas' && <WorldClubsAtlas darkMode={darkMode} lang={lang} />}

        {/* Global Filter & Parameter Control Bar */}
        {activeSection !== 'world_atlas' && (
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
                    ? 'Modifica i pesi di Prestigio Lega Opta (wL), Precedenti Storici (wP) e Longevità (wM). La somma è normalizzata automaticamente a 1.00.'
                    : 'Adjust weights for Opta League Prestige (wL), Historical Precedents (wP), and Longevity (wM). Weights auto-normalize to 1.00.'}
                </p>
              </div>
              <button
                onClick={resetWeights}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-tabular border border-stone-300 dark:border-stone-700 hover:border-[#9E1B1B] transition-colors cursor-pointer self-start lg:self-auto whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {lang === 'it'
                    ? 'Ripristina Default (0.40 / 0.35 / 0.25)'
                    : 'Reset Default (0.40 / 0.35 / 0.25)'}
                </span>
              </button>
            </div>

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

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
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
        )}

        {/* SECTION 1: SCIENTIFIC RANKING + TOP 100 OPTA LEAGUES + 1:2 SLIDE EXPORT */}
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
                    ? 'Loghi Ufficiali Wikidata P154 · Zero voci assumed_ongoing'
                    : 'Official Wikidata P154 Logos · Zero assumed_ongoing flags'}
                </span>
              </div>

              <div className="overflow-x-auto border border-stone-300 dark:border-stone-800 bg-[#FBF9F5] dark:bg-[#141311]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-300 dark:border-stone-800 text-[11px] font-mono-tabular text-stone-500 dark:text-stone-400 bg-stone-100/70 dark:bg-stone-900/60">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">{lang === 'it' ? 'Rivalità & Storia' : 'Rivalry & History'}</th>
                      <th className="py-3 px-4">
                        {lang === 'it' ? 'Club Contendenti (Logo Ufficiale)' : 'Contending Clubs (Official Crest)'}
                      </th>
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
                            {r.leagueName}
                          </div>
                          <div className="text-stone-500">Opta L = {r.L.toFixed(1)}</div>
                        </td>
                        <td className="py-4 px-4 text-right font-mono-tabular">
                          <div className="font-bold text-stone-900 dark:text-stone-100">{r.pRaw}</div>
                          <div className="text-[11px] text-stone-500">P = {r.P.toFixed(1)}</div>
                        </td>
                        <td className="py-4 px-4 text-right font-mono-tabular">
                          <div className="font-bold text-stone-900 dark:text-stone-100">
                            {r.consecutiveDecades} dec.
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

            {/* COMPLETE TOP 100 OPTA LEAGUES WITH OFFICIAL LOGOS */}
            <section className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-300 dark:border-stone-800 pb-4">
                <div>
                  <div className="text-xs font-mono-tabular text-[#9E1B1B] dark:text-[#C5A059] tracking-widest">
                    {lang === 'it'
                      ? 'CLASSIFICA GLOBALE OPTA POWER RANKINGS · POSIZIONI #001 – #100'
                      : 'GLOBAL OPTA POWER RANKINGS · POSITIONS #001 – #100'}
                  </div>
                  <h3 className="text-2xl font-display font-bold tracking-wide mt-1">
                    {lang === 'it'
                      ? `03. Le Prime 100 Leghe Mondiali Opta con Logo Ufficiale (${filteredTop100Leagues.length}/100)`
                      : `03. Top 100 Global Opta Leagues with Official Logos (${filteredTop100Leagues.length}/100)`}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    {lang === 'it'
                      ? 'Tutte le 100 leghe professionistiche (1ª, 2ª, 3ª e 4ª serie mondiale) con rating Opta, logo ufficiale risolto da Wikidata P154 / Wikipedia e derby associati.'
                      : 'All 100 professional divisions (1st, 2nd, 3rd, and 4th tiers worldwide) with Opta rating, official logo resolved via Wikidata P154 / Wikipedia, and associated derbies.'}
                  </p>
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={leagueSearch}
                    onChange={(e) => setLeagueSearch(e.target.value)}
                    placeholder={
                      lang === 'it'
                        ? 'Filtra le 100 leghe (es. Serie C, 69, Brasile...)'
                        : 'Filter 100 leagues (e.g. Serie C, 69, Brazil...)'
                    }
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:border-[#9E1B1B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {filteredTop100Leagues.map((league) => {
                  const leagueRivalries = scoredRivalries.filter(
                    (r) =>
                      r.leagueName.toLowerCase().includes(league.name.toLowerCase()) ||
                      league.name.toLowerCase().includes(r.leagueName.toLowerCase())
                  );
                  return (
                    <div
                      key={league.id}
                      className="border border-stone-300 dark:border-stone-800 p-4 bg-[#FBF9F5] dark:bg-[#141311] flex flex-col justify-between hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono-tabular text-stone-500 pb-2 border-b border-stone-200 dark:border-stone-800">
                          <span className="font-bold text-[#9E1B1B] dark:text-[#C5A059]">
                            OPTA #{String(league.rank).padStart(3, '0')}
                          </span>
                          <span>
                            {league.confederation} · T{league.tier} ·{' '}
                            <strong>{league.optaRating.toFixed(1)}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <LeagueCrest league={league} size="md" />
                          <div className="min-w-0">
                            <div className="font-display font-bold text-base leading-tight text-stone-900 dark:text-stone-100 truncate">
                              {league.name}
                            </div>
                            <div className="text-xs text-stone-500 truncate mt-0.5">
                              {league.country[lang]} · {league.continent}
                            </div>
                          </div>
                        </div>

                        {leagueRivalries.length > 0 && (
                          <ul className="mt-3 space-y-1 border-t border-stone-200 dark:border-stone-800 pt-2 text-[11px]">
                            {leagueRivalries.map((lr) => (
                              <li key={lr.id} className="flex items-center justify-between">
                                <span className="font-medium text-stone-800 dark:text-stone-200 truncate pr-2">
                                  {lr.name[lang]}
                                </span>
                                <span className="font-mono-tabular text-[#9E1B1B] dark:text-[#C5A059] shrink-0">
                                  R={lr.finalScore.toFixed(1)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between text-[10px] font-mono-tabular text-stone-400">
                        <span>Wikidata {league.wikidataId}</span>
                        <span>Peso L = {league.optaRating.toFixed(1)}</span>
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
                  ? 'Ogni scheda mostra il logo ufficiale del club (Wikidata P154 / Wikimedia Commons), il motivo storico della rivalità, il bilancio W/D/L e il link Wikipedia.'
                  : 'Every entry displays the official club crest (Wikidata P154 / Wikimedia Commons), the historical origin of the rivalry, W/D/L records, and direct Wikipedia links.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRivalries.map((r) => (
                <article
                  key={r.id}
                  className="border border-stone-300 dark:border-stone-800 p-6 bg-[#FBF9F5] dark:bg-[#141311] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-stone-500 dark:text-stone-400">
                      <span>{r.continent}</span>
                      <span aria-hidden="true">·</span>
                      <span>{r.country[lang]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{r.leagueName}</span>
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

        {/* SECTION 3: INTERACTIVE DERBY STADIUM MAP */}
        {activeSection === 'map' && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold tracking-wide">
                  {lang === 'it'
                    ? 'Mappa Vettoriale dei Derby e delle Rivalità (Wikidata P625)'
                    : 'Vector Derby & Rivalry Stadium Map (Wikidata P625)'}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                  {lang === 'it'
                    ? 'Cartografia vettoriale integrata (Natural Earth 110m, zero dipendenza da API esterne o watermark). Per la mappa mondiale di tutte le squadre di Serie A, B, C, i confini delle Confederazioni e i trofei delle Coppe, apri "Atlante Club & Coppe".'
                    : 'Self-contained Natural Earth 110m vector cartography (zero external API keys or watermarks). For the giant world map of all Tier 1, 2, 3 clubs, Confederation borders, and Cup trophies, open "World Clubs & Cups".'}
                </p>
              </div>
              <button
                onClick={() => setActiveSection('world_atlas')}
                className="px-4 py-2 text-xs font-semibold bg-[#0D0C0B] dark:bg-[#C5A059] text-[#F7F4EE] dark:text-[#0D0C0B] cursor-pointer whitespace-nowrap shrink-0"
              >
                {lang === 'it'
                  ? 'Apri Atlante Globale Serie A, B, C & Coppe 🏆'
                  : 'Open World Serie A, B, C & Cups Atlas 🏆'}
              </button>
            </div>

            <StadiumMap
              rivalries={filteredRivalries}
              darkMode={darkMode}
              lang={lang}
              selectedRivalryId={selectedRivalryId}
              onSelectRivalry={(id) => setSelectedRivalryId(id)}
            />

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
                  ? 'Metodologia, Top 100 Leghe Opta, Cartografia Vettoriale e Audit Anti-Rumore'
                  : 'Methodology, Top 100 Opta Leagues, Vector Cartography & Anti-Noise Audit'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-stone-200 dark:border-stone-800 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                <div className="space-y-3">
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    {lang === 'it'
                      ? '1. Top 100 Leghe Opta & Loghi Ufficiali (Wikidata P154)'
                      : '1. Top 100 Opta Leagues & Official Logos (Wikidata P154)'}
                  </h3>
                  <p>
                    {lang === 'it'
                      ? 'Sono censite le prime 100 leghe calcistiche mondiali secondo gli Opta Power Rankings (dalla #1 Premier League con 91.0 fino alla #100 NIFL Premiership con 62.9, includendo Serie A, B, C, Championship, League One, League Two, 2. Bundesliga, 3. Liga, Brasileirão A, B, C). Ogni lega e ogni club carica dinamicamente il proprio logo ufficiale tramite il Q-ID Wikidata (proprietà P154) e Wikipedia PageImages API.'
                      : 'All Top 100 global football leagues according to Opta Power Rankings (#1 Premier League at 91.0 down to #100 NIFL Premiership at 62.9, spanning Tiers 1, 2, 3, and 4) are indexed. Every league and club resolves its official logo dynamically via Wikidata Q-ID (property P154) and Wikipedia PageImages API.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    {lang === 'it'
                      ? '2. Cartografia Vettoriale Autonoma (Zero Watermark / Zero API Key)'
                      : '2. Self-Contained Vector Cartography (Zero Watermarks / Zero API Keys)'}
                  </h3>
                  <p>
                    {lang === 'it'
                      ? 'Per eliminare qualsiasi blocco di rete o watermark di provider tile esterni che richiedono API key, entrambe le mappe ("Mappa Derby" e "Atlante Club & Coppe") utilizzano una base geodetica vettoriale Natural Earth 110m (TopoJSON/GeoJSON) renderizzata direttamente nel canvas Leaflet con reticolo di meridiani e paralleli in stile Atlante Futurista anni \'20.'
                      : 'To eliminate external tile server blocks or "API key required" watermarks, both maps ("Derby Map" and "World Clubs & Cups") render a self-contained Natural Earth 110m GeoJSON/TopoJSON vector world map directly inside Leaflet with a 1920s Futurist coordinate graticule.'}
                  </p>
                </div>
              </div>
            </div>

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
            <span>Top 100 Opta Power Rankings</span>
            <span>·</span>
            <span>Wikidata P154 &amp; Natural Earth Vector Atlas</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

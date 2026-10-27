import React, { useState } from 'react';
import { ScoredRivalry } from './FuturistCharts';

interface PosterExporterProps {
  scoredRivalries: ScoredRivalry[];
  weights: { wL: number; wP: number; wM: number };
  lang: 'it' | 'en';
}

export const PosterExporter: React.FC<PosterExporterProps> = ({
  scoredRivalries,
  weights,
  lang,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Split rivalries into 4 slides (up to 25 per slide, or 8 per slide for current verified set so all 4 slides are rich)
  const itemsPerSlide = Math.ceil(scoredRivalries.length / 4);
  const slides = [0, 1, 2, 3].map((idx) =>
    scoredRivalries.slice(idx * itemsPerSlide, (idx + 1) * itemsPerSlide)
  );

  const exportSlideToPNG = (slideIndex: number) => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      // Strict 1:2 aspect ratio (1080 x 2160 high-res vertical slide)
      canvas.width = 1080;
      canvas.height = 2160;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1920s Italian Futurist Background (Avorio & Nero Assoluto & Rosso Carminio)
      ctx.fillStyle = '#0D0C0B';
      ctx.fillRect(0, 0, 1080, 2160);

      // Diagonal Depero Geometric Slash
      ctx.fillStyle = '#9E1B1B';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(1080, 0);
      ctx.lineTo(1080, 290);
      ctx.lineTo(0, 380);
      ctx.closePath();
      ctx.fill();

      // Gold accent rule
      ctx.strokeStyle = '#C5A059';
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, 1008, 2088);

      // Header Typography
      ctx.fillStyle = '#F7F4EE';
      ctx.font = '800 76px "Big Shoulders Display", sans-serif';
      ctx.fillText('RIVALITÀ — ATLANTE MONDIALE', 72, 135);

      ctx.fillStyle = '#C5A059';
      ctx.font = '600 26px "IBM Plex Mono", monospace';
      const rangeStart = slideIndex * itemsPerSlide + 1;
      const rangeEnd = Math.min((slideIndex + 1) * itemsPerSlide, scoredRivalries.length);
      ctx.fillText(
        `SLIDE ${slideIndex + 1}/4 [POS. #${rangeStart}–#${rangeEnd}] · FORMULA R = (${weights.wL.toFixed(2)}L + ${weights.wP.toFixed(2)}P + ${weights.wM.toFixed(2)}M) × B`,
        72,
        195
      );

      ctx.fillStyle = '#F7F4EE';
      ctx.font = '400 22px "IBM Plex Mono", monospace';
      ctx.fillText(
        'SNAPSHOT OPTA: SETTEMBRE 2025 · SERIE STORICA 50 STAGIONI (1975/76–2025/26)',
        72,
        245
      );

      // Table Rows
      const slideItems = slides[slideIndex] || [];
      let y = 430;
      const rowHeight = Math.min(185, Math.floor(1560 / Math.max(slideItems.length, 1)));

      slideItems.forEach((item, i) => {
        const globalRank = slideIndex * itemsPerSlide + i + 1;

        // Subtle row box
        ctx.fillStyle = i % 2 === 0 ? '#171513' : '#121110';
        ctx.fillRect(64, y - 50, 952, rowHeight - 16);

        // Rank number
        ctx.fillStyle = '#9E1B1B';
        ctx.font = '800 52px "Big Shoulders Display", sans-serif';
        ctx.fillText(`#${String(globalRank).padStart(2, '0')}`, 88, y + 8);

        // Rivalry Name
        ctx.fillStyle = '#F7F4EE';
        ctx.font = '700 34px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(item.name[lang].toUpperCase(), 200, y - 4);

        // Clubs & League
        ctx.fillStyle = '#D6CEBE';
        ctx.font = '400 23px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(
          `${item.clubA.name} vs ${item.clubB.name} · ${item.leagueName} (Opta #${item.leagueRank})`,
          200,
          y + 34
        );

        // Metrics on right
        ctx.textAlign = 'right';
        ctx.fillStyle = '#C5A059';
        ctx.font = '700 44px "IBM Plex Mono", monospace';
        ctx.fillText(item.finalScore.toFixed(2), 990, y + 6);

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '400 20px "IBM Plex Mono", monospace';
        ctx.fillText(`P:${item.pRaw} · M:${item.consecutiveDecades}d · ×${item.B}`, 990, y + 36);
        ctx.textAlign = 'left';

        y += rowHeight;
      });

      // Footer
      ctx.fillStyle = '#C5A059';
      ctx.font = '400 22px "IBM Plex Mono", monospace';
      ctx.fillText(
        'FONTI: WIKIPEDIA CAT:ASSOCIATION_FOOTBALL_RIVALRIES · OPTA POWER RANKINGS · WIKIDATA P154/P625',
        72,
        2085
      );

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `rivalita-slide-${slideIndex + 1}-ratio-1x2.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="border border-stone-300 dark:border-stone-800 p-6 bg-[#FBF9F5] dark:bg-[#141311]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="text-xs tracking-widest text-stone-500 dark:text-stone-400">
            {lang === 'it' ? 'ESPORTAZIONE EDITORIALE · FORMATO VERTICALE 1:2 (1080×2160 PX)' : 'EDITORIAL EXPORT · 1:2 VERTICAL RATIO (1080×2160 PX)'}
          </div>
          <h3 className="text-2xl font-display font-bold tracking-wide mt-1 text-stone-900 dark:text-stone-100">
            {lang === 'it' ? 'Generatore di Tavole Futuriste (4 Slide Ratio 1:2)' : 'Futurist Slide Generator (4 Slides in 1:2 Ratio)'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`px-3 py-1.5 text-xs font-mono-tabular transition-colors whitespace-nowrap shrink-0 ${
                activeSlide === idx
                  ? 'bg-[#9E1B1B] text-white font-semibold'
                  : 'border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-500'
              }`}
            >
              Slide {idx + 1}/4
            </button>
          ))}
          <button
            onClick={() => exportSlideToPNG(activeSlide)}
            disabled={isExporting}
            className="px-4 py-1.5 text-xs font-semibold bg-[#0D0C0B] dark:bg-[#C5A059] text-[#F7F4EE] dark:text-[#0D0C0B] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            {lang === 'it' ? `Scarica PNG 1:2 (Slide ${activeSlide + 1})` : `Download 1:2 PNG (Slide ${activeSlide + 1})`}
          </button>
        </div>
      </div>

      {/* Live 1:2 Preview Container */}
      <div className="mt-6 flex justify-center">
        <div
          className="w-full max-w-[420px] aspect-[1/2] bg-[#0D0C0B] text-[#F7F4EE] border-2 border-[#C5A059] p-5 flex flex-col justify-between relative overflow-hidden"
          aria-label="1:2 Slide Preview"
        >
          {/* Top Depero Crimson Header */}
          <div className="bg-[#9E1B1B] -mx-5 -mt-5 px-5 pt-5 pb-6 border-b border-[#C5A059]">
            <div className="text-[10px] font-mono-tabular text-[#F7F4EE]/90 tracking-widest">
              TAVOLA FUTURISTA {activeSlide + 1}/4 · RATIO 1:2
            </div>
            <div className="text-2xl font-display font-extrabold tracking-wider mt-0.5">
              RIVALITÀ MONDIALI
            </div>
            <div className="text-[11px] font-mono-tabular text-[#F7F4EE]/90 mt-1">
              R = ({weights.wL.toFixed(2)}L + {weights.wP.toFixed(2)}P + {weights.wM.toFixed(2)}M) × B
            </div>
          </div>

          {/* Slide Rows */}
          <div className="my-3 flex-1 flex flex-col justify-around divide-y divide-stone-800">
            {(slides[activeSlide] || []).map((item, i) => {
              const globalRank = activeSlide * itemsPerSlide + i + 1;
              return (
                <div key={item.id} className="py-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-display font-bold text-lg text-[#9E1B1B] w-7 shrink-0">
                      #{String(globalRank).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold tracking-wide truncate text-[#F7F4EE]">
                        {item.name[lang]}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate">
                        {item.clubA.shortCode} vs {item.clubB.shortCode} · {item.leagueName} (#{item.leagueRank})
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono-tabular font-bold text-[#C5A059]">
                      {item.finalScore.toFixed(2)}
                    </div>
                    <div className="text-[9px] font-mono-tabular text-stone-400">
                      {item.pRaw}m · {item.consecutiveDecades}d
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slide Footer */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[9px] font-mono-tabular text-[#C5A059]">
            <span>OPTA SNAPSHOT: SEPT 2025</span>
            <span>50 STAGIONI (1975/76–2025/26)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

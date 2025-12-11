'use client';

import { useState, useEffect } from 'react';
import { MiniPlayer } from '@/components/MiniPlayer';
import { generateTeam } from '@/lib/playerGenerator';
import { Player } from '@/types/player';

export default function Home() {
  const [team, setTeam] = useState<Player[]>([]);

  useEffect(() => {
    setTeam(generateTeam(11));
  }, []);

  return (
    <div className="min-h-screen font-mono overflow-x-hidden">

      {/* Background is handled globally by layout.tsx */}

      <div className="relative z-10 max-w-7xl mx-auto p-6">

        {/* --- HUD Header --- */}
        <header className="flex flex-col md:flex-row justify-between items-end backdrop-blur-md border-2 rounded-2xl p-6 mb-12 transition-all duration-300
          bg-white/80 border-slate-200 shadow-xl shadow-slate-200/50
          dark:bg-emerald-950/20 dark:border-emerald-500/20 dark:shadow-[0_0_30px_rgba(2,44,34,0.5)]">

          <div className="mb-4 md:mb-0">
            <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r 
              from-emerald-600 via-emerald-500 to-emerald-700
              dark:from-emerald-400 dark:via-green-500 dark:to-teal-400 
              dark:drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
              Goal<span className="text-slate-900 dark:text-white">XI</span>
            </h1>
            <div className="flex items-center gap-2 mt-2 text-xs tracking-[0.3em] pl-2 text-slate-500 dark:text-emerald-600">
              <span className="w-2 h-2 rounded-full animate-ping bg-emerald-500"></span>
              SYSTEM ONLINE // SQUAD MANAGEMENT ACTIVE
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8 text-sm font-bold rounded-xl p-4 border-2 
              bg-slate-50 border-slate-200
              dark:bg-black/40 dark:border-emerald-900/50">
              <div className="text-right">
                <div className="text-[10px] uppercase text-slate-500 dark:text-emerald-600">Budget</div>
                <div className="text-xl text-slate-900 dark:text-white">¥ 4,290,000</div>
              </div>
              <div className="w-px bg-slate-300 dark:bg-emerald-900/50"></div>
              <div className="text-right">
                <div className="text-[10px] uppercase text-slate-500 dark:text-emerald-600">Season</div>
                <div className="text-xl text-slate-900 dark:text-white">2077</div>
              </div>
            </div>
          </div>
        </header>

        {/* --- Control Deck --- */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <button
            onClick={() => setTeam(generateTeam(11))}
            className="group relative px-10 py-4 border-2 overflow-hidden transition-all rounded-xl shadow-lg
              bg-white border-slate-200 hover:border-emerald-500 hover:shadow-emerald-500/10
              dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:hover:border-emerald-400 dark:hover:shadow-emerald-500/20"
          >
            <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl 
              bg-emerald-50 dark:bg-emerald-500/10"></div>
            <span className="relative font-bold uppercase tracking-widest transition-colors flex items-center gap-2 
              text-slate-700 group-hover:text-emerald-700
              dark:text-emerald-400 dark:group-hover:text-white">
              <span className="text-xl">⚡</span> Initialize Squad
            </span>
          </button>

          <button className="group relative px-10 py-4 border-2 overflow-hidden transition-all rounded-xl shadow-lg
            bg-white border-slate-200 hover:border-blue-500 hover:shadow-blue-500/10
            dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:hover:border-emerald-400 dark:hover:shadow-emerald-500/20">
            <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl 
              bg-blue-50 dark:bg-emerald-500/10"></div>
            <span className="relative font-bold uppercase tracking-widest transition-colors flex items-center gap-2 
              text-slate-700 group-hover:text-blue-700
              dark:text-emerald-400 dark:group-hover:text-white">
              <span className="text-xl">💎</span> Marketplace
            </span>
          </button>
        </div>

        {/* --- Player Grid (Holographic Cards) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {team.map((player, index) => (
            <div
              key={player.id}
              className="group relative backdrop-blur-md border-2 p-1 transition-all duration-300 hover:-translate-y-2 rounded-2xl
                bg-white/60 border-slate-200 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10
                dark:bg-black/40 dark:border-emerald-900/50 dark:hover:border-emerald-400/50 dark:hover:shadow-[0_0_40px_rgba(52,211,153,0.15)]"
            >
              {/* Scanline Effect Overlay - Dark Mode Only */}
              <div className="hidden dark:block absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px] pointer-events-none z-20 rounded-2xl"></div>

              <div className="relative p-5 h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold px-3 py-1 rounded-lg border-2 
                    text-slate-500 bg-slate-100 border-slate-200
                    dark:text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/30">
                    UNIT_0{index + 1}
                  </span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-lg border-2 
                    ${player.position === 'GK'
                      ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'
                      : player.position === 'FWD'
                        ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                    }`}>
                    {player.position}
                  </span>
                </div>

                {/* Avatar Container */}
                <div className="relative flex justify-center mb-6 py-2">
                  {/* Hologram Base - Dark Mode Only */}
                  <div className="hidden dark:block absolute bottom-2 w-24 h-6 blur-xl rounded-[100%] bg-emerald-500/20"></div>

                  {/* Hologram Base - Light Mode (Shadow) */}
                  <div className="dark:hidden absolute bottom-2 w-24 h-4 blur-md rounded-[100%] bg-black/10"></div>

                  <div className="relative z-10 filter transition-all scale-110 
                    drop-shadow-lg dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.3)] 
                    dark:group-hover:drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">
                    <MiniPlayer appearance={player.appearance} position={player.position} size={100} />
                  </div>
                </div>

                {/* Player Name */}
                <h3 className="text-xl font-bold uppercase tracking-wider mb-6 truncate text-center transition-colors 
                  text-slate-800 group-hover:text-emerald-600
                  dark:text-white dark:group-hover:text-emerald-300">
                  {player.name}
                </h3>

                {/* Stats Matrix */}
                <div className="mt-auto grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl border-2 transition-colors
                    bg-slate-50 border-slate-200 group-hover:border-emerald-500/30 group-hover:bg-emerald-50
                    dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:group-hover:border-emerald-500/30 dark:group-hover:bg-emerald-900/20">
                    <div className="text-[9px] uppercase mb-1 font-bold text-slate-400 dark:text-emerald-600">SPD</div>
                    <div className="text-lg font-black text-slate-800 dark:text-white">{player.stats.speed}</div>
                  </div>
                  <div className="p-2 rounded-xl border-2 transition-colors
                    bg-slate-50 border-slate-200 group-hover:border-emerald-500/30 group-hover:bg-emerald-50
                    dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:group-hover:border-emerald-500/30 dark:group-hover:bg-emerald-900/20">
                    <div className="text-[9px] uppercase mb-1 font-bold text-slate-400 dark:text-emerald-600">PWR</div>
                    <div className="text-lg font-black text-slate-800 dark:text-white">{player.stats.power}</div>
                  </div>
                  <div className="p-2 rounded-xl border-2 transition-colors
                    bg-slate-50 border-slate-200 group-hover:border-emerald-500/30 group-hover:bg-emerald-50
                    dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:group-hover:border-emerald-500/30 dark:group-hover:bg-emerald-900/20">
                    <div className="text-[9px] uppercase mb-1 font-bold text-slate-400 dark:text-emerald-600">SKL</div>
                    <div className="text-lg font-black text-slate-800 dark:text-white">{player.stats.skill}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Users, Trophy, PlayCircle, ClipboardList, TrendingUp } from 'lucide-react';
import { MiniPlayer } from '@/components/MiniPlayer';
import { generateAppearance } from '@/utils/playerUtils';
import { useAuth } from '@/components/auth/AuthContext';
import AssistantBriefing from '@/components/dashboard/AssistantBriefing';

export default function Home() {
  const { isLoggedIn, login } = useAuth();

  // Define appearances for Landing Page
  const heroAppearance = generateAppearance('hero-striker-xv');
  const heroGoalkeeper = generateAppearance('hero-gk-xv');

  if (isLoggedIn) {
    return (
      <div className="min-h-screen pt-4">
        <AssistantBriefing />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-10 px-4 md:px-0">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[0%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Column: Text */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Next Gen Simulation
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tighter leading-[0.9] text-slate-900 dark:text-white mb-6">
                MANAGE <br />
                YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">LEGACY</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience the future of football management. Build your squad, design intricate tactics, and watch matches unfold in real-time simulation.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20 bg-emerald-600 text-white hover:bg-emerald-500 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Enter Dashboard <ArrowRight size={20} />
                </Link>
                <Link
                  href="/teams"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all border-2 bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:bg-black/20 dark:border-emerald-900/50 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400 flex items-center justify-center gap-2"
                >
                  <Users size={20} /> View Teams
                </Link>
              </div>

              {/* Stats / Trust items */}
              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-sm font-mono text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-emerald-500" />
                  <span>Real-time Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-emerald-500" />
                  <span>Elite League</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual */}
            <div className="relative mx-auto lg:ml-auto w-full max-w-[500px] aspect-square flex items-center justify-center">
              {/* Decorative Rings */}
              <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-[10%] border-2 border-dashed border-emerald-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

              {/* Floating Player Cards Visual */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {/* Background Card (Goalkeeper) */}
                <div className="absolute top-0 right-10 w-48 h-64 rotate-12 opacity-60 scale-90 blur-[1px] rounded-2xl border-2 border-emerald-900/20 bg-black/40 backdrop-blur-sm overflow-hidden transform transition-transform hover:scale-95 hover:rotate-6 duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent"></div>
                  <div className="h-full flex flex-col items-center justify-center pt-4">
                    <MiniPlayer appearance={heroGoalkeeper} size={100} />
                    <div className="font-black italic text-yellow-500/50 text-4xl mt-2">GK</div>
                  </div>
                </div>

                {/* Main Card (Striker) */}
                <div className="absolute w-64 h-80 rotate-[-6deg] hover:rotate-0 transition-transform duration-500 rounded-2xl border-2 border-emerald-500/50 bg-white dark:bg-black/60 backdrop-blur-xl shadow-2xl shadow-emerald-500/20 overflow-hidden group">
                  {/* Scanlines */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(16,185,129,0.05)_50%)] bg-[size:100%_4px] pointer-events-none"></div>

                  {/* Content */}
                  <div className="h-full p-6 flex flex-col items-center relative z-10">
                    <div className="absolute top-4 right-4 text-3xl font-black text-emerald-500/20">99</div>

                    <div className="w-32 h-32 rounded-full bg-emerald-100/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                      <MiniPlayer appearance={heroAppearance} size={100} />
                    </div>

                    <div className="text-center w-full">
                      <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Star Player</div>
                      <h3 className="text-3xl font-black italic text-slate-900 dark:text-white mb-4">ACE</h3>

                      <div className="grid grid-cols-3 gap-2 border-t border-slate-200 dark:border-white/10 pt-4">
                        <div className="text-center">
                          <div className="text-[10px] text-slate-400">PAC</div>
                          <div className="font-bold text-slate-700 dark:text-emerald-400">97</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-slate-400">SHO</div>
                          <div className="font-bold text-slate-700 dark:text-emerald-400">94</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-slate-400">DRI</div>
                          <div className="font-bold text-slate-700 dark:text-emerald-400">96</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-slate-50 dark:bg-black/30 border-y border-slate-200 dark:border-emerald-900/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black italic text-slate-900 dark:text-white mb-4">COMPLETE CONTROL</h2>
            <p className="text-slate-600 dark:text-slate-400">From the training ground to match day, every decision matters.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-white dark:bg-emerald-950/10 border border-slate-200 dark:border-emerald-500/10 hover:border-emerald-500/40 transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-emerald-900/20">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <ClipboardList size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Tactical Freedom</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Design custom formations and player roles using our intuitive drag-and-drop tactics board. Adapt your strategy to every opponent.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-white dark:bg-emerald-950/10 border border-slate-200 dark:border-emerald-500/10 hover:border-emerald-500/40 transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-emerald-900/20">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <PlayCircle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Live Simulation</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Watch matches play out in real-time. Our advanced simulation engine calculates every pass, tackle, and shot based on player attributes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-white dark:bg-emerald-950/10 border border-slate-200 dark:border-emerald-500/10 hover:border-emerald-500/40 transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-emerald-900/20">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Squad Development</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Scout promising talent, train your players to reach their potential, and manage squad morale to build a dynasty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-200 dark:border-emerald-900/30 text-center">
        <div className="text-sm text-slate-500 dark:text-slate-600">
          &copy; {new Date().getFullYear()} GoalXI Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

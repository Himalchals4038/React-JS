import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { Sparkles, PlusCircle, History, Volume2, VolumeX, PlayCircle } from 'lucide-react';
import { playSound } from '../services/sound';

export default function Header() {
  const { viewMode, setViewMode, isMuted, setIsMuted, quizHistory } = useQuiz();

  const handleNav = (mode) => {
    playSound('click', isMuted);
    setViewMode(mode);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => handleNav('SETUP')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:rotate-3 transition-transform">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                QuizVerse
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                API & Custom
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Interactive Facts & Dynamic Trivia Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => handleNav('SETUP')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              viewMode === 'SETUP' || viewMode === 'QUIZ'
                ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span className="hidden md:inline">Trivia Generator</span>
            <span className="md:hidden">Quiz</span>
          </button>

          <button
            onClick={() => handleNav('BUILDER')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              viewMode === 'BUILDER'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden md:inline">Custom Quiz Builder</span>
            <span className="md:hidden">Builder</span>
          </button>

          <button
            onClick={() => handleNav('HISTORY')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              viewMode === 'HISTORY' || viewMode === 'RESULTS'
                ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden md:inline">History & Stats</span>
            <span className="md:hidden">Stats</span>
            {quizHistory.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40">
                {quizHistory.length}
              </span>
            )}
          </button>
        </nav>

        {/* Audio Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              if (!next) playSound('click', false);
            }}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            className="p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-indigo-400" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}

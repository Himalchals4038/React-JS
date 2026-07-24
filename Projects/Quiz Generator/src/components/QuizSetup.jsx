import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { CATEGORY_METADATA } from '../services/api';
import { 
  Sparkles, Zap, Brain, Atom, Cpu, Calculator, Trophy, 
  Globe, Scroll, Landmark, Palette, PawPrint, Film, 
  Music, Gamepad2, Tv, ShieldAlert, ArrowRight, Play, Clock, BarChart2, PlusCircle
} from 'lucide-react';
import { playSound } from '../services/sound';

// Map icon string names to Lucide Icon components
const ICON_MAP = {
  Brain, Atom, Cpu, Calculator, Trophy, Globe, Scroll, 
  Landmark, Palette, PawPrint, Film, Music, Gamepad2, Sparkles, Tv
};

export default function QuizSetup() {
  const { 
    quizConfig, setQuizConfig, startQuiz, startCustomQuiz, 
    customQuizzes, isLoading, errorMessage, isMuted, setViewMode 
  } = useQuiz();

  const [selectedCategory, setSelectedCategory] = useState(quizConfig.category);

  const categoriesList = Object.keys(CATEGORY_METADATA).map(id => ({
    id: Number(id),
    ...CATEGORY_METADATA[id]
  }));

  const handleCategorySelect = (cat) => {
    playSound('click', isMuted);
    setSelectedCategory(cat.id);
    setQuizConfig(prev => ({
      ...prev,
      category: cat.id,
      categoryName: cat.name
    }));
  };

  const handleStart = () => {
    startQuiz();
  };

  // Quick Preset Handlers
  const handleQuickPreset = (preset) => {
    playSound('click', isMuted);
    const newConfig = {
      ...quizConfig,
      ...preset.config
    };
    setQuizConfig(newConfig);
    setSelectedCategory(preset.config.category);
    startQuiz(newConfig);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium shadow-inner">
          <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>Real-time API Trivia & Fact Generator</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          Create Your Ultimate <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-glow-indigo">
            Trivia Challenge
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
          Choose from over 15+ live topics, customize question limits, set difficulty timers, or solve community & custom-crafted quizzes.
        </p>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex items-center gap-3 max-w-2xl mx-auto shadow-xl">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Launch Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Rapid Launch Presets
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleQuickPreset({
              config: { category: 18, categoryName: 'Computers & Tech', difficulty: 'easy', amount: 5, timerLimit: 15 }
            })}
            className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900/80 border border-indigo-500/20 hover:border-indigo-500/50 text-left transition-all group hover:scale-[1.02] shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">⚡ Blitz Speed</span>
              <Clock className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
            </div>
            <h4 className="font-heading font-bold text-white text-base">5 Tech Questions</h4>
            <p className="text-xs text-slate-400 mt-1">15s Timer • Easy • Fast Sprint</p>
          </button>

          <button
            onClick={() => handleQuickPreset({
              config: { category: 17, categoryName: 'Science & Nature', difficulty: 'medium', amount: 10, timerLimit: 30 }
            })}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900/80 border border-emerald-500/20 hover:border-emerald-500/50 text-left transition-all group hover:scale-[1.02] shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">🧪 Science Master</span>
              <Atom className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
            </div>
            <h4 className="font-heading font-bold text-white text-base">10 Science Facts</h4>
            <p className="text-xs text-slate-400 mt-1">30s Timer • Medium • Facts Included</p>
          </button>

          <button
            onClick={() => handleQuickPreset({
              config: { category: 9, categoryName: 'General Knowledge', difficulty: 'hard', amount: 15, timerLimit: 30 }
            })}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/80 to-slate-900/80 border border-purple-500/20 hover:border-purple-500/50 text-left transition-all group hover:scale-[1.02] shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">🧠 Mastermind</span>
              <Brain className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
            </div>
            <h4 className="font-heading font-bold text-white text-base">15 Hard GK Trivia</h4>
            <p className="text-xs text-slate-400 mt-1">30s Timer • Hard • High Stakes</p>
          </button>
        </div>
      </div>

      {/* Saved Custom Quizzes Shelf (if user built custom quizzes) */}
      {customQuizzes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider font-bold text-purple-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Your Custom Quizzes ({customQuizzes.length})
            </h3>
            <button 
              onClick={() => setViewMode('BUILDER')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              + Create New
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customQuizzes.map((quiz) => (
              <div 
                key={quiz.id}
                className="cyber-card p-4 rounded-2xl flex items-center justify-between border-purple-500/30 hover:border-purple-500/60"
              >
                <div>
                  <h4 className="font-heading font-bold text-white text-sm line-clamp-1">{quiz.title}</h4>
                  <p className="text-xs text-slate-400">{quiz.questions.length} Custom Questions</p>
                </div>
                <button
                  onClick={() => startCustomQuiz(quiz)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Play
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Explorer Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" /> Step 1: Pick a Topic ({categoriesList.length} Available)
          </h3>
          <span className="text-xs text-indigo-300 font-medium">Selected: {quizConfig.categoryName}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {categoriesList.map((cat) => {
            const IconComp = ICON_MAP[cat.icon] || Sparkles;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat)}
                className={`cyber-card p-4 rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 bg-indigo-950/50 border-indigo-400/50 shadow-[0_0_25px_rgba(99,102,241,0.3)] scale-[1.02]'
                    : 'hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Accent Gradient Glow */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${cat.color} opacity-20 rounded-full blur-xl`} />

                <div className="flex flex-col h-full justify-between space-y-3 relative z-10">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm leading-snug line-clamp-1">{cat.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{cat.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Quiz Configuration Controls */}
      <div className="cyber-card p-6 sm:p-8 rounded-3xl space-y-8 border-indigo-500/20">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-4">
          <BarChart2 className="w-4 h-4 text-emerald-400" /> Step 2: Customize Rules & Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Question Count */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Number of Questions
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[5, 10, 15, 20, 25].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    playSound('click', isMuted);
                    setQuizConfig(prev => ({ ...prev, amount: num }));
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    quizConfig.amount === num
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Difficulty
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'any', label: 'Any', color: 'border-slate-700' },
                { id: 'easy', label: 'Easy', color: 'border-emerald-500/40 text-emerald-300' },
                { id: 'medium', label: 'Medium', color: 'border-amber-500/40 text-amber-300' },
                { id: 'hard', label: 'Hard', color: 'border-rose-500/40 text-rose-300' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => {
                    playSound('click', isMuted);
                    setQuizConfig(prev => ({ ...prev, difficulty: diff.id }));
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    quizConfig.difficulty === diff.id
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                      : `bg-slate-900 ${diff.color} text-slate-400 hover:text-white`
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question Type */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Question Format
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'any', label: 'All' },
                { id: 'multiple', label: '4-Choice' },
                { id: 'boolean', label: 'True/False' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    playSound('click', isMuted);
                    setQuizConfig(prev => ({ ...prev, type: t.id }));
                  }}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    quizConfig.type === t.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timer per question */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Timer Per Question
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { sec: 15, label: '15s' },
                { sec: 30, label: '30s' },
                { sec: 60, label: '60s' },
                { sec: 0, label: 'Off' },
              ].map((t) => (
                <button
                  key={t.sec}
                  type="button"
                  onClick={() => {
                    playSound('click', isMuted);
                    setQuizConfig(prev => ({ ...prev, timerLimit: t.sec }));
                  }}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    quizConfig.timerLimit === t.sec
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Start Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <div className="text-xs text-slate-400">
            Topic: <span className="text-white font-bold">{quizConfig.categoryName}</span> • {quizConfig.amount} Qs • {quizConfig.difficulty.toUpperCase()} difficulty
          </div>

          <button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-heading font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Quiz...</span>
              </>
            ) : (
              <>
                <span>Launch Quiz</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}

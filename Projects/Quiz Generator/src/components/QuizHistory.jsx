import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { 
  History, Trophy, Target, Flame, Trash2, 
  Sparkles, ArrowRight, Play, Award 
} from 'lucide-react';
import { playSound } from '../services/sound';

export default function QuizHistory() {
  const { quizHistory, clearHistory, isMuted, setViewMode } = useQuiz();

  const totalPlayed = quizHistory.length;
  const highScore = quizHistory.reduce((max, h) => Math.max(max, h.score), 0);
  const avgAccuracy = totalPlayed > 0 
    ? Math.round(quizHistory.reduce((sum, h) => sum + h.accuracy, 0) / totalPlayed) 
    : 0;

  const handleClear = () => {
    playSound('click', isMuted);
    if (window.confirm('Are you sure you want to clear your quiz history?')) {
      clearHistory();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
            <History className="w-8 h-8 text-emerald-400" /> Leaderboard & History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your performance, accuracy trends, and high scores across all completed quizzes.
          </p>
        </div>

        {totalPlayed > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="cyber-card p-5 rounded-2xl flex items-center gap-4 border-indigo-500/20">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Personal Best Score</span>
            <p className="font-heading font-black text-2xl text-white">{highScore} pts</p>
          </div>
        </div>

        <div className="cyber-card p-5 rounded-2xl flex items-center gap-4 border-emerald-500/20">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Avg Accuracy</span>
            <p className="font-heading font-black text-2xl text-emerald-400">{avgAccuracy}%</p>
          </div>
        </div>

        <div className="cyber-card p-5 rounded-2xl flex items-center gap-4 border-purple-500/20">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Quizzes Completed</span>
            <p className="font-heading font-black text-2xl text-white">{totalPlayed}</p>
          </div>
        </div>
      </div>

      {/* History Log Table */}
      {totalPlayed === 0 ? (
        <div className="cyber-card p-12 rounded-3xl text-center space-y-4 border-indigo-500/20">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">No Quizzes Played Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Launch a quiz from the Trivia Generator or Custom Builder to record your scores here!
          </p>
          <button
            onClick={() => setViewMode('SETUP')}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <Play className="w-4 h-4 fill-current" /> Start First Quiz
          </button>
        </div>
      ) : (
        <div className="cyber-card rounded-3xl overflow-hidden border-indigo-500/20">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white">Activity Log</h3>
            <span className="text-xs text-slate-400">Showing last {totalPlayed} attempts</span>
          </div>

          <div className="divide-y divide-white/5 overflow-x-auto">
            {quizHistory.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-900/50 transition-all">
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-white text-base">{item.categoryName}</h4>
                  <p className="text-xs text-slate-400">
                    {item.date} • {item.correctCount} of {item.totalQuestions} Correct
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Streak */}
                  {item.maxStreak > 1 && (
                    <span className="text-xs text-amber-400 font-bold hidden sm:flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" /> {item.maxStreak}x Streak
                    </span>
                  )}

                  {/* Accuracy badge */}
                  <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${
                    item.accuracy >= 80
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : item.accuracy >= 50
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {item.accuracy}%
                  </span>

                  {/* Score */}
                  <div className="text-right">
                    <span className="font-heading font-black text-lg text-indigo-300">{item.score}</span>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

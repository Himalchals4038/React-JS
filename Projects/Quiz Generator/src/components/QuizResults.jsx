import React, { useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import confetti from 'canvas-confetti';
import { 
  Trophy, Award, Flame, CheckCircle2, XCircle, 
  RotateCcw, Sparkles, Share2, ArrowRight, Download, BarChart2 
} from 'lucide-react';
import { playSound } from '../services/sound';

export default function QuizResults() {
  const { 
    score, userAnswers, questions, quizConfig, 
    maxStreak, startQuiz, setViewMode, isMuted 
  } = useQuiz();

  const totalQuestions = questions.length;
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      if (accuracy >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {}
  }, [accuracy]);

  let rankGrade = 'Quiz Explorer 💡';
  let rankColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  if (accuracy >= 90) {
    rankGrade = 'Trivia Mastermind 👑';
    rankColor = 'text-purple-400 border-purple-500/30 bg-purple-500/10';
  } else if (accuracy >= 70) {
    rankGrade = 'Trivia Scholar 🌟';
    rankColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  } else if (accuracy >= 50) {
    rankGrade = 'Knowledge Enthusiast 📚';
    rankColor = 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
  }

  const handleRetake = () => {
    playSound('click', isMuted);
    startQuiz();
  };

  const handleNewQuiz = () => {
    playSound('click', isMuted);
    setViewMode('SETUP');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="cyber-card p-8 sm:p-12 rounded-3xl text-center space-y-6 border-indigo-500/30 shadow-2xl relative overflow-hidden">
        
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 animate-bounce">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-2">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider border ${rankColor}`}>
            {rankGrade}
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Quiz Completed!
          </h1>
          <p className="text-sm text-slate-400">
            Category: <span className="text-white font-bold">{quizConfig.categoryName}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Score</span>
            <p className="font-heading font-black text-2xl sm:text-3xl text-indigo-400 text-glow-indigo">{score}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Accuracy</span>
            <p className="font-heading font-black text-2xl sm:text-3xl text-emerald-400 text-glow-emerald">{accuracy}%</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Correct Answers</span>
            <p className="font-heading font-black text-2xl sm:text-3xl text-white">
              {correctCount} / {totalQuestions}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Max Streak</span>
            <p className="font-heading font-black text-2xl sm:text-3xl text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-current" /> {maxStreak}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={handleRetake}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Retake Same Topic
          </button>

          <button
            onClick={handleNewQuiz}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" /> Pick Another Topic
          </button>
        </div>

      </div>

      {/* Question Breakdown Table */}
      <div className="cyber-card p-6 sm:p-8 rounded-3xl space-y-6 border-indigo-500/20">
        <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-400" /> Detailed Question Review
        </h3>

        <div className="space-y-4">
          {userAnswers.map((ans, idx) => (
            <div 
              key={idx}
              className={`p-5 rounded-2xl border space-y-3 transition-all ${
                ans.isCorrect 
                  ? 'bg-slate-900/60 border-emerald-500/30' 
                  : 'bg-slate-900/60 border-rose-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border shrink-0 mt-0.5 ${
                    ans.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-heading font-bold text-white text-base leading-snug">{ans.question}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ans.isCorrect ? (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> +{ans.points} pts
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>
              </div>

              {/* Answers comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-slate-500 block mb-0.5">Your Selected Answer:</span>
                  <span className={`font-semibold ${ans.isCorrect ? 'text-emerald-300' : 'text-rose-300 line-through'}`}>
                    {ans.selectedAnswer || '(Time expired)'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-slate-500 block mb-0.5">Correct Answer:</span>
                  <span className="font-semibold text-emerald-300">{ans.correctAnswer}</span>
                </div>
              </div>

              {/* Explanation */}
              {ans.explanation && (
                <p className="text-xs text-slate-400 pt-1 italic">
                  💡 {ans.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

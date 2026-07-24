import React, { useEffect, useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import FactHintModal from './FactHintModal';
import { 
  Clock, Flame, Award, CheckCircle2, XCircle, 
  Sparkles, HelpCircle, Hourglass, ArrowRight, X, Volume2 
} from 'lucide-react';
import { playSound } from '../services/sound';

export default function QuizCard() {
  const {
    questions,
    currentIndex,
    score,
    streak,
    timeLeft,
    setTimeLeft,
    quizConfig,
    isAnswered,
    selectedOption,
    disabledOptions,
    lifelinesUsed,
    submitAnswer,
    nextQuestion,
    useFiftyFifty,
    useTimeBoost,
    useHint,
    setViewMode,
    isMuted
  } = useQuiz();

  const [showFactModal, setShowFactModal] = useState(false);

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  // Question countdown timer effect
  useEffect(() => {
    if (quizConfig.timerLimit === 0 || isAnswered) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto submit empty on timeout
          submitAnswer('');
          return 0;
        }
        if (prev <= 5 && !isMuted) {
          playSound('tick', false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnswered, quizConfig.timerLimit]);

  // Keyboard navigation listener (1-4 or A-D, Space/Enter for Next)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showFactModal) return;
      if (!isAnswered) {
        if (e.key === '1' && currentQ.options[0]) handleOptionClick(currentQ.options[0]);
        if (e.key === '2' && currentQ.options[1]) handleOptionClick(currentQ.options[1]);
        if (e.key === '3' && currentQ.options[2]) handleOptionClick(currentQ.options[2]);
        if (e.key === '4' && currentQ.options[3]) handleOptionClick(currentQ.options[3]);
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          nextQuestion();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQ, showFactModal]);

  const handleOptionClick = (option) => {
    if (disabledOptions.includes(option)) return;
    submitAnswer(option);
  };

  const handleOpenFactModal = () => {
    useHint();
    setShowFactModal(true);
  };

  // Timer Progress Calculation
  const timerPercent = quizConfig.timerLimit > 0 ? (timeLeft / quizConfig.timerLimit) * 100 : 100;
  const isTimerWarning = timeLeft <= 5 && quizConfig.timerLimit > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fadeIn">
      
      {/* Top Gameplay Bar */}
      <div className="cyber-card p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-indigo-500/20 shadow-lg">
        {/* Category & Progress */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            {currentQ.category}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            Question <strong className="text-white">{currentIndex + 1}</strong> of {questions.length}
          </span>
        </div>

        {/* Streak & Live Score */}
        <div className="flex items-center gap-4">
          {streak > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold animate-pulse">
              <Flame className="w-4 h-4 text-amber-400 fill-current" />
              <span>{streak}x Streak!</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>{score} pts</span>
          </div>
          <button
            onClick={() => {
              playSound('click', isMuted);
              setViewMode('SETUP');
            }}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-all"
            title="Quit Quiz"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="cyber-card p-6 sm:p-10 rounded-3xl space-y-8 relative overflow-hidden border-indigo-500/30 shadow-2xl">
        
        {/* Top Progress Line Timer */}
        {quizConfig.timerLimit > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                isTimerWarning ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        )}

        {/* Header Row: Difficulty Badge & Lifelines */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Difficulty Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
            currentQ.difficulty === 'hard'
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
              : currentQ.difficulty === 'medium'
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
              : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
          }`}>
            {currentQ.difficulty || 'Normal'}
          </span>

          {/* Lifelines Toolbar */}
          <div className="flex items-center gap-2">
            {/* 50:50 Lifeline */}
            <button
              onClick={useFiftyFifty}
              disabled={lifelinesUsed.fiftyFifty || isAnswered || currentQ.options.length <= 2}
              title="Eliminate two wrong answers"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                lifelinesUsed.fiftyFifty || isAnswered || currentQ.options.length <= 2
                  ? 'opacity-40 cursor-not-allowed bg-slate-900 border-white/5 text-slate-500'
                  : 'bg-indigo-600/30 border-indigo-500/40 text-indigo-200 hover:bg-indigo-600/60 shadow-md active:scale-95'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>50:50</span>
            </button>

            {/* Fact Hint Lifeline */}
            <button
              onClick={handleOpenFactModal}
              disabled={isAnswered}
              title="Get a Wikipedia Fact Hint"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isAnswered
                  ? 'opacity-40 cursor-not-allowed bg-slate-900 border-white/5 text-slate-500'
                  : 'bg-purple-600/30 border-purple-500/40 text-purple-200 hover:bg-purple-600/60 shadow-md active:scale-95'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Fact Hint</span>
            </button>

            {/* Time Boost Lifeline */}
            {quizConfig.timerLimit > 0 && (
              <button
                onClick={useTimeBoost}
                disabled={lifelinesUsed.timeBoost || isAnswered}
                title="Add +15 seconds"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  lifelinesUsed.timeBoost || isAnswered
                    ? 'opacity-40 cursor-not-allowed bg-slate-900 border-white/5 text-slate-500'
                    : 'bg-emerald-600/30 border-emerald-500/40 text-emerald-200 hover:bg-emerald-600/60 shadow-md active:scale-95'
                }`}
              >
                <Hourglass className="w-3.5 h-3.5 text-emerald-400" />
                <span>+15s</span>
              </button>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white leading-relaxed">
            {currentQ.question}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrectOption = opt === currentQ.correctAnswer;
            const isDisabled = disabledOptions.includes(opt);

            let optionStyle = 'bg-slate-900/90 border-white/10 hover:border-indigo-500/50 hover:bg-indigo-950/30 text-slate-200';
            let icon = null;

            if (isDisabled) {
              optionStyle = 'bg-slate-950/40 border-white/5 text-slate-600 line-through opacity-40 cursor-not-allowed';
            } else if (isAnswered) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-500';
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
                icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
              } else {
                optionStyle = 'bg-slate-950/40 border-white/5 text-slate-500 opacity-50';
              }
            }

            const prefixLetter = String.fromCharCode(65 + idx); // A, B, C, D

            return (
              <button
                key={idx}
                disabled={isAnswered || isDisabled}
                onClick={() => handleOptionClick(opt)}
                className={`p-4 sm:p-5 rounded-2xl border text-left font-medium text-sm sm:text-base flex items-center justify-between gap-3 transition-all duration-200 shadow-md ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border shrink-0 ${
                    isAnswered && isCorrectOption
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : isAnswered && isSelected
                      ? 'bg-rose-500 text-white border-rose-400'
                      : 'bg-slate-800 text-slate-400 border-white/10'
                  }`}>
                    {prefixLetter}
                  </span>
                  <span>{opt}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation & Next Question Bar */}
        {isAnswered && (
          <div className="pt-4 border-t border-white/10 space-y-4 animate-fadeIn">
            {/* Fact Explanation Card */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs sm:text-sm text-indigo-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Fact Breakdown:
              </p>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={nextQuestion}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Wikipedia Fact Modal */}
      {showFactModal && (
        <FactHintModal
          questionText={currentQ.question}
          categoryName={currentQ.category}
          onClose={() => setShowFactModal(false)}
        />
      )}

    </div>
  );
}

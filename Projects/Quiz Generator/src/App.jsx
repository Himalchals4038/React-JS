import React from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import Header from './components/Header';
import QuizSetup from './components/QuizSetup';
import QuizCard from './components/QuizCard';
import QuizResults from './components/QuizResults';
import CustomQuizBuilder from './components/CustomQuizBuilder';
import QuizHistory from './components/QuizHistory';
import { Sparkles, Heart } from 'lucide-react';

function MainContent() {
  const { viewMode } = useQuiz();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {viewMode === 'SETUP' && <QuizSetup />}
      {viewMode === 'QUIZ' && <QuizCard />}
      {viewMode === 'RESULTS' && <QuizResults />}
      {viewMode === 'BUILDER' && <CustomQuizBuilder />}
      {viewMode === 'HISTORY' && <QuizHistory />}
    </main>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <div className="relative min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
        
        {/* Animated Aurora Mesh Background */}
        <div className="aurora-bg">
          <div className="aurora-orb-1" />
          <div className="aurora-orb-2" />
          <div className="aurora-orb-3" />
        </div>

        <div>
          <Header />
          <MainContent />
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-xl py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>
                <strong className="text-white font-heading">QuizVerse</strong> • Powered by Open Trivia DB & Wikipedia REST APIs
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Built with React 19, Tailwind CSS & Web Audio Synthesizer</span>
            </div>
          </div>
        </footer>

      </div>
    </QuizProvider>
  );
}

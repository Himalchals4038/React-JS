import React, { useState, useEffect } from 'react';
import { fetchWikipediaFact } from '../services/api';
import { Sparkles, X, ExternalLink, BookOpen, Loader2 } from 'lucide-react';

export default function FactHintModal({ questionText, categoryName, onClose }) {
  const [loading, setLoading] = useState(true);
  const [factData, setFactData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadFact() {
      setLoading(true);
      const data = await fetchWikipediaFact(questionText || categoryName);
      if (isMounted) {
        setFactData(data);
        setLoading(false);
      }
    }
    loadFact();
    return () => { isMounted = false; };
  }, [questionText, categoryName]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="cyber-card w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 relative border-indigo-500/40 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-xl text-white">Fact Clue & Trivia Hint</h3>
            <p className="text-xs text-slate-400">Powered by Wikipedia REST API</p>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Querying Wikipedia database for topic facts...</p>
          </div>
        ) : factData ? (
          <div className="space-y-4">
            {factData.thumbnail && (
              <img 
                src={factData.thumbnail} 
                alt={factData.title}
                className="w-full h-40 object-cover rounded-2xl border border-white/10"
              />
            )}
            <h4 className="font-heading font-bold text-lg text-indigo-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {factData.title}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-2xl border border-white/5">
              "{factData.extract}"
            </p>
            {factData.url && (
              <a
                href={factData.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                Read full article on Wikipedia <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-2">
            <p className="text-sm text-slate-300">
              💡 <span className="font-bold">General Hint:</span> Read the options carefully! Think about the core terms mentioned in the question: <span className="text-indigo-300 italic">"{categoryName}"</span>.
            </p>
          </div>
        )}

        {/* Close Modal Action */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            Got It! Back to Question
          </button>
        </div>

      </div>
    </div>
  );
}

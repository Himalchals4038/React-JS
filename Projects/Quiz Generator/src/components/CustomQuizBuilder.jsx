import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { 
  PlusCircle, Trash2, Save, Download, Upload, 
  Sparkles, CheckCircle, HelpCircle, Play, AlertCircle 
} from 'lucide-react';
import { playSound } from '../services/sound';

export default function CustomQuizBuilder() {
  const { saveCustomQuiz, startCustomQuiz, isMuted, setViewMode } = useQuiz();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timerLimit, setTimerLimit] = useState(30);

  const [questions, setQuestions] = useState([]);
  
  // Current draft question form state
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0); // 0 = A, 1 = B, 2 = C, 3 = D
  const [explanation, setExplanation] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddQuestion = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!questionText.trim()) {
      setErrorMsg('Please enter a question prompt.');
      return;
    }
    if (!optionA.trim() || !optionB.trim()) {
      setErrorMsg('Please provide at least Options A and B.');
      return;
    }

    const options = [optionA.trim(), optionB.trim()];
    if (optionC.trim()) options.push(optionC.trim());
    if (optionD.trim()) options.push(optionD.trim());

    if (correctIndex >= options.length) {
      setErrorMsg('The selected correct answer option cannot be empty.');
      return;
    }

    const newQuestion = {
      id: `custom-q-${Date.now()}-${questions.length}`,
      question: questionText.trim(),
      options,
      correctAnswer: options[correctIndex],
      explanation: explanation.trim() || `Correct Answer: "${options[correctIndex]}"`
    };

    setQuestions((prev) => [...prev, newQuestion]);
    playSound('click', isMuted);

    // Clear question form
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setExplanation('');
    setCorrectIndex(0);
  };

  const handleDeleteQuestion = (idx) => {
    playSound('click', isMuted);
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveQuiz = () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a title for your custom quiz.');
      return;
    }
    if (questions.length === 0) {
      setErrorMsg('Please add at least 1 question to your quiz.');
      return;
    }

    const newQuiz = {
      id: `quiz-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      timerLimit,
      questions,
      createdAt: new Date().toLocaleDateString()
    };

    saveCustomQuiz(newQuiz);
    playSound('win', isMuted);
    setSuccessMsg('Quiz saved successfully to your library!');
  };

  const handlePlayNow = () => {
    if (!title.trim() || questions.length === 0) {
      setErrorMsg('Please save or add at least 1 question before playing.');
      return;
    }
    const quizObj = {
      title,
      description,
      timerLimit,
      questions
    };
    startCustomQuiz(quizObj);
  };

  // Export Quiz as JSON
  const handleExportJSON = () => {
    if (questions.length === 0) {
      setErrorMsg('No questions to export.');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      title: title || 'Custom Quiz',
      description,
      timerLimit,
      questions
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(title || 'custom_quiz').toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Quiz from JSON
  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.questions && Array.isArray(parsed.questions)) {
            setTitle(parsed.title || 'Imported Quiz');
            setDescription(parsed.description || '');
            setTimerLimit(parsed.timerLimit || 30);
            setQuestions(parsed.questions);
            setSuccessMsg('Quiz imported successfully!');
            playSound('lifeline', isMuted);
          } else {
            setErrorMsg('Invalid JSON format for quiz.');
          }
        } catch (err) {
          setErrorMsg('Error parsing JSON file.');
        }
      };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" /> Custom Quiz Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Design your own custom questions, set answers, write facts, and export/share with friends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-indigo-400" /> Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
          <button
            onClick={handleExportJSON}
            disabled={questions.length === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-40"
          >
            <Download className="w-4 h-4 text-purple-400" /> Export JSON
          </button>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400" /> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" /> {successMsg}
        </div>
      )}

      {/* Quiz Info Form */}
      <div className="cyber-card p-6 sm:p-8 rounded-3xl space-y-6 border-purple-500/30">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Step 1: Quiz Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-400">Quiz Title *</label>
            <input
              type="text"
              placeholder="e.g. Marvel Universe Ultimate Trivia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Description (Optional)</label>
            <input
              type="text"
              placeholder="A brief overview of your quiz topic..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Timer Per Question</label>
            <select
              value={timerLimit}
              onChange={(e) => setTimerLimit(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-sm"
            >
              <option value={15}>15 Seconds</option>
              <option value={30}>30 Seconds</option>
              <option value={60}>60 Seconds</option>
              <option value={0}>Unlimited (No Timer)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Question Form */}
      <div className="cyber-card p-6 sm:p-8 rounded-3xl space-y-6 border-indigo-500/30">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Step 2: Add Question ({questions.length} Added)</span>
        </h3>

        <form onSubmit={handleAddQuestion} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Question Prompt *</label>
            <textarea
              rows={2}
              placeholder="Enter your question here..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Option A *', val: optionA, setVal: setOptionA, index: 0 },
              { label: 'Option B *', val: optionB, setVal: setOptionB, index: 1 },
              { label: 'Option C (Optional)', val: optionC, setVal: setOptionC, index: 2 },
              { label: 'Option D (Optional)', val: optionD, setVal: setOptionD, index: 3 },
            ].map((opt) => (
              <div key={opt.index} className="p-3 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400">{opt.label}</label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="correctAnswerIndex"
                      checked={correctIndex === opt.index}
                      onChange={() => setCorrectIndex(opt.index)}
                      className="accent-indigo-500"
                    />
                    <span className={correctIndex === opt.index ? 'text-emerald-400 font-bold' : ''}>Correct</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder={`Choice ${String.fromCharCode(65 + opt.index)}`}
                  value={opt.val}
                  onChange={(e) => opt.setVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Fact / Explanation (Shown after answer)</label>
            <input
              type="text"
              placeholder="e.g. Iron Man was created by Stan Lee, Larry Lieber, Don Heck, and Jack Kirby in 1963."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-5 h-5" /> Add Question to Quiz
          </button>
        </form>
      </div>

      {/* Added Questions List */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Added Questions ({questions.length})
          </h3>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="cyber-card p-4 rounded-2xl flex items-start justify-between gap-4 border-indigo-500/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-heading font-bold text-white text-sm">{q.question}</h4>
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold pl-8">
                    Correct: "{q.correctAnswer}" ({q.options.length} options)
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(idx)}
                  className="p-2 rounded-xl bg-slate-900 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition-all shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Final Action Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-end gap-4">
            <button
              onClick={handleSaveQuiz}
              className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" /> Save to My Library
            </button>

            <button
              onClick={handlePlayNow}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-heading font-bold text-sm flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" /> Play Quiz Now
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

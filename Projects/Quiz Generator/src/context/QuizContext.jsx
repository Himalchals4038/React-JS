import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchTriviaQuestions } from '../services/api';
import { playSound } from '../services/sound';

const QuizContext = createContext();

export function QuizProvider({ children }) {
  // Navigation View State: 'SETUP' | 'QUIZ' | 'RESULTS' | 'BUILDER' | 'HISTORY'
  const [viewMode, setViewMode] = useState('SETUP');
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Configuration for dynamic trivia generation
  const [quizConfig, setQuizConfig] = useState({
    category: 18,
    categoryName: 'Computers & Tech',
    difficulty: 'any',
    type: 'any',
    amount: 10,
    timerLimit: 30, // seconds per question (0 = unlimited)
  });

  // Active Quiz State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [lifelinesUsed, setLifelinesUsed] = useState({
    fiftyFifty: false,
    hint: false,
    timeBoost: false,
  });

  // Persistent Custom Quizzes & History from LocalStorage
  const [customQuizzes, setCustomQuizzes] = useState(() => {
    try {
      const saved = localStorage.getItem('quizverse_custom_quizzes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [quizHistory, setQuizHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('quizverse_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quizverse_custom_quizzes', JSON.stringify(customQuizzes));
    } catch (e) {}
  }, [customQuizzes]);

  useEffect(() => {
    try {
      localStorage.setItem('quizverse_history', JSON.stringify(quizHistory));
    } catch (e) {}
  }, [quizHistory]);

  // Start standard quiz from config
  const startQuiz = async (overrideConfig) => {
    const configToUse = overrideConfig || quizConfig;
    setIsLoading(true);
    setErrorMessage('');
    playSound('click', isMuted);

    try {
      const fetchedQuestions = await fetchTriviaQuestions({
        category: configToUse.category,
        difficulty: configToUse.difficulty,
        type: configToUse.type,
        amount: configToUse.amount,
      });

      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        throw new Error('No questions found for the selected criteria.');
      }

      setQuestions(fetchedQuestions);
      setCurrentIndex(0);
      setUserAnswers([]);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setIsAnswered(false);
      setSelectedOption(null);
      setDisabledOptions([]);
      setLifelinesUsed({ fiftyFifty: false, hint: false, timeBoost: false });
      setTimeLeft(configToUse.timerLimit);
      setViewMode('QUIZ');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to generate quiz. Please check internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Start custom quiz created in Quiz Builder
  const startCustomQuiz = (customQuiz) => {
    if (!customQuiz || !customQuiz.questions || customQuiz.questions.length === 0) return;
    playSound('click', isMuted);

    const formattedQuestions = customQuiz.questions.map((q, idx) => ({
      id: `custom-q-${idx}-${Date.now()}`,
      category: customQuiz.title || 'Custom Quiz',
      difficulty: customQuiz.difficulty || 'medium',
      type: 'multiple',
      question: q.question,
      correctAnswer: q.correctAnswer,
      options: q.options,
      explanation: q.explanation || `Correct Answer: "${q.correctAnswer}"`
    }));

    setQuizConfig({
      category: 'custom',
      categoryName: customQuiz.title,
      difficulty: customQuiz.difficulty || 'medium',
      type: 'any',
      amount: formattedQuestions.length,
      timerLimit: customQuiz.timerLimit || 30,
    });

    setQuestions(formattedQuestions);
    setCurrentIndex(0);
    setUserAnswers([]);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setIsAnswered(false);
    setSelectedOption(null);
    setDisabledOptions([]);
    setLifelinesUsed({ fiftyFifty: false, hint: false, timeBoost: false });
    setTimeLeft(customQuiz.timerLimit || 30);
    setViewMode('QUIZ');
  };

  // Submit Answer for current question
  const submitAnswer = (option) => {
    if (isAnswered) return;

    const currentQ = questions[currentIndex];
    const isCorrect = option === currentQ.correctAnswer;
    const timeSpent = quizConfig.timerLimit > 0 ? (quizConfig.timerLimit - timeLeft) : 0;

    setIsAnswered(true);
    setSelectedOption(option);

    // Calculate score points with difficulty & time multipliers
    let points = 0;
    let newStreak = streak;

    if (isCorrect) {
      const basePoints = currentQ.difficulty === 'hard' ? 300 : currentQ.difficulty === 'medium' ? 200 : 100;
      const speedBonus = quizConfig.timerLimit > 0 ? Math.floor((timeLeft / quizConfig.timerLimit) * 100) : 50;
      newStreak = streak + 1;
      const streakMultiplier = Math.min(1 + newStreak * 0.1, 2.5); // Up to 2.5x
      points = Math.round((basePoints + speedBonus) * streakMultiplier);

      setScore((prev) => prev + points);
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      playSound('correct', isMuted);
    } else {
      setStreak(0);
      playSound('incorrect', isMuted);
    }

    const answerRecord = {
      questionId: currentQ.id,
      question: currentQ.question,
      selectedAnswer: option,
      correctAnswer: currentQ.correctAnswer,
      isCorrect,
      explanation: currentQ.explanation,
      points,
      timeSpent,
    };

    setUserAnswers((prev) => [...prev, answerRecord]);
  };

  // Next Question or Complete Quiz
  const nextQuestion = () => {
    playSound('click', isMuted);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setDisabledOptions([]);
      setTimeLeft(quizConfig.timerLimit);
    } else {
      // Complete Quiz and record history
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const totalQuestions = questions.length;
    const correctCount = userAnswers.filter((a) => a.isCorrect).length + (isAnswered && selectedOption === questions[currentIndex]?.correctAnswer ? 1 : 0);
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    const historyRecord = {
      id: `hist-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      categoryName: quizConfig.categoryName,
      score: score + (isAnswered && selectedOption === questions[currentIndex]?.correctAnswer ? 150 : 0),
      accuracy,
      correctCount,
      totalQuestions,
      maxStreak,
    };

    setQuizHistory((prev) => [historyRecord, ...prev.slice(0, 49)]); // Keep last 50
    setViewMode('RESULTS');
    playSound('win', isMuted);
  };

  // Lifeline 1: 50:50 Eliminate 2 wrong answers
  const useFiftyFifty = () => {
    if (lifelinesUsed.fiftyFifty || isAnswered) return;
    const currentQ = questions[currentIndex];
    const wrongOptions = currentQ.options.filter((opt) => opt !== currentQ.correctAnswer);
    const shuffledWrong = [...wrongOptions].sort(() => Math.random() - 0.5);
    const toDisable = shuffledWrong.slice(0, 2);

    setDisabledOptions(toDisable);
    setLifelinesUsed((prev) => ({ ...prev, fiftyFifty: true }));
    playSound('lifeline', isMuted);
  };

  // Lifeline 2: Time Boost (+15s)
  const useTimeBoost = () => {
    if (lifelinesUsed.timeBoost || isAnswered || quizConfig.timerLimit === 0) return;
    setTimeLeft((prev) => prev + 15);
    setLifelinesUsed((prev) => ({ ...prev, timeBoost: true }));
    playSound('lifeline', isMuted);
  };

  // Lifeline 3: Hint toggle flag
  const useHint = () => {
    if (lifelinesUsed.hint || isAnswered) return;
    setLifelinesUsed((prev) => ({ ...prev, hint: true }));
    playSound('lifeline', isMuted);
  };

  // Custom Quiz Library Operations
  const saveCustomQuiz = (newQuiz) => {
    const quizToAdd = {
      ...newQuiz,
      id: newQuiz.id || `custom-${Date.now()}`,
      createdAt: new Date().toLocaleDateString(),
    };
    setCustomQuizzes((prev) => [quizToAdd, ...prev.filter((q) => q.id !== quizToAdd.id)]);
  };

  const deleteCustomQuiz = (id) => {
    setCustomQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const clearHistory = () => {
    setQuizHistory([]);
  };

  return (
    <QuizContext.Provider
      value={{
        viewMode,
        setViewMode,
        isMuted,
        setIsMuted,
        isLoading,
        errorMessage,
        quizConfig,
        setQuizConfig,
        questions,
        currentIndex,
        userAnswers,
        score,
        streak,
        maxStreak,
        timeLeft,
        setTimeLeft,
        isAnswered,
        selectedOption,
        disabledOptions,
        lifelinesUsed,
        customQuizzes,
        quizHistory,
        startQuiz,
        startCustomQuiz,
        submitAnswer,
        nextQuestion,
        useFiftyFifty,
        useTimeBoost,
        useHint,
        saveCustomQuiz,
        deleteCustomQuiz,
        clearHistory,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
}

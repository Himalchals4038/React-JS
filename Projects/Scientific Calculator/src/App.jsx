import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ScientificCalculator from './components/ScientificCalculator';
import CurrencyConverter from './components/CurrencyConverter';
import UnitConverter from './components/UnitConverter';
import QuickTools from './components/QuickTools';
import HistoryDrawer from './components/HistoryDrawer';
import { soundEngine } from './utils/audio';

const HISTORY_STORAGE_KEY = 'quantum_calc_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('scientific');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Calculator states
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [previewResult, setPreviewResult] = useState(null);
  const [angleMode, setAngleMode] = useState('DEG');
  const [memoryValue, setMemoryValue] = useState(0);

  // History state
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync sound settings with audio engine
  useEffect(() => {
    soundEngine.enabled = soundEnabled;
  }, [soundEnabled]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save calculation history');
    }
  }, [history]);

  // Add item to history log
  const handleAddHistory = (expr, res) => {
    if (!expr || !res) return;
    const newItem = {
      id: Date.now().toString(),
      expression: expr,
      result: String(res),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setHistory(prev => [newItem, ...prev.slice(0, 49)]); // Keep last 50
  };

  // Clear history
  const handleClearHistory = () => {
    soundEngine.playClick('clear');
    setHistory([]);
    showToast('Calculation history cleared');
  };

  // Recall item from history
  const handleRecallHistory = (item) => {
    setActiveTab('scientific');
    setExpression(item.expression);
    setResult(item.result);
    showToast(`Recalled: ${item.expression}`);
  };

  // Toast alert
  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <div className="app-wrapper">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
        onToggleHistory={() => setIsHistoryOpen(prev => !prev)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      <main style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center' }}>
        {activeTab === 'scientific' && (
          <ScientificCalculator
            expression={expression}
            setExpression={setExpression}
            result={result}
            setResult={setResult}
            previewResult={previewResult}
            setPreviewResult={setPreviewResult}
            angleMode={angleMode}
            setAngleMode={setAngleMode}
            memoryValue={memoryValue}
            setMemoryValue={setMemoryValue}
            onAddHistory={handleAddHistory}
          />
        )}

        {activeTab === 'currency' && (
          <CurrencyConverter
            onAddHistory={handleAddHistory}
            showToast={showToast}
          />
        )}

        {activeTab === 'units' && (
          <UnitConverter
            onAddHistory={handleAddHistory}
            showToast={showToast}
          />
        )}

        {activeTab === 'extras' && (
          <QuickTools
            onAddHistory={handleAddHistory}
            showToast={showToast}
          />
        )}
      </main>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onRecallHistory={handleRecallHistory}
        showToast={showToast}
      />

      {/* Toast Overlay */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

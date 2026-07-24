import React, { useEffect, useCallback } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import { evaluateExpression, formatResult } from '../utils/mathEngine';
import { soundEngine } from '../utils/audio';

export default function ScientificCalculator({
  expression,
  setExpression,
  result,
  setResult,
  previewResult,
  setPreviewResult,
  angleMode,
  setAngleMode,
  memoryValue,
  setMemoryValue,
  onAddHistory
}) {

  // Update live preview whenever expression or angle mode changes
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setPreviewResult(null);
      return;
    }

    const { formattedResult, error } = evaluateExpression(expression, angleMode);
    if (!error && formattedResult !== 'Error') {
      setPreviewResult(formattedResult);
    } else {
      setPreviewResult(null);
    }
  }, [expression, angleMode, setPreviewResult]);

  // Key press processor
  const handleKeyPress = useCallback((label, action, type) => {
    soundEngine.playClick(type);

    if (action === 'AC') {
      setExpression('');
      setResult(null);
      setPreviewResult(null);
      return;
    }

    if (action === 'DEL') {
      if (result !== null) {
        setResult(null);
        return;
      }
      setExpression(prev => prev.slice(0, -1));
      return;
    }

    if (action === 'evaluate' || label === '=') {
      if (!expression) return;
      const { formattedResult, error } = evaluateExpression(expression, angleMode);
      if (error || formattedResult === 'Error') {
        setResult('Error');
      } else {
        setResult(formattedResult);
        // Add to history
        onAddHistory(expression, formattedResult);
      }
      return;
    }

    if (action === 'negate') {
      if (result !== null) {
        setExpression(`-(${result})`);
        setResult(null);
      } else if (expression) {
        if (expression.startsWith('-(') && expression.endsWith(')')) {
          setExpression(expression.slice(2, -1));
        } else {
          setExpression(`-(${expression})`);
        }
      }
      return;
    }

    // If result was just calculated and user presses a digit, start fresh
    let currentExpr = expression;
    if (result !== null) {
      if (action === 'digit' || action === 'constant' || action === 'function') {
        currentExpr = '';
      } else if (action === 'operator') {
        currentExpr = result;
      }
      setResult(null);
    }

    // Append characters appropriately
    if (action === 'function') {
      setExpression(currentExpr + label);
    } else {
      setExpression(currentExpr + label);
    }
  }, [expression, result, angleMode, setExpression, setResult, setPreviewResult, onAddHistory]);

  // Memory Register actions
  const handleMemoryAction = (type) => {
    soundEngine.playClick('action');
    const currentVal = result !== null ? Number(result) : (previewResult !== null ? Number(previewResult) : 0);

    if (isNaN(currentVal)) return;

    switch (type) {
      case 'MC':
        setMemoryValue(0);
        break;
      case 'MR':
        if (result !== null) setResult(null);
        setExpression(prev => prev + String(memoryValue));
        break;
      case 'MS':
        setMemoryValue(currentVal);
        break;
      case 'M+':
        setMemoryValue(prev => prev + currentVal);
        break;
      case 'M-':
        setMemoryValue(prev => prev - currentVal);
        break;
      default:
        break;
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing into an input field outside calculator
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        handleKeyPress(key, 'digit', 'num');
      } else if (key === '.') {
        handleKeyPress('.', 'digit', 'num');
      } else if (key === '+') {
        handleKeyPress('+', 'operator', 'op');
      } else if (key === '-') {
        handleKeyPress('−', 'operator', 'op');
      } else if (key === '*') {
        handleKeyPress('×', 'operator', 'op');
      } else if (key === '/') {
        handleKeyPress('÷', 'operator', 'op');
      } else if (key === '(' || key === ')') {
        handleKeyPress(key, 'append', 'func');
      } else if (key === '^') {
        handleKeyPress('^', 'operator', 'op');
      } else if (key === '%') {
        handleKeyPress('%', 'operator', 'op');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleKeyPress('=', 'evaluate', 'equals');
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleKeyPress('DEL', 'DEL', 'clear');
      } else if (key === 'Escape') {
        e.preventDefault();
        handleKeyPress('AC', 'AC', 'clear');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="calc-container glass-panel">
      <Display
        expression={expression}
        result={result}
        previewResult={previewResult}
        angleMode={angleMode}
        setAngleMode={setAngleMode}
        memoryValue={memoryValue}
        onMemoryAction={handleMemoryAction}
      />

      <Keypad onKeyPress={handleKeyPress} />
    </div>
  );
}

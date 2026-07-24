import React from 'react';

export default function Display({
  expression,
  result,
  previewResult,
  angleMode,
  setAngleMode,
  memoryValue,
  onMemoryAction
}) {
  const toggleAngleMode = () => {
    if (angleMode === 'DEG') setAngleMode('RAD');
    else if (angleMode === 'RAD') setAngleMode('GRAD');
    else setAngleMode('DEG');
  };

  return (
    <div className="display-screen">
      {/* Header Info Bar */}
      <div className="display-header">
        <div className="status-badges">
          <button 
            className={`status-tag ${angleMode ? 'active' : ''}`}
            onClick={toggleAngleMode}
            title="Click to toggle angle unit (DEG -> RAD -> GRAD)"
          >
            {angleMode}
          </button>
          
          <span className={`status-tag ${memoryValue !== 0 ? 'active' : ''}`}>
            {memoryValue !== 0 ? `M (${memoryValue})` : 'M'}
          </span>
        </div>

        <div style={{ fontSize: '0.75rem', letterSpacing: '1px', opacity: 0.7 }}>
          SCIENTIFIC
        </div>
      </div>

      {/* Expression Preview */}
      <div className="expression-line">
        {expression || '0'}
      </div>

      {/* Main Result Line */}
      <div className={`result-line ${result === null && previewResult ? 'preview' : ''}`}>
        {result !== null ? result : (previewResult !== null ? `= ${previewResult}` : '0')}
      </div>

      {/* Memory Quick Toolbar */}
      <div className="memory-bar">
        <button className="mem-btn" onClick={() => onMemoryAction('MC')} title="Memory Clear">MC</button>
        <button className="mem-btn" onClick={() => onMemoryAction('MR')} title="Memory Recall">MR</button>
        <button className="mem-btn" onClick={() => onMemoryAction('MS')} title="Memory Store">MS</button>
        <button className="mem-btn" onClick={() => onMemoryAction('M+')} title="Memory Add">M+</button>
        <button className="mem-btn" onClick={() => onMemoryAction('M-')} title="Memory Subtract">M-</button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

export default function Keypad({ onKeyPress }) {
  const [isSecond, setIsSecond] = useState(false);

  const handleBtnClick = (label, action, type) => {
    onKeyPress(label, action, type);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {/* 2nd Function indicator bar */}
      <div className="mode-sub-bar">
        <button 
          className={`mode-sub-btn ${isSecond ? 'active' : ''}`}
          onClick={() => setIsSecond(!isSecond)}
        >
          2nd Mode {isSecond ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="keypad-grid">
        {/* Row 1 */}
        <button 
          className={`key-btn key-func ${isSecond ? 'active' : ''}`} 
          onClick={() => setIsSecond(!isSecond)}
        >
          2nd
        </button>
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick(isSecond ? 'asin(' : 'sin(', 'function', 'func')}
        >
          {isSecond ? 'sin⁻¹' : 'sin'}
        </button>
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick(isSecond ? 'acos(' : 'cos(', 'function', 'func')}
        >
          {isSecond ? 'cos⁻¹' : 'cos'}
        </button>
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick(isSecond ? 'atan(' : 'tan(', 'function', 'func')}
        >
          {isSecond ? 'tan⁻¹' : 'tan'}
        </button>
        <button 
          className="key-btn key-action" 
          onClick={() => handleBtnClick('DEL', 'DEL', 'clear')}
        >
          DEL
        </button>

        {/* Row 2 */}
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick(isSecond ? 'exp(' : 'ln(', 'function', 'func')}
        >
          {isSecond ? 'eˣ' : 'ln'}
        </button>
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick(isSecond ? '10^(' : 'log10(', 'function', 'func')}
        >
          {isSecond ? '10ˣ' : 'log'}
        </button>
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick('^', 'operator', 'op')}
        >
          xʸ
        </button>
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick(isSecond ? 'abs(' : '(', 'append', 'func')}
        >
          {isSecond ? '|x|' : '('}
        </button>
        <button 
          className="key-btn key-action" 
          onClick={() => handleBtnClick('AC', 'AC', 'clear')}
        >
          AC
        </button>

        {/* Row 3 */}
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick(isSecond ? 'cbrt(' : 'sqrt(', 'function', 'func')}
        >
          {isSecond ? '∛' : '√'}
        </button>
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick('^2', 'append', 'func')}
        >
          x²
        </button>
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick(')', 'append', 'func')}
        >
          )
        </button>
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick('%', 'operator', 'op')}
        >
          %
        </button>
        <button 
          className="key-btn key-op" 
          onClick={() => handleBtnClick('÷', 'operator', 'op')}
        >
          ÷
        </button>

        {/* Row 4 */}
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick('!', 'operator', 'func')}
        >
          n!
        </button>
        <button className="key-btn key-num" onClick={() => handleBtnClick('7', 'digit', 'num')}>7</button>
        <button className="key-btn key-num" onClick={() => handleBtnClick('8', 'digit', 'num')}>8</button>
        <button className="key-btn key-num" onClick={() => handleBtnClick('9', 'digit', 'num')}>9</button>
        <button className="key-btn key-op" onClick={() => handleBtnClick('×', 'operator', 'op')}>×</button>

        {/* Row 5 */}
        <button 
          className="key-btn key-func" 
          onClick={() => handleBtnClick('1/(', 'function', 'func')}
        >
          1/x
        </button>
        <button className="key-btn key-num" onClick={() => handleBtnClick('4', 'digit', 'num')}>4</button>
        <button className="key-btn key-num" onClick={() => handleBtnClick('5', 'digit', 'num')}>5</button>
        <button className="key-btn key-num" onClick={() => handleBtnClick('6', 'digit', 'num')}>6</button>
        <button className="key-btn key-op" onClick={() => handleBtnClick('−', 'operator', 'op')}>−</button>

        {/* Row 6 */}
        <button className="key-btn key-func" onClick={() => handleBtnClick('π', 'constant', 'func')}>π</button>
        <button className="key-btn key-num" onClick={() => handleBtnClick('1', 'digit', 'num')}>1</button>
        <button className="key-btn key-num" onClick={() => handleBtnClick('2', 'digit', 'num')}>2</button>
        <button className="key-btn key-num" onClick={() => handleBtnClick('3', 'digit', 'num')}>3</button>
        <button className="key-btn key-op" onClick={() => handleBtnClick('+', 'operator', 'op')}>+</button>

        {/* Row 7 */}
        <button className="key-btn key-func" onClick={() => handleBtnClick('e', 'constant', 'func')}>e</button>
        <button className="key-btn key-func" onClick={() => handleBtnClick('±', 'negate', 'func')}>±</button>
        <button className="key-btn key-num" onClick={() => handleBtnClick('0', 'digit', 'num')}>0</button>
        <button className="key-btn key-num" onClick={() => handleBtnClick('.', 'digit', 'num')}>.</button>
        <button className="key-btn key-equals" onClick={() => handleBtnClick('=', 'evaluate', 'equals')}>=</button>
      </div>
    </div>
  );
}

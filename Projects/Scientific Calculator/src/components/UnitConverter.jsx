import React, { useState, useMemo } from 'react';
import { ArrowRightLeft, Copy, Ruler, Scale, Thermometer, Square, Box, Gauge, Activity, Zap, HardDrive } from 'lucide-react';
import { UNIT_CATEGORIES, convertUnit } from '../utils/unitData';
import { soundEngine } from '../utils/audio';

const ICON_MAP = {
  Ruler, Scale, Thermometer, Square, Box, Gauge, Activity, Zap, HardDrive
};

export default function UnitConverter({ onAddHistory, showToast }) {
  const [categoryKey, setCategoryKey] = useState('length');
  
  const currentCategory = UNIT_CATEGORIES[categoryKey];
  const defaultFrom = currentCategory.units[0].id;
  const defaultTo = currentCategory.units[1] ? currentCategory.units[1].id : currentCategory.units[0].id;

  const [fromUnit, setFromUnit] = useState(defaultFrom);
  const [toUnit, setToUnit] = useState(defaultTo);
  const [inputValue, setInputValue] = useState('1');

  // Change category handler
  const handleCategoryChange = (key) => {
    soundEngine.playClick('action');
    setCategoryKey(key);
    const cat = UNIT_CATEGORIES[key];
    setFromUnit(cat.units[0].id);
    setToUnit(cat.units[1] ? cat.units[1].id : cat.units[0].id);
  };

  // Live conversion output
  const convertedResult = useMemo(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return 0;
    return convertUnit(num, fromUnit, toUnit, categoryKey);
  }, [inputValue, fromUnit, toUnit, categoryKey]);

  const handleSwap = () => {
    soundEngine.playClick('action');
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    soundEngine.playClick('standard');
    const fromObj = currentCategory.units.find(u => u.id === fromUnit);
    const toObj = currentCategory.units.find(u => u.id === toUnit);
    const text = `${inputValue} ${fromObj.name} = ${convertedResult} ${toObj.name}`;
    navigator.clipboard.writeText(text);
    showToast('Copied unit conversion to clipboard!');
    onAddHistory(`${inputValue} ${fromUnit} → ${toUnit}`, String(convertedResult));
  };

  return (
    <div className="converter-card glass-panel">
      <div className="converter-title">
        <ArrowRightLeft className="text-cyan-400" size={26} style={{ color: '#00f0ff' }} />
        <span>Scientific Unit Converter</span>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        {Object.entries(UNIT_CATEGORIES).map(([key, cat]) => {
          const IconComponent = ICON_MAP[cat.icon] || Ruler;
          const isActive = categoryKey === key;
          return (
            <button
              key={key}
              className={`cat-pill ${isActive ? 'active' : ''}`}
              onClick={() => handleCategoryChange(key)}
            >
              <IconComponent size={14} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Converter Inputs */}
      <div className="currency-row">
        {/* From Group */}
        <div className="convert-input-group">
          <div className="input-label">From Unit</div>
          <select 
            className="currency-select"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            {currentCategory.units.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <input 
            type="number"
            className="convert-number-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value..."
          />
        </div>

        {/* Swap Button */}
        <div className="swap-btn-container">
          <button className="swap-circle-btn" onClick={handleSwap} title="Swap Units">
            <ArrowRightLeft size={20} />
          </button>
        </div>

        {/* To Group */}
        <div className="convert-input-group">
          <div className="input-label">To Unit (Converted)</div>
          <select 
            className="currency-select"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
          >
            {currentCategory.units.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <div className="convert-number-input" style={{ color: '#00f0ff', wordBreak: 'break-all' }}>
            {typeof convertedResult === 'number' ? convertedResult.toLocaleString(undefined, { maximumFractionDigits: 6 }) : convertedResult}
          </div>
        </div>
      </div>

      {/* Footer Copy */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="icon-btn" onClick={handleCopy} title="Copy Conversion Result">
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
}

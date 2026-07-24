import React, { useState, useEffect, useMemo } from 'react';
import { Coins, ArrowRightLeft, RefreshCw, Check, Copy } from 'lucide-react';
import { CURRENCY_LIST, fetchExchangeRates, convertCurrency } from '../utils/currencyApi';
import { soundEngine } from '../utils/audio';

export default function CurrencyConverter({ onAddHistory, showToast }) {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [isCached, setIsCached] = useState(false);

  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');

  // Load exchange rates
  const loadRates = async () => {
    setLoading(true);
    const data = await fetchExchangeRates();
    setRates(data.rates);
    setLastUpdated(data.lastUpdated);
    setIsCached(data.isCached);
    setLoading(false);
  };

  useEffect(() => {
    loadRates();
  }, []);

  // Calculation
  const convertedValue = useMemo(() => {
    if (!rates || !amount) return 0;
    const num = parseFloat(amount);
    if (isNaN(num)) return 0;
    return convertCurrency(num, fromCurrency, toCurrency, rates);
  }, [amount, fromCurrency, toCurrency, rates]);

  // Single unit rate
  const singleUnitRate = useMemo(() => {
    if (!rates) return 0;
    return convertCurrency(1, fromCurrency, toCurrency, rates);
  }, [fromCurrency, toCurrency, rates]);

  // Reverse rate
  const reverseRate = useMemo(() => {
    if (!singleUnitRate || singleUnitRate === 0) return 0;
    return 1 / singleUnitRate;
  }, [singleUnitRate]);

  const handleSwap = () => {
    soundEngine.playClick('action');
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleCopy = () => {
    soundEngine.playClick('standard');
    const formattedStr = `${amount} ${fromCurrency} = ${convertedValue.toFixed(2)} ${toCurrency}`;
    navigator.clipboard.writeText(formattedStr);
    showToast('Copied currency conversion to clipboard!');
    onAddHistory(`${amount} ${fromCurrency} → ${toCurrency}`, convertedValue.toFixed(2));
  };

  return (
    <div className="converter-card glass-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="converter-title">
          <Coins className="text-amber-400" size={26} style={{ color: '#ff9e00' }} />
          <span>Real-Time Currency Converter</span>
        </div>

        <button 
          className="icon-btn" 
          onClick={loadRates} 
          disabled={loading}
          title="Refresh Exchange Rates"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Currency Form Row */}
      <div className="currency-row">
        {/* From Group */}
        <div className="convert-input-group">
          <div className="input-label">You Send</div>
          <select 
            className="currency-select"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {CURRENCY_LIST.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name} ({c.symbol})
              </option>
            ))}
          </select>
          <input 
            type="number"
            className="convert-number-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
          />
        </div>

        {/* Swap Button */}
        <div className="swap-btn-container">
          <button className="swap-circle-btn" onClick={handleSwap} title="Swap Currencies">
            <ArrowRightLeft size={20} />
          </button>
        </div>

        {/* To Group */}
        <div className="convert-input-group">
          <div className="input-label">You Receive (Converted)</div>
          <select 
            className="currency-select"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {CURRENCY_LIST.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name} ({c.symbol})
              </option>
            ))}
          </select>
          <div className="convert-number-input" style={{ color: '#00f0ff', wordBreak: 'break-all' }}>
            {convertedValue ? convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '0.00'}
          </div>
        </div>
      </div>

      {/* Exchange Rate Details Box */}
      <div className="rate-info-box">
        <div>
          <div>1 {fromCurrency} = <strong style={{ color: '#fff' }}>{singleUnitRate.toFixed(4)} {toCurrency}</strong></div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
            1 {toCurrency} = {reverseRate.toFixed(4)} {fromCurrency}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
            <div>API Sync: {lastUpdated || 'Syncing...'}</div>
            {isCached && <div style={{ color: '#f59e0b' }}>Offline/Cached</div>}
          </div>

          <button className="icon-btn" onClick={handleCopy} title="Copy Conversion Result">
            <Copy size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

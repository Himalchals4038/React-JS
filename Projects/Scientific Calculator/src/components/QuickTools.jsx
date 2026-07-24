import React, { useState } from 'react';
import { Calculator, Activity, DollarSign, Percent } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function QuickTools({ onAddHistory, showToast }) {
  const [activeTool, setActiveTool] = useState('emi');

  // EMI State
  const [loanAmount, setLoanAmount] = useState('100000');
  const [interestRate, setInterestRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('5');

  // BMI State
  const [weightKg, setWeightKg] = useState('70');
  const [heightCm, setHeightCm] = useState('175');

  // Quadratic State
  const [quadA, setQuadA] = useState('1');
  const [quadB, setQuadB] = useState('-5');
  const [quadC, setQuadC] = useState('6');

  // Calculate EMI
  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / (12 * 100);
    const n = parseFloat(tenureYears) * 12;

    if (!P || !r || !n) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2)
    };
  };

  // Calculate BMI
  const calculateBMI = () => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm) / 100;
    if (!w || !h) return { bmi: 0, category: 'N/A' };
    const bmi = w / (h * h);
    let category = 'Normal weight';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
    else if (bmi >= 30) category = 'Obese';

    return { bmi: bmi.toFixed(1), category };
  };

  // Calculate Quadratic
  const calculateQuadratic = () => {
    const a = parseFloat(quadA);
    const b = parseFloat(quadB);
    const c = parseFloat(quadC);
    if (!a) return 'a cannot be zero';

    const disc = b * b - 4 * a * c;
    if (disc > 0) {
      const x1 = (-b + Math.sqrt(disc)) / (2 * a);
      const x2 = (-b - Math.sqrt(disc)) / (2 * a);
      return `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`;
    } else if (disc === 0) {
      const x = -b / (2 * a);
      return `x = ${x.toFixed(4)} (double root)`;
    } else {
      const real = (-b / (2 * a)).toFixed(4);
      const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(4);
      return `x = ${real} ± ${imag}i`;
    }
  };

  const emiRes = calculateEMI();
  const bmiRes = calculateBMI();
  const quadRes = calculateQuadratic();

  return (
    <div className="converter-card glass-panel">
      {/* Tool Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button 
          className={`nav-tab ${activeTool === 'emi' ? 'active' : ''}`}
          onClick={() => { soundEngine.playClick('action'); setActiveTool('emi'); }}
        >
          <DollarSign size={16} /> Loan EMI
        </button>
        <button 
          className={`nav-tab ${activeTool === 'bmi' ? 'active' : ''}`}
          onClick={() => { soundEngine.playClick('action'); setActiveTool('bmi'); }}
        >
          <Activity size={16} /> Health BMI
        </button>
        <button 
          className={`nav-tab ${activeTool === 'quad' ? 'active' : ''}`}
          onClick={() => { soundEngine.playClick('action'); setActiveTool('quad'); }}
        >
          <Calculator size={16} /> Quadratic Solver
        </button>
      </div>

      {/* EMI TOOL */}
      {activeTool === 'emi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="currency-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="convert-input-group">
              <div className="input-label">Loan Amount</div>
              <input type="number" className="convert-number-input" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
            </div>
            <div className="convert-input-group">
              <div className="input-label">Annual Interest (%)</div>
              <input type="number" className="convert-number-input" value={interestRate} onChange={e => setInterestRate(e.target.value)} step="0.1" />
            </div>
            <div className="convert-input-group">
              <div className="input-label">Tenure (Years)</div>
              <input type="number" className="convert-number-input" value={tenureYears} onChange={e => setTenureYears(e.target.value)} />
            </div>
          </div>

          <div className="rate-info-box" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#00f0ff', fontWeight: 700 }}>
              Monthly EMI: ${emiRes.emi}
            </div>
            <div>Total Interest: ${emiRes.totalInterest} | Total Payment: ${emiRes.totalPayment}</div>
          </div>
        </div>
      )}

      {/* BMI TOOL */}
      {activeTool === 'bmi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="currency-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="convert-input-group">
              <div className="input-label">Weight (kg)</div>
              <input type="number" className="convert-number-input" value={weightKg} onChange={e => setWeightKg(e.target.value)} />
            </div>
            <div className="convert-input-group">
              <div className="input-label">Height (cm)</div>
              <input type="number" className="convert-number-input" value={heightCm} onChange={e => setHeightCm(e.target.value)} />
            </div>
          </div>

          <div className="rate-info-box">
            <div>
              <div style={{ fontSize: '1.4rem', color: '#ff9e00', fontWeight: 700 }}>
                BMI: {bmiRes.bmi}
              </div>
              <div style={{ color: '#fff', fontWeight: 600 }}>Category: {bmiRes.category}</div>
            </div>
          </div>
        </div>
      )}

      {/* QUADRATIC SOLVER */}
      {activeTool === 'quad' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Solve equation format: <strong style={{ color: '#fff' }}>ax² + bx + c = 0</strong>
          </div>
          <div className="currency-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="convert-input-group">
              <div className="input-label">Coefficient a</div>
              <input type="number" className="convert-number-input" value={quadA} onChange={e => setQuadA(e.target.value)} />
            </div>
            <div className="convert-input-group">
              <div className="input-label">Coefficient b</div>
              <input type="number" className="convert-number-input" value={quadB} onChange={e => setQuadB(e.target.value)} />
            </div>
            <div className="convert-input-group">
              <div className="input-label">Coefficient c</div>
              <input type="number" className="convert-number-input" value={quadC} onChange={e => setQuadC(e.target.value)} />
            </div>
          </div>

          <div className="rate-info-box">
            <div style={{ fontSize: '1.2rem', color: '#00f0ff', fontWeight: 700 }}>
              Roots: {quadRes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

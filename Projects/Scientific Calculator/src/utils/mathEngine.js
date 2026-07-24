import { create, all } from 'mathjs';

// Initialize mathjs instance
const math = create(all, {});

/**
 * Format result nicely with precision limit to avoid floating point anomalies (e.g. 0.1 + 0.2 = 0.3)
 */
export function formatResult(value, precision = 12) {
  if (value === null || value === undefined || isNaN(value)) {
    return 'Error';
  }
  if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  }
  if (typeof value === 'object' && value.isComplex) {
    const re = formatResult(value.re, 6);
    const im = formatResult(value.im, 6);
    return `${re} ${value.im >= 0 ? '+' : '-'} ${Math.abs(value.im)}i`;
  }
  if (typeof value === 'number') {
    if (!isFinite(value)) {
      return value > 0 ? 'Infinity' : '-Infinity';
    }
    // Very large or very small numbers -> scientific notation
    if (Math.abs(value) > 1e12 || (Math.abs(value) < 1e-7 && value !== 0)) {
      return value.toExponential(6);
    }
    // Round to avoid 0.000000000000000004
    const rounded = Number(Math.round(Number(value + 'e' + precision)) + 'e-' + precision);
    return String(rounded);
  }
  return String(value);
}

/**
 * Preprocess math expression before evaluation:
 * 1. Replace UI symbols like ×, ÷, π, √ with mathjs compatible operators (*, /, pi, sqrt)
 * 2. Handle Angle Mode for sin, cos, tan, asin, acos, atan if mode is DEG or GRAD
 */
export function preprocessExpression(expr, angleMode = 'DEG') {
  if (!expr) return '';

  let sanitized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/e/g, 'e')
    .replace(/√\(/g, 'sqrt(')
    .replace(/∛\(/g, 'cbrt(')
    .replace(/%/g, '/100');

  // Handle angle conversions if mode is DEG or GRAD
  if (angleMode === 'DEG') {
    // Replace trig functions with unit arguments: e.g., sin(30) -> sin(30 deg)
    sanitized = transformTrigForAngleMode(sanitized, 'deg');
  } else if (angleMode === 'GRAD') {
    sanitized = transformTrigForAngleMode(sanitized, 'grad');
  }

  return sanitized;
}

/**
 * Transform trig calls to include angle unit if needed
 */
function transformTrigForAngleMode(expr, unit) {
  // Regex to target basic trig functions sin, cos, tan
  const trigRegex = /\b(sin|cos|tan)\(([^()]+)\)/g;

  // Replace recursively for nested trig if possible, or simple single pass
  let result = expr;
  let matches = 0;
  while (trigRegex.test(result) && matches < 10) {
    result = result.replace(trigRegex, (match, func, arg) => {
      // If arg already has a unit like deg/rad, leave it
      if (/deg|rad|grad/i.test(arg)) {
        return `${func}(${arg})`;
      }
      return `${func}((${arg}) ${unit})`;
    });
    matches++;
  }
  return result;
}

/**
 * Evaluate mathematical expression safely using mathjs
 * returns { result, formattedResult, error }
 */
export function evaluateExpression(expression, angleMode = 'DEG') {
  if (!expression || expression.trim() === '') {
    return { result: null, formattedResult: '', error: null };
  }

  try {
    const cleaned = preprocessExpression(expression, angleMode);
    const rawResult = math.evaluate(cleaned);
    
    // Convert angle results for inverse trig if needed (asin, acos, atan return radians by default)
    let finalResult = rawResult;
    
    // Format formatted result
    const formatted = formatResult(finalResult);
    return {
      result: rawResult,
      formattedResult: formatted,
      error: null
    };
  } catch (err) {
    return {
      result: null,
      formattedResult: 'Error',
      error: err.message || 'Invalid Expression'
    };
  }
}

/**
 * Factorial calculator for integer n
 */
export function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

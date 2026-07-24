const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest/USD';
const CACHE_KEY = 'quantum_calc_currency_rates_v1';
const CACHE_DURATION_MS = 3600 * 1000; // 1 hour

export const CURRENCY_LIST = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' }
];

// Fallback rates if user is offline and has no cache
const FALLBACK_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.5,
  JPY: 155.0,
  CAD: 1.36,
  AUD: 1.51,
  CHF: 0.90,
  CNY: 7.24,
  AED: 3.67,
  SGD: 1.35,
  NZD: 1.63,
  HKD: 7.81,
  KRW: 1370.0,
  BRL: 5.45,
  ZAR: 18.2,
  MXN: 18.1,
  SAR: 3.75,
  THB: 36.5
};

/**
 * Fetch latest currency exchange rates relative to USD
 */
export async function fetchExchangeRates() {
  // Check cached rates first
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      const isFresh = Date.now() - parsed.timestamp < CACHE_DURATION_MS;
      if (isFresh && parsed.rates) {
        return {
          rates: parsed.rates,
          lastUpdated: new Date(parsed.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCached: true
        };
      }
    } catch (e) {
      console.warn('Failed to parse cached currency rates', e);
    }
  }

  // Fetch live from API
  try {
    const res = await fetch(CURRENCY_API_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    if (data && data.rates) {
      const payload = {
        rates: data.rates,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      return {
        rates: data.rates,
        lastUpdated: new Date(data.time_last_update_unix * 1000 || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCached: false
      };
    }
  } catch (err) {
    console.error('Failed to fetch currency rates, using fallback:', err);
  }

  // Use cached if available even if stale
  if (cachedData) {
    const parsed = JSON.parse(cachedData);
    return {
      rates: parsed.rates,
      lastUpdated: 'Cached (' + new Date(parsed.timestamp).toLocaleDateString() + ')',
      isCached: true
    };
  }

  // Final fallback
  return {
    rates: FALLBACK_RATES,
    lastUpdated: 'Offline Default',
    isCached: true
  };
}

/**
 * Convert amount between two currencies using USD base rates
 */
export function convertCurrency(amount, fromCurrency, toCurrency, rates) {
  if (!amount || isNaN(amount) || !rates) return 0;
  
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  // Convert to USD base first, then to target currency
  const amountInUSD = amount / fromRate;
  const converted = amountInUSD * toRate;
  
  return converted;
}

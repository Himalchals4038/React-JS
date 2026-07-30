// Number formatter with scientific suffixes for Tycoon games
const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd'];

export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num < 0) return '-' + formatNumber(-num, decimals);
  if (num < 1000) return num.toLocaleString('en-US', { maximumFractionDigits: decimals });

  const tier = Math.floor(Math.log10(num) / 3);
  if (tier < SUFFIXES.length) {
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
    return scaled.toFixed(decimals) + ' ' + SUFFIXES[tier];
  }

  return num.toExponential(2);
};

export const formatTime = (seconds) => {
  if (seconds <= 0) return '0s';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
};

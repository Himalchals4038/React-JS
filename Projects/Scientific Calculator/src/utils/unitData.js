export const UNIT_CATEGORIES = {
  length: {
    name: 'Length',
    icon: 'Ruler',
    base: 'm',
    units: [
      { id: 'm', name: 'Meter (m)', factor: 1 },
      { id: 'km', name: 'Kilometer (km)', factor: 1000 },
      { id: 'cm', name: 'Centimeter (cm)', factor: 0.01 },
      { id: 'mm', name: 'Millimeter (mm)', factor: 0.001 },
      { id: 'μm', name: 'Micrometer (μm)', factor: 1e-6 },
      { id: 'nm', name: 'Nanometer (nm)', factor: 1e-9 },
      { id: 'mi', name: 'Mile (mi)', factor: 1609.344 },
      { id: 'yd', name: 'Yard (yd)', factor: 0.9144 },
      { id: 'ft', name: 'Foot (ft)', factor: 0.3048 },
      { id: 'in', name: 'Inch (in)', factor: 0.0254 },
      { id: 'nmi', name: 'Nautical Mile (nmi)', factor: 1852 }
    ]
  },
  mass: {
    name: 'Mass & Weight',
    icon: 'Scale',
    base: 'kg',
    units: [
      { id: 'kg', name: 'Kilogram (kg)', factor: 1 },
      { id: 'g', name: 'Gram (g)', factor: 0.001 },
      { id: 'mg', name: 'Milligram (mg)', factor: 1e-6 },
      { id: 't', name: 'Metric Ton (t)', factor: 1000 },
      { id: 'lb', name: 'Pound (lb)', factor: 0.45359237 },
      { id: 'oz', name: 'Ounce (oz)', factor: 0.028349523125 },
      { id: 'st', name: 'Stone (st)', factor: 6.35029318 }
    ]
  },
  temperature: {
    name: 'Temperature',
    icon: 'Thermometer',
    special: true,
    units: [
      { id: 'C', name: 'Celsius (°C)' },
      { id: 'F', name: 'Fahrenheit (°F)' },
      { id: 'K', name: 'Kelvin (K)' }
    ]
  },
  area: {
    name: 'Area',
    icon: 'Square',
    base: 'm2',
    units: [
      { id: 'm2', name: 'Square Meter (m²)', factor: 1 },
      { id: 'km2', name: 'Square Kilometer (km²)', factor: 1000000 },
      { id: 'cm2', name: 'Square Centimeter (cm²)', factor: 0.0001 },
      { id: 'ft2', name: 'Square Foot (ft²)', factor: 0.09290304 },
      { id: 'in2', name: 'Square Inch (in²)', factor: 0.00064516 },
      { id: 'ha', name: 'Hectare (ha)', factor: 10000 },
      { id: 'ac', name: 'Acre (ac)', factor: 4046.8564224 }
    ]
  },
  volume: {
    name: 'Volume',
    icon: 'Box',
    base: 'l',
    units: [
      { id: 'l', name: 'Liter (L)', factor: 1 },
      { id: 'ml', name: 'Milliliter (mL)', factor: 0.001 },
      { id: 'm3', name: 'Cubic Meter (m³)', factor: 1000 },
      { id: 'cm3', name: 'Cubic Centimeter (cm³)', factor: 0.001 },
      { id: 'gal', name: 'US Gallon (gal)', factor: 3.785411784 },
      { id: 'qt', name: 'US Quart (qt)', factor: 0.946352946 },
      { id: 'pt', name: 'US Pint (pt)', factor: 0.473176473 },
      { id: 'cup', name: 'US Cup', factor: 0.24 },
      { id: 'fl_oz', name: 'US Fluid Ounce (fl oz)', factor: 0.0295735295625 }
    ]
  },
  speed: {
    name: 'Speed',
    icon: 'Gauge',
    base: 'mps',
    units: [
      { id: 'mps', name: 'Meters/sec (m/s)', factor: 1 },
      { id: 'kph', name: 'Kilometers/hour (km/h)', factor: 0.277777778 },
      { id: 'mph', name: 'Miles/hour (mph)', factor: 0.44704 },
      { id: 'fps', name: 'Feet/sec (ft/s)', factor: 0.3048 },
      { id: 'knot', name: 'Knot (kn)', factor: 0.514444444 }
    ]
  },
  pressure: {
    name: 'Pressure',
    icon: 'Activity',
    base: 'pa',
    units: [
      { id: 'pa', name: 'Pascal (Pa)', factor: 1 },
      { id: 'kpa', name: 'Kilopascal (kPa)', factor: 1000 },
      { id: 'bar', name: 'Bar', factor: 100000 },
      { id: 'psi', name: 'PSI (lb/in²)', factor: 6894.757293168 },
      { id: 'atm', name: 'Atmosphere (atm)', factor: 101325 },
      { id: 'torr', name: 'Torr (mmHg)', factor: 133.322368 }
    ]
  },
  energy: {
    name: 'Energy',
    icon: 'Zap',
    base: 'j',
    units: [
      { id: 'j', name: 'Joule (J)', factor: 1 },
      { id: 'kj', name: 'Kilojoule (kJ)', factor: 1000 },
      { id: 'cal', name: 'Calorie (cal)', factor: 4.184 },
      { id: 'kcal', name: 'Kilocalorie / Food Cal (kcal)', factor: 4184 },
      { id: 'wh', name: 'Watt-hour (Wh)', factor: 3600 },
      { id: 'kwh', name: 'Kilowatt-hour (kWh)', factor: 3600000 },
      { id: 'ev', name: 'Electronvolt (eV)', factor: 1.602176634e-19 }
    ]
  },
  storage: {
    name: 'Digital Data',
    icon: 'HardDrive',
    base: 'b',
    units: [
      { id: 'b', name: 'Byte (B)', factor: 1 },
      { id: 'kb', name: 'Kilobyte (KB)', factor: 1024 },
      { id: 'mb', name: 'Megabyte (MB)', factor: 1048576 },
      { id: 'gb', name: 'Gigabyte (GB)', factor: 1073741824 },
      { id: 'tb', name: 'Terabyte (TB)', factor: 1099511627776 }
    ]
  }
};

/**
 * Convert value between units
 */
export function convertUnit(value, fromUnitId, toUnitId, categoryKey) {
  if (value === null || value === undefined || isNaN(value)) return 0;
  const numVal = Number(value);
  const cat = UNIT_CATEGORIES[categoryKey];
  if (!cat) return 0;

  // Temperature special case
  if (categoryKey === 'temperature') {
    return convertTemperature(numVal, fromUnitId, toUnitId);
  }

  // Linear factor conversion
  const fromObj = cat.units.find(u => u.id === fromUnitId);
  const toObj = cat.units.find(u => u.id === toUnitId);
  if (!fromObj || !toObj) return 0;

  const valueInBase = numVal * fromObj.factor;
  const result = valueInBase / toObj.factor;
  return result;
}

function convertTemperature(value, from, to) {
  if (from === to) return value;
  
  // Convert from -> Celsius
  let celsius = value;
  if (from === 'F') {
    celsius = (value - 32) * (5 / 9);
  } else if (from === 'K') {
    celsius = value - 273.15;
  }

  // Convert Celsius -> to
  if (to === 'F') {
    return celsius * (9 / 5) + 32;
  } else if (to === 'K') {
    return celsius + 273.15;
  }
  return celsius;
}

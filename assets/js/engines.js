const DAY_MS = 86_400_000;

export function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) throw new Error('Enter a valid date.');
  const date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
  if (date.getUTCFullYear() !== +match[1] || date.getUTCMonth() !== +match[2] - 1 || date.getUTCDate() !== +match[3]) throw new Error('Enter a valid date.');
  return date;
}

export function isoDate(date) { return date.toISOString().slice(0, 10); }
export function formatDate(date) { return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(date); }
export function compareDates(a, b) { return Math.sign(a.getTime() - b.getTime()); }
export function addCalendarDays(date, amount) { const d = new Date(date); d.setUTCDate(d.getUTCDate() + amount); return d; }
export function daysBetween(start, end) { return Math.round((end - start) / DAY_MS); }

export function addMonths(date, amount) {
  const day = date.getUTCDate();
  const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1));
  const last = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, last));
  return result;
}

export function addYears(date, amount) {
  const result = new Date(Date.UTC(date.getUTCFullYear() + amount, date.getUTCMonth(), 1));
  const last = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(date.getUTCDate(), last));
  return result;
}

export function calendarInterval(start, end) {
  let sign = compareDates(start, end) <= 0 ? 1 : -1;
  let a = sign === 1 ? start : end;
  const b = sign === 1 ? end : start;
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + b.getUTCMonth() - a.getUTCMonth();
  let anchor = addMonths(a, months);
  if (anchor > b) { months -= 1; anchor = addMonths(a, months); }
  const days = daysBetween(anchor, b);
  const years = Math.floor(months / 12);
  return { sign, years, months: months % 12, days };
}

export function daysBetweenOptions(start, end, includeStart = false, includeEnd = false) {
  const direction = compareDates(start, end) <= 0 ? 1 : -1;
  const base = Math.abs(daysBetween(start, end));
  if (base === 0) return includeStart || includeEnd ? 1 : 0;
  return Math.max(0, base + (includeStart ? 1 : 0) + (includeEnd ? 1 : 0) - 1);
}

export function isWeekend(date) { return date.getUTCDay() === 0 || date.getUTCDay() === 6; }

export function isRuleDay(date, rules = {}) {
  const key = isoDate(date);
  if (rules.working?.has(key)) return true;
  if (rules.holidays?.has(key)) return false;
  return !isWeekend(date);
}

export function countRuleDays(start, end, rules = {}, includeStart = false, includeEnd = true) {
  const direction = compareDates(start, end) <= 0 ? 1 : -1;
  let cursor = new Date(start);
  let count = 0;
  let weekend = 0;
  let holiday = 0;
  const skipped = [];
  while (true) {
    const atStart = compareDates(cursor, start) === 0;
    const atEnd = compareDates(cursor, end) === 0;
    if ((!atStart || includeStart) && (!atEnd || includeEnd)) {
      const key = isoDate(cursor);
      if (isRuleDay(cursor, rules)) count++;
      else if (rules.holidays?.has(key)) { holiday++; skipped.push({ date: key, reason: rules.names?.[key] || 'Holiday' }); }
      else { weekend++; skipped.push({ date: key, reason: 'Weekend' }); }
    }
    if (atEnd) break;
    cursor = addCalendarDays(cursor, direction);
  }
  return { count, weekend, holiday, skipped };
}

export function addRuleDays(start, amount, rules = {}, countStart = false) {
  if (amount === 0) return new Date(start);
  const direction = amount > 0 ? 1 : -1;
  let remaining = Math.abs(amount);
  let cursor = new Date(start);
  if (countStart && isRuleDay(cursor, rules)) remaining--;
  while (remaining > 0) {
    cursor = addCalendarDays(cursor, direction);
    if (isRuleDay(cursor, rules)) remaining--;
  }
  return cursor;
}

export function subtractRuleDays(start, amount, rules = {}, countStart = false) { return addRuleDays(start, -Math.abs(amount), rules, countStart); }

export function percentageOf(percent, value) { return percent / 100 * value; }
export function percentRatio(part, whole) { if (whole === 0) return null; return part / whole * 100; }
export function wholeFromPart(part, percent) { if (percent === 0) return null; return part / (percent / 100); }
export function percentageChange(start, end) { if (start === 0) return null; return (end - start) / Math.abs(start) * 100; }
export function percentageDifference(a, b) { const average = (Math.abs(a) + Math.abs(b)) / 2; return average === 0 ? 0 : Math.abs(a - b) / average * 100; }

export function averageStats(values) {
  if (!values.length) throw new Error('Enter at least one number.');
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return { mean: sum / values.length, median, min: sorted[0], max: sorted.at(-1), range: sorted.at(-1) - sorted[0], count: values.length, sum };
}

export function gcd(a, b) { a = Math.abs(Math.trunc(a)); b = Math.abs(Math.trunc(b)); while (b) [a, b] = [b, a % b]; return a || 1; }
export function simplifyFraction(numerator, denominator) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) throw new Error('Enter valid numbers.');
  if (denominator === 0) throw new Error('The denominator cannot be zero.');
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: Math.abs(denominator / divisor) };
}

export function decimalToFraction(value, precision = 1_000_000) {
  if (!Number.isFinite(value)) throw new Error('Enter a valid number.');
  const denominator = precision;
  const numerator = Math.round(value * precision);
  return simplifyFraction(numerator, denominator);
}

export function solveProportion(values) {
  const missing = values.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
  if (missing.length !== 1) throw new Error('Leave exactly one value blank.');
  const [a, b, c, d] = values;
  const i = missing[0];
  if ((i !== 0 && a === 0) || (i !== 1 && b === 0) || (i !== 2 && c === 0) || (i !== 3 && d === 0)) {
    if ((b === 0 && i !== 1) || (d === 0 && i !== 3)) throw new Error('A proportion denominator cannot be zero.');
  }
  const result = i === 0 ? b * c / d : i === 1 ? a * d / c : i === 2 ? a * d / b : b * c / a;
  if (!Number.isFinite(result)) throw new Error('This proportion cannot be solved with these values.');
  return { index: i, value: result };
}

export function loanPayment(principal, annualRate, months) {
  if (!(principal > 0) || !(months > 0) || annualRate < 0) throw new Error('Enter a positive loan amount and term, and a non-negative rate.');
  const rate = annualRate / 100 / 12;
  const payment = rate === 0 ? principal / months : principal * rate * (1 + rate) ** months / ((1 + rate) ** months - 1);
  const total = payment * months;
  return { payment, total, interest: total - principal, payments: months };
}

export function compoundInterest({ principal, annualRate, years, compoundsPerYear, contribution = 0, contributionsPerYear = 12 }) {
  if (principal < 0 || annualRate < 0 || years < 0 || compoundsPerYear <= 0 || contributionsPerYear <= 0) throw new Error('Enter non-negative amounts, rate, and time.');
  const periods = Math.round(years * contributionsPerYear);
  let balance = principal;
  const rate = annualRate / 100;
  const dt = 1 / contributionsPerYear;
  for (let i = 0; i < periods; i++) {
    balance *= (1 + rate / compoundsPerYear) ** (compoundsPerYear * dt);
    balance += contribution;
  }
  const totalContributions = principal + contribution * periods;
  return { balance, totalContributions, interest: balance - totalContributions };
}

export const LENGTH_METERS = { mm: .001, cm: .01, m: 1, km: 1000, in: .0254, ft: .3048, yd: .9144, mi: 1609.344 };
export const WEIGHT_KG = { mg: .000001, g: .001, kg: 1, oz: .028349523125, lb: .45359237, st: 6.35029318, tonne: 1000 };
export const AREA_SQ_METERS = { mm2: 1e-6, cm2: 1e-4, m2: 1, km2: 1e6, in2: .00064516, ft2: .09290304, yd2: .83612736, acre: 4046.8564224, hectare: 10000, mi2: 2589988.110336 };
export const VOLUME_LITERS = { ml: .001, l: 1, cm3: .001, m3: 1000, tsp: .00492892159375, tbsp: .01478676478125, floz: .0295735295625, cup: .2365882365, pint: .473176473, quart: .946352946, gallon: 3.785411784, in3: .016387064, ft3: 28.316846592 };
export const SPEED_MPS = { mph: .44704, kmh: 1 / 3.6, mps: 1, fps: .3048, knot: .5144444444444445 };
export function convertUnit(value, from, to, table) { return value * table[from] / table[to]; }
export function convertTemperature(value, from, to) {
  const kelvin = from === 'C' ? value + 273.15 : from === 'F' ? (value - 32) * 5 / 9 + 273.15 : value;
  if (kelvin < 0) throw new Error('Temperature cannot be below absolute zero.');
  return to === 'C' ? kelvin - 273.15 : to === 'F' ? (kelvin - 273.15) * 9 / 5 + 32 : kelvin;
}

export function paintEstimate({ length, width, height, doors = 0, windows = 0, coats = 2, doorArea = 20, windowArea = 15, coverage = 350 }) {
  if ([length, width, height, coats, coverage].some(v => !(v > 0)) || doors < 0 || windows < 0) throw new Error('Enter positive room dimensions, coats, and coverage.');
  const gross = 2 * (length + width) * height;
  const paintableArea = Math.max(0, gross - doors * doorArea - windows * windowArea);
  const required = paintableArea * coats / coverage;
  return { gross, paintableArea, required, purchase: Math.ceil(required) };
}

export function salesTax(amount, rate, mode = 'add') {
  if (amount < 0 || rate < 0) throw new Error('Enter non-negative values.');
  const factor = 1 + rate / 100;
  if (mode === 'remove') {
    const subtotal = amount / factor;
    return { subtotal, tax: amount - subtotal, total: amount };
  }
  const tax = amount * rate / 100;
  return { subtotal: amount, tax, total: amount + tax };
}

export function markupMargin({ cost, sellingPrice = null, markup = null }) {
  if (!(cost > 0)) throw new Error('Enter a cost greater than zero.');
  const price = sellingPrice === null ? cost * (1 + markup / 100) : sellingPrice;
  if (!(price > 0)) throw new Error('Enter a selling price greater than zero.');
  const profit = price - cost;
  return { sellingPrice: price, profit, markup: profit / cost * 100, margin: profit / price * 100 };
}

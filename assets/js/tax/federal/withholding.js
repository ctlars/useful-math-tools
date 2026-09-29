import { FEDERAL_TAX_CONFIG_2026 } from './2026.js';

function nonnegative(value, label) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n < 0) throw new Error(`${label} must be zero or more.`);
  return n;
}

export function federalWithholding2026(input, config = FEDERAL_TAX_CONFIG_2026) {
  const periods = config.payPeriods[input.payFrequency];
  if (!periods) throw new Error('Choose a supported pay frequency.');
  if (!config.schedules.standard[input.filingStatus]) throw new Error('Choose a filing status.');
  const taxableWages = nonnegative(input.federalTaxableWages, 'Federal taxable wages');
  const otherIncome = nonnegative(input.otherIncome, 'Other income');
  const deductions = nonnegative(input.deductions, 'W-4 deductions');
  const credits = nonnegative(input.credits, 'W-4 credits');
  const extra = nonnegative(input.extraWithholding, 'Extra withholding');
  if (input.exempt) return { withholding: 0, periods, annualizedWages: taxableWages * periods, adjustedAnnualWages: 0, tentativeAnnualTax: 0, schedule: 'exempt' };

  const annualizedWages = taxableWages * periods;
  const adjustment = input.multipleJobs ? 0 : config.worksheetAdjustment[input.filingStatus];
  const adjustedAnnualWages = Math.max(0, annualizedWages + otherIncome - deductions - adjustment);
  const scheduleName = input.multipleJobs ? 'step2' : 'standard';
  const schedule = config.schedules[scheduleName][input.filingStatus];
  const bracket = schedule.find(row => adjustedAnnualWages >= row.floor && adjustedAnnualWages < row.ceiling) || schedule.at(-1);
  const tentativeAnnualTax = bracket.base + (adjustedAnnualWages - bracket.floor) * bracket.rate;
  const regular = Math.max(0, tentativeAnnualTax / periods - credits / periods);
  return {
    withholding: regular + extra,
    regularWithholding: regular,
    periods,
    annualizedWages,
    adjustedAnnualWages,
    tentativeAnnualTax,
    bracket,
    schedule: scheduleName,
    worksheetAdjustment: adjustment
  };
}

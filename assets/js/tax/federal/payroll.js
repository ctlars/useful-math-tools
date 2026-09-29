import { FEDERAL_TAX_CONFIG_2026 } from './2026.js';
import { federalWithholding2026 } from './withholding.js';
import { ficaWithholding2026 } from './fica.js';

export function estimateTakeHomePay2026(input) {
  const periods = FEDERAL_TAX_CONFIG_2026.payPeriods[input.payFrequency];
  if (!periods) throw new Error('Choose a supported pay frequency.');
  const compensation = Number(input.compensation);
  const preTax = Number(input.preTax ?? 0), postTax = Number(input.postTax ?? 0);
  if (![compensation,preTax,postTax].every(Number.isFinite) || compensation < 0 || preTax < 0 || postTax < 0) throw new Error('Pay and deductions must be zero or more.');
  const grossPay = input.payMode === 'annual' ? compensation / periods : compensation;
  if (preTax > grossPay) throw new Error('Pre-tax deductions cannot exceed gross pay.');
  const federalTaxableWages = Math.max(0, grossPay - (input.reduceFederal === false ? 0 : preTax));
  const ficaTaxableWages = Math.max(0, grossPay - (input.reduceFica ? preTax : 0));
  const federal = federalWithholding2026({ ...input, federalTaxableWages });
  const fica = ficaWithholding2026({ ficaTaxableWages, ytdFicaWages: input.ytdWages ?? 0 });
  const taxes = federal.withholding + fica.socialSecurity + fica.medicare + fica.additionalMedicare;
  const takeHome = grossPay - preTax - postTax - taxes;
  return { grossPay, federalTaxableWages, ficaTaxableWages, preTax, postTax, ...fica, federal, federalIncomeTax: federal.withholding, taxes, takeHome, annualTakeHome: takeHome * periods, monthlyTakeHome: takeHome * periods / 12, periods };
}

import { FEDERAL_TAX_CONFIG_2026 } from './2026.js';

export function ficaWithholding2026({ ficaTaxableWages, ytdFicaWages = 0 }, config = FEDERAL_TAX_CONFIG_2026) {
  const wages = Number(ficaTaxableWages), ytd = Number(ytdFicaWages);
  if (![wages,ytd].every(Number.isFinite) || wages < 0 || ytd < 0) throw new Error('FICA wages and year-to-date wages must be zero or more.');
  const c = config.fica;
  const socialSecurityTaxable = Math.max(0, Math.min(wages, c.socialSecurityWageBase - ytd));
  const additionalMedicareTaxable = Math.max(0, ytd + wages - c.additionalMedicareThreshold) - Math.max(0, ytd - c.additionalMedicareThreshold);
  return {
    socialSecurityTaxable,
    socialSecurity: socialSecurityTaxable * c.socialSecurityRate,
    medicare: wages * c.medicareRate,
    additionalMedicareTaxable,
    additionalMedicare: additionalMedicareTaxable * c.additionalMedicareRate
  };
}

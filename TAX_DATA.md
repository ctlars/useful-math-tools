# 2026 Federal Payroll Tax Data

Verified September 29, 2026 against primary federal sources.

## Sources

- IRS Publication 15-T (2026), Worksheet 1A and the Annual Percentage Method tables for automated payroll systems: https://www.irs.gov/pub/irs-pdf/p15t.pdf
- IRS Publication 15 (2026), Social Security, Medicare, and Additional Medicare withholding: https://www.irs.gov/publications/p15
- 2026 Form W-4 and instructions: https://www.irs.gov/pub/irs-pdf/fw4.pdf
- Social Security Administration contribution and benefit base: https://www.ssa.gov/oact/COLA/cbb.html

## Implemented method

The estimator implements Publication 15-T Worksheet 1A for a 2020-or-later W-4. It annualizes current-period federal taxable wages, adds Step 4(a), subtracts Step 4(b), subtracts the 2026 worksheet adjustment when Step 2(c) is off, applies the matching annual Percentage Method schedule, de-annualizes the result, subtracts Step 3 credits per period, and adds Step 4(c).

The employee FICA module uses a 6.2% Social Security rate and $184,500 wage base, a 1.45% Medicare rate without a wage cap, and 0.9% Additional Medicare withholding on employer wages above $200,000. The entered year-to-date wage amount is used as prior Social Security and Medicare wages.

## Assumptions and unsupported situations

- Federal employee payroll only; no state or local taxes.
- W-4 from 2020 or later; no computational bridge for older W-4s.
- Regular wages only. Supplemental/bonus, nonresident-alien, pension, household-employment, clergy, and self-employment methods are outside scope.
- One pre-tax deduction total is entered per paycheck. The user explicitly indicates whether it reduces federal wages and/or FICA wages.
- One YTD wage amount is used for both Social Security and Medicare wage tracking; actual wage bases can differ.
- This estimates withholding, not final income-tax liability, refund, or amount due.

## Future-year update process

1. Add a new year-specific configuration such as `assets/js/tax/federal/2027.js`.
2. Enter the new Publication 15-T worksheet adjustments and all annual Percentage Method schedules.
3. Update FICA rates, wage base, and threshold from Publication 15/SSA.
4. Add independent source-derived test cases for every filing status and supported pay frequency.
5. Change the visible tax year only after the new module and tests are complete.

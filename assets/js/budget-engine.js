export const BUDGET_FREQUENCIES = Object.freeze({ weekly:52, biweekly:26, semimonthly:24, monthly:12, quarterly:4, semiannual:2, annual:1 });

export function toAnnualAmount(amount, frequency) {
  const n=Number(amount||0), factor=BUDGET_FREQUENCIES[frequency];
  if (!Number.isFinite(n) || n < 0) throw new Error('Amounts must be zero or more.');
  if (!factor) throw new Error('Choose a supported frequency.');
  return n * factor;
}
export function toMonthlyAmount(amount, frequency) { return toAnnualAmount(amount,frequency)/12; }

export function summarizeBudget(model) {
  const income=(model.income||[]).map(row=>({...row,monthly:toMonthlyAmount(row.amount,row.frequency)}));
  const expenses=(model.expenses||[]).map(row=>({...row,monthly:toMonthlyAmount(row.amount,row.frequency)}));
  const incomeMonthly=income.reduce((s,r)=>s+r.monthly,0);
  const savingsMonthly=expenses.filter(r=>r.category==='Savings & Investing').reduce((s,r)=>s+r.monthly,0);
  const livingMonthly=expenses.reduce((s,r)=>s+r.monthly,0)-savingsMonthly;
  const remainingMonthly=incomeMonthly-livingMonthly-savingsMonthly;
  const categories={}; const classifications={need:0,want:0,'savings-or-debt':0};
  expenses.forEach(row=>{categories[row.category]=(categories[row.category]||0)+row.monthly;classifications[row.classification]=(classifications[row.classification]||0)+row.monthly;});
  const shares=Object.fromEntries(Object.entries(categories).map(([k,v])=>[k,incomeMonthly?v/incomeMonthly*100:0]));
  const classificationShares=Object.fromEntries(Object.entries(classifications).map(([k,v])=>[k,incomeMonthly?v/incomeMonthly*100:0]));
  return {income,expenses,incomeMonthly,livingMonthly,savingsMonthly,remainingMonthly,categories,shares,classifications,classificationShares,annual:{income:incomeMonthly*12,living:livingMonthly*12,savings:savingsMonthly*12,remaining:remainingMonthly*12}};
}

export function isBudgetModel(value) {
  return Boolean(value && Array.isArray(value.income) && Array.isArray(value.expenses));
}

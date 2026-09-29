import test from 'node:test';
import assert from 'node:assert/strict';
import { toAnnualAmount, toMonthlyAmount, summarizeBudget, isBudgetModel } from '../assets/js/budget-engine.js';

const close=(actual,expected,tolerance=1e-6)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} ≉ ${expected}`);
for(const [frequency,annual] of Object.entries({weekly:5200,biweekly:2600,semimonthly:2400,monthly:1200,quarterly:400,semiannual:200,annual:100}))test(`$100 ${frequency} normalizes correctly`,()=>{assert.equal(toAnnualAmount(100,frequency),annual);close(toMonthlyAmount(100,frequency),annual/12);});
const model={income:[{amount:2500,frequency:'biweekly'}],expenses:[{category:'Housing',classification:'need',amount:2000,frequency:'monthly'},{category:'Lifestyle',classification:'want',amount:100,frequency:'weekly'},{category:'Savings & Investing',classification:'savings-or-debt',amount:500,frequency:'monthly'}]};
test('household totals distinguish living expenses and savings',()=>{const s=summarizeBudget(model);close(s.incomeMonthly,5416.6666667);close(s.livingMonthly,2433.3333333);close(s.savingsMonthly,500);close(s.remainingMonthly,2483.3333333);});
test('annual totals are twelve monthly equivalents',()=>{const s=summarizeBudget(model);close(s.annual.income,s.incomeMonthly*12);close(s.annual.remaining,s.remainingMonthly*12);});
test('negative budget is preserved neutrally',()=>assert.ok(summarizeBudget({income:[],expenses:[{category:'Housing',classification:'need',amount:1000,frequency:'monthly'}]}).remainingMonthly<0));
test('zero income produces finite zero shares',()=>{const s=summarizeBudget({income:[],expenses:[{category:'Food',classification:'need',amount:100,frequency:'monthly'}]});assert.equal(s.shares.Food,0);assert.ok(Number.isFinite(s.shares.Food));});
test('empty rows count as zero',()=>assert.equal(summarizeBudget({income:[{amount:'',frequency:'monthly'}],expenses:[]}).incomeMonthly,0));
test('classification shares use take-home income denominator',()=>{const s=summarizeBudget(model);close(s.classificationShares.need,2000/s.incomeMonthly*100);close(s.classificationShares.want,(100*52/12)/s.incomeMonthly*100);});
test('custom rows participate like defaults',()=>assert.equal(summarizeBudget({income:[{amount:1200,frequency:'monthly'}],expenses:[{category:'Custom',classification:'want',amount:300,frequency:'monthly'}]}).categories.Custom,300));
test('saved-budget shape validation',()=>{assert.equal(isBudgetModel(model),true);assert.equal(isBudgetModel({income:[]}),false);assert.equal(isBudgetModel(null),false);});

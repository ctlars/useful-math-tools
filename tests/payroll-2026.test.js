import test from 'node:test';
import assert from 'node:assert/strict';
import { federalWithholding2026 } from '../assets/js/tax/federal/withholding.js';
import { ficaWithholding2026 } from '../assets/js/tax/federal/fica.js';
import { estimateTakeHomePay2026 } from '../assets/js/tax/federal/payroll.js';

const close=(actual,expected,tolerance=.005)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} ≉ ${expected}`);
const base={payFrequency:'biweekly',filingStatus:'single',multipleJobs:false,credits:0,otherIncome:0,deductions:0,extraWithholding:0,exempt:false};

// Expected values are direct Worksheet 1A calculations from Pub. 15-T (2026), p. 9 and annual schedules on p. 11.
test('single biweekly Worksheet 1A value',()=>close(federalWithholding2026({...base,federalTaxableWages:75000/26}).withholding,295));
test('married monthly Worksheet 1A value',()=>close(federalWithholding2026({...base,payFrequency:'monthly',filingStatus:'married',federalTaxableWages:10000}).withholding,836.6666667));
test('head of household weekly Worksheet 1A value',()=>close(federalWithholding2026({...base,payFrequency:'weekly',filingStatus:'head',federalTaxableWages:2000}).withholding,201.3076923));
test('annual pay frequency uses one period',()=>close(federalWithholding2026({...base,payFrequency:'annual',federalTaxableWages:75000}).withholding,7670));
test('Step 2(c) uses checkbox schedule and no worksheet adjustment',()=>close(federalWithholding2026({...base,multipleJobs:true,federalTaxableWages:75000/26}).withholding,475.6538462));
test('Step 3 credit reduces withholding per pay period',()=>close(federalWithholding2026({...base,federalTaxableWages:75000/26,credits:2600}).withholding,195));
test('Step 4(a) other income increases adjusted annual wages',()=>close(federalWithholding2026({...base,federalTaxableWages:75000/26,otherIncome:10000}).withholding,379.6153846));
test('Step 4(b) deductions reduce adjusted annual wages',()=>close(federalWithholding2026({...base,federalTaxableWages:75000/26,deductions:10000}).withholding,216.1538462));
test('Step 4(c) adds exact paycheck amount',()=>close(federalWithholding2026({...base,federalTaxableWages:75000/26,extraWithholding:50}).withholding,345));
test('zero income has zero federal withholding',()=>assert.equal(federalWithholding2026({...base,federalTaxableWages:0}).withholding,0));
test('exempt W-4 has no federal withholding',()=>assert.equal(federalWithholding2026({...base,federalTaxableWages:5000,exempt:true,extraWithholding:100}).withholding,0));
test('high income uses top 37 percent schedule',()=>close(federalWithholding2026({...base,payFrequency:'annual',federalTaxableWages:1000000}).withholding,320000.25));
test('Social Security stops at 2026 wage base crossing',()=>{const r=ficaWithholding2026({ficaTaxableWages:10000,ytdFicaWages:180000});close(r.socialSecurity,279);});
test('Social Security is zero after wage base',()=>assert.equal(ficaWithholding2026({ficaTaxableWages:10000,ytdFicaWages:184500}).socialSecurity,0));
test('Additional Medicare applies only to threshold crossing',()=>{const r=ficaWithholding2026({ficaTaxableWages:10000,ytdFicaWages:195000});close(r.additionalMedicare,45);close(r.medicare,145);});
test('pre-tax deduction can reduce federal wages without reducing FICA wages',()=>{const r=estimateTakeHomePay2026({payMode:'annual',compensation:75000,payFrequency:'biweekly',filingStatus:'single',multipleJobs:false,credits:0,otherIncome:0,deductions:0,extraWithholding:0,preTax:150,reduceFederal:true,reduceFica:false,postTax:50,ytdWages:0,exempt:false});close(r.federalIncomeTax,262);close(r.socialSecurity,178.8461538);close(r.takeHome,2201.9423077);});
test('FICA-exempt deduction reduces payroll-tax wages',()=>{const r=estimateTakeHomePay2026({payMode:'paycheck',compensation:3000,payFrequency:'biweekly',filingStatus:'single',preTax:200,reduceFederal:true,reduceFica:true,postTax:0,ytdWages:0});close(r.socialSecurity,173.6);close(r.medicare,40.6);});
test('post-tax deduction changes net pay but not taxes',()=>{const a=estimateTakeHomePay2026({payMode:'paycheck',compensation:3000,payFrequency:'biweekly',filingStatus:'single',postTax:0}),b=estimateTakeHomePay2026({payMode:'paycheck',compensation:3000,payFrequency:'biweekly',filingStatus:'single',postTax:100});close(a.taxes,b.taxes);close(a.takeHome-b.takeHome,100);});

import { estimateTakeHomePay2026 } from './tax/federal/payroll.js';
import { formatCurrency, formatPercent } from './formatting.js';
import { CALCULATOR_BY_ID } from './registry.js';
import { addHistory, getFavorites, recordRecentTool, toggleFavorite } from './storage.js';
import { decodeState, encodeState, restoreFormState, stateFromForm } from './url-state.js';

const id='take-home-pay-estimator', calculator=CALCULATOR_BY_ID[id];
const root=document.querySelector('[data-take-home]'), form=root.querySelector('form');
const result=root.querySelector('[data-result]'), details=root.querySelector('[data-result-details]'), error=root.querySelector('[data-error]');
const feedback=root.querySelector('[data-action-feedback]'), copyResult=root.querySelector('[data-copy-result]'), copyLink=root.querySelector('[data-copy-link]');
let last=null;
const field=name=>form.elements.namedItem(name);
const value=name=>field(name)?.value||'';
const money=name=>{const n=Number(value(name)||0);if(!Number.isFinite(n)||n<0)throw new Error('Enter dollar amounts of zero or more.');return n;};
const on=name=>Boolean(field(name)?.checked);
const input=()=>({payMode:value('payMode'),compensation:money('compensation'),payFrequency:value('payFrequency'),filingStatus:value('filingStatus'),multipleJobs:on('multipleJobs'),credits:money('credits'),otherIncome:money('otherIncome'),deductions:money('deductions'),extraWithholding:money('extraWithholding'),preTax:money('preTax'),reduceFederal:on('reduceFederal'),reduceFica:on('reduceFica'),postTax:money('postTax'),ytdWages:money('ytdWages'),exempt:on('exempt')});
const list=items=>`<dl class="result-list">${items.map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>`;

function invalidate(){last=null;copyResult.disabled=true;copyLink.disabled=true;}
function calculate(){
  const data=input(), r=estimateTakeHomePay2026(data), payrollRate=r.grossPay?r.taxes/r.grossPay*100:0, allRate=r.grossPay?(r.grossPay-r.takeHome)/r.grossPay*100:0;
  result.textContent=`${formatCurrency(r.takeHome)} per paycheck`;
  const rows=[['Gross pay',formatCurrency(r.grossPay)],['Pre-tax deductions',`−${formatCurrency(r.preTax)}`],['Federal income tax',`−${formatCurrency(r.federalIncomeTax)}`],['Social Security',`−${formatCurrency(r.socialSecurity)}`],['Medicare',`−${formatCurrency(r.medicare)}`]];
  if(r.additionalMedicare>0)rows.push(['Additional Medicare',`−${formatCurrency(r.additionalMedicare)}`]);
  rows.push(['Post-tax deductions',`−${formatCurrency(r.postTax)}`],['Estimated take-home',formatCurrency(r.takeHome)],['Estimated monthly take-home',formatCurrency(r.monthlyTakeHome)],['Estimated annual take-home',formatCurrency(r.annualTakeHome)],['Federal withholding rate',formatPercent(r.grossPay?r.federalIncomeTax/r.grossPay*100:0,2)],['Payroll-tax rate',formatPercent(payrollRate-r.federalIncomeTax/(r.grossPay||1)*100,2)],['Total deductions from gross',formatPercent(allRate,2)]);
  details.innerHTML=list(rows)+`<p class="result-note">State and local taxes are not included. This is an estimate based on 2026 federal withholding rules.</p><details class="math-details"><summary>How this was calculated</summary><p>Gross pay for this period: ${formatCurrency(r.grossPay)}. Federal taxable wages after applicable entered deductions: ${formatCurrency(r.federalTaxableWages)}.</p><p>The IRS Worksheet 1A annualized those wages to ${formatCurrency(r.federal.annualizedWages)}, applied W-4 adjustments, and produced adjusted annual wages of ${formatCurrency(r.federal.adjustedAnnualWages)} using the ${r.federal.schedule==='step2'?'Step 2(c)':'standard'} schedule. Annual tax was converted back to this pay period, Step 3 credits were subtracted, and Step 4(c) withholding was added.</p><p>FICA wages were ${formatCurrency(r.ficaTaxableWages)}. Social Security applies only up to the 2026 wage base; Medicare applies without a wage cap; Additional Medicare uses employer wages above $200,000.</p></details>`;
  root.classList.add('has-result');error.textContent='';recordRecentTool(id);
  const state=stateFromForm(form,calculator.shareFields), query=encodeState(calculator.shareFields,state), url=`${location.origin}${calculator.url}?${query}`;
  const summary=`${formatCurrency(data.compensation)}${data.payMode==='annual'?'/year':' gross'} → estimated ${formatCurrency(r.takeHome)} take-home/paycheck`;
  const copyText=`Take-Home Pay Estimate\n${summary}\nMonthly estimate: ${formatCurrency(r.monthlyTakeHome)}\nFederal income tax: ${formatCurrency(r.federalIncomeTax)}\nSocial Security: ${formatCurrency(r.socialSecurity)}\nMedicare: ${formatCurrency(r.medicare)}\nState and local taxes are not included.\nUsefulMathTools.com`;
  last={url,copyText};copyResult.disabled=false;copyLink.disabled=false;addHistory({calculatorId:id,timestamp:new Date().toISOString(),summary,url,copyText});
}
function updateMode(){document.getElementById('compensationLabel').textContent=value('payMode')==='annual'?'Annual salary':'Gross pay this paycheck';}
field('payMode').addEventListener('change',updateMode);form.addEventListener('input',invalidate);
form.addEventListener('submit',e=>{e.preventDefault();try{calculate();}catch(err){result.textContent='—';details.textContent='';error.textContent=err.message;invalidate();}});
form.addEventListener('reset',()=>setTimeout(()=>{updateMode();result.textContent='—';details.innerHTML='<p class="result-note">Enter your pay and W-4 information, then select Calculate.</p>';error.textContent='';invalidate();},0));
root.querySelector('[data-example]').addEventListener('click',()=>{restoreFormState(form,{payMode:'annual',compensation:'75000',payFrequency:'biweekly',filingStatus:'single',multipleJobs:false,credits:'0',otherIncome:'0',deductions:'0',extraWithholding:'0',preTax:'150',reduceFederal:true,reduceFica:false,postTax:'50',ytdWages:'0',exempt:false});updateMode();form.requestSubmit();});
async function copy(text,message){try{await navigator.clipboard.writeText(text);feedback.textContent=message;}catch{feedback.textContent='Copy unavailable. Select the result text instead.';}setTimeout(()=>feedback.textContent='',1800);}
copyResult.addEventListener('click',()=>last&&copy(last.copyText,'Result copied'));copyLink.addEventListener('click',()=>last&&copy(last.url,'Link copied'));
const favorite=document.querySelector('[data-favorite]');function renderFavorite(){const saved=getFavorites().includes(id);favorite.ariaPressed=String(saved);favorite.textContent=saved?'★ Saved':'☆ Save calculator';}favorite.addEventListener('click',()=>{toggleFavorite(id);renderFavorite();});renderFavorite();
updateMode();if(restoreFormState(form,decodeState(location.search,calculator.shareFields))){updateMode();form.requestSubmit();}

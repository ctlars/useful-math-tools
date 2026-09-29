import {
  parseDate, formatDate, addCalendarDays, addMonths, addYears, daysBetween, daysBetweenOptions, calendarInterval,
  countRuleDays, addRuleDays, percentageOf, percentRatio, wholeFromPart, percentageChange, percentageDifference,
  averageStats, simplifyFraction, decimalToFraction, solveProportion, loanPayment, compoundInterest,
  LENGTH_METERS, WEIGHT_KG, AREA_SQ_METERS, VOLUME_LITERS, SPEED_MPS,
  convertUnit, convertTemperature, paintEstimate, salesTax, markupMargin, gcd
} from './engines.js';
import { formatNumber, formatCurrency, formatPercent } from './formatting.js';
import { holidayRules, calendarOptionsHtml } from './holidays.js';
import { CALCULATOR_BY_ID } from './registry.js';
import { getFavorites, toggleFavorite, recordRecentTool, addHistory } from './storage.js';
import { decodeState, encodeState, restoreFormState, stateFromForm } from './url-state.js';

const root = document.querySelector('[data-calculator]');
if (!root) throw new Error('Calculator container not found.');
const type = root.dataset.calculator;
const calculatorId = root.dataset.calculatorId;
const calculator = CALCULATOR_BY_ID[calculatorId];
const form = root.querySelector('form');
const result = root.querySelector('[data-result]');
const error = root.querySelector('[data-error]');
const details = root.querySelector('[data-result-details]');
const feedback = root.querySelector('[data-action-feedback]');
const copyResultButton = root.querySelector('[data-copy-result]');
const copyLinkButton = root.querySelector('[data-copy-link]');
const shareButton = root.querySelector('[data-share-result]');
let lastCalculation = null;

function control(name) { return form.elements.namedItem(name); }
function value(name) { return control(name)?.value ?? ''; }
function number(name, message = `Enter a valid value for ${name}.`) { const n = Number(value(name)); if (value(name) === '' || !Number.isFinite(n)) throw new Error(message); return n; }
function checked(name) { return Boolean(control(name)?.checked); }
function show(primary, supporting = '', math = '') { error.textContent = ''; result.textContent = primary; details.innerHTML = supporting+(math?`<details class="math-details"><summary>Show the math</summary><div>${math}</div></details>`:''); root.classList.add('has-result'); }
function fail(message) { result.textContent = '—'; details.textContent = ''; error.textContent = message; root.classList.remove('has-result'); invalidateActions(); }
function list(items) { return `<dl class="result-list">${items.map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>`; }
function parseDateList(text) { return (text || '').split(/[\s,]+/).filter(Boolean).map(s => parseDate(s).toISOString().slice(0,10)); }
function selectedText(name) { return control(name)?.selectedOptions?.[0]?.text || value(name); }
function shareUrl() { const query=encodeState(calculator.shareFields,stateFromForm(form,calculator.shareFields)); return `${location.origin}${calculator.url}${query?`?${query}`:''}`; }
function makeSummary() {
  if(type==='percentage-change') return `${value('start')} → ${value('end')} = ${result.textContent}`;
  if(type==='loan') { const months=Math.round(number('term')*(value('termUnit')==='years'?12:1)); return `${formatCurrency(number('principal'))} at ${value('rate')}% for ${months} months = ${result.textContent}/month`; }
  if(type==='days-between') return `${value('start')} → ${value('end')} = ${result.textContent}`;
  if(type==='sales-tax') return `${formatCurrency(number('amount'))} at ${value('rate')}% = ${result.textContent}`;
  if(type==='markup-margin') return `${formatCurrency(number('cost'))} cost = ${result.textContent}`;
  return `${calculator.shortTitle}: ${result.textContent}`;
}
function invalidateActions(){lastCalculation=null;copyResultButton.disabled=true;copyLinkButton.disabled=true;if(shareButton)shareButton.hidden=true;}
function completeCalculation(){
  const summary=makeSummary(), url=calculator.shareFields.length?shareUrl():calculator.url;
  const support=[...details.querySelectorAll('.result-list > div')].map(row=>`${row.querySelector('dt')?.textContent}: ${row.querySelector('dd')?.textContent}`).join('\n');
  const copyText=`${calculator.title}\n${summary}${support?`\n${support}`:''}\nUsefulMathTools.com`;
  lastCalculation={summary,url,copyText}; copyResultButton.disabled=false; copyLinkButton.disabled=!calculator.shareFields.length;
  if(shareButton&&navigator.share) shareButton.hidden=false;
  recordRecentTool(calculatorId); addHistory({calculatorId,timestamp:new Date().toISOString(),summary,url,copyText});
}
function mergedRules(id, start, end, customOff = [], customOn = []) {
  const low = Math.min(start.getUTCFullYear(), end.getUTCFullYear());
  const high = Math.max(start.getUTCFullYear(), end.getUTCFullYear());
  const holidays = new Set(customOff), working = new Set(customOn), names = Object.fromEntries(customOff.map(x=>[x,'Custom non-working date']));
  const notes = [];
  for (let y=low; y<=high; y++) {
    const rules = holidayRules(id, y);
    if (!rules.supported) throw new Error(`${rules.label}: ${rules.note}`);
    rules.holidays.forEach(x=>holidays.add(x)); rules.working.forEach(x=>working.add(x)); Object.assign(names,rules.names); if (!notes.includes(rules.note)) notes.push(rules.note);
  }
  customOn.forEach(x=>working.add(x));
  return { holidays, working, names, note: notes.join(' ') };
}

function setToday(button) { button?.addEventListener('click', () => { form.elements.start.value = new Date().toLocaleDateString('en-CA'); }); }
setToday(root.querySelector('[data-today]'));

const handlers = {
  'days-between': () => {
    const start=parseDate(value('start')), end=parseDate(value('end'));
    const total=daysBetweenOptions(start,end,checked('includeStart'),checked('includeEnd'));
    let weekdays=0, weekends=0;
    const direction=start<=end?1:-1; let cursor=new Date(start); let remaining=total;
    if (!checked('includeStart')) cursor=addCalendarDays(cursor,direction);
    while (remaining-- > 0) { [0,6].includes(cursor.getUTCDay()) ? weekends++ : weekdays++; cursor=addCalendarDays(cursor,direction); }
    const interval=calendarInterval(start,end); const parts=[interval.years&&`${interval.years} year${interval.years===1?'':'s'}`,interval.months&&`${interval.months} month${interval.months===1?'':'s'}`,interval.days&&`${interval.days} day${interval.days===1?'':'s'}`].filter(Boolean).join(', ')||'Same date';
    show(`${formatNumber(total,0)} day${total===1?'':'s'}`,list([['Calendar interval',parts],['Complete weeks',formatNumber(Math.floor(total/7),0)],['Weekdays',formatNumber(weekdays,0)],['Weekend days',formatNumber(weekends,0)]]));
  },
  'add-date': () => {
    const start=parseDate(value('start')), amount=Math.abs(number('amount'))*(value('direction')==='before'?-1:1), unit=value('unit');
    const answer=unit==='days'?addCalendarDays(start,amount):unit==='weeks'?addCalendarDays(start,amount*7):unit==='months'?addMonths(start,amount):addYears(start,amount);
    show(formatDate(answer),list([['Starting date',formatDate(start)],['Operation',`${Math.abs(amount)} ${unit} ${amount<0?'before':'after'}`],['End-of-month rule','If the target month is shorter, its last day is used.']]));
  },
  'business-days': () => {
    const start=parseDate(value('start')), end=parseDate(value('end'));
    const rules=mergedRules(value('calendar'),start,end,parseDateList(value('customOff')),parseDateList(value('customOn')));
    const r=countRuleDays(start,end,rules,checked('includeStart'),checked('includeEnd'));
    const skipped=r.skipped.slice(0,40).map(x=>`<li>${x.date}: ${x.reason}</li>`).join('');
    show(`${formatNumber(r.count,0)} business day${r.count===1?'':'s'}`,list([['Calendar days',formatNumber(Math.abs(daysBetween(start,end))+1,0)],['Weekend days excluded',formatNumber(r.weekend,0)],['Holiday/custom days excluded',formatNumber(r.holiday,0)]])+`<p class="result-note">${rules.note}</p><details><summary>Skipped dates</summary><ul class="compact-list">${skipped||'<li>None</li>'}</ul></details>`);
  },
  'deadline': () => {
    const start=parseDate(value('start')), amount=Math.abs(number('amount'))*(value('direction')==='before'?-1:1), unit=value('unit'); let answer;
    if(unit==='business') { const calendarSpan=Math.ceil(Math.abs(amount)*7/5)+370; const span=addCalendarDays(start,Math.sign(amount||1)*calendarSpan); answer=addRuleDays(start,amount,mergedRules(value('calendar'),start,span),checked('countStart')); }
    else if(unit==='calendar') { const adjusted=checked('countStart')&&amount!==0?amount-Math.sign(amount):amount; answer=addCalendarDays(start,adjusted); }
    else answer=unit==='weeks'?addCalendarDays(start,amount*7):addMonths(start,amount);
    show(formatDate(answer),list([['Starting date',formatDate(start)],['Start counts for day-based units',checked('countStart')?'Yes':'No'],['Direction',amount<0?'Before':'After']]));
  },
  'percentage': () => {
    const mode=value('mode'), x=number('x'), y=number('y'); let answer, formula;
    if(mode==='of'){answer=percentageOf(x,y);formula=`${x}% × ${y} = ${formatNumber(answer,8)}`;}
    else if(mode==='ratio'){answer=percentRatio(x,y);if(answer===null)throw new Error('The comparison value cannot be zero.');formula=`${x} ÷ ${y} × 100 = ${formatNumber(answer,8)}%`;}
    else {answer=wholeFromPart(x,y);if(answer===null)throw new Error('The percentage cannot be zero.');formula=`${x} ÷ ${y/100} = ${formatNumber(answer,8)}`;}
    show(mode==='ratio'?formatPercent(answer):formatNumber(answer),list([['Calculation',formula]]),`<p>${formula}</p>`);
  },
  'percentage-change': () => { const a=number('start'),b=number('end'),c=percentageChange(a,b);if(c===null)throw new Error('Percentage change is undefined when the starting value is zero.');show(`${formatPercent(Math.abs(c))} ${c>0?'increase':c<0?'decrease':'change'}`,list([['Absolute change',formatNumber(b-a)],['Formula',`(${b} − ${a}) ÷ |${a}| × 100`]]),`<p>Difference: ${b} − ${a} = ${formatNumber(b-a,8)}</p><p>Percentage change: ${formatNumber(b-a,8)} ÷ |${a}| × 100 = ${formatPercent(c,8)}</p>`); },
  'percentage-difference': () => { const a=number('a'),b=number('b'),p=percentageDifference(a,b);show(formatPercent(p),list([['Absolute difference',formatNumber(Math.abs(a-b))],['Average magnitude',formatNumber((Math.abs(a)+Math.abs(b))/2)],['Formula','|A − B| ÷ ((|A| + |B|) ÷ 2) × 100']])); },
  'discount': () => { const original=number('original'),discount=number('discount'),tax=value('tax')===''?0:number('tax');if(original<0||discount<0||tax<0)throw new Error('Enter non-negative values.');const saved=original*discount/100,after=original-saved,taxAmount=after*tax/100;show(formatCurrency(after+taxAmount),list([['Discount amount',formatCurrency(saved)],['Price after discount',formatCurrency(after)],['Tax amount',formatCurrency(taxAmount)],['Amount saved before tax',formatCurrency(saved)]]),`<p>${formatCurrency(original)} × ${discount}% = ${formatCurrency(saved)} discount</p><p>${formatCurrency(original)} − ${formatCurrency(saved)} = ${formatCurrency(after)} before tax</p>`); },
  'tip': () => { const bill=number('bill'),tip=number('tip'),people=number('people');if(bill<0||tip<0||people<1)throw new Error('Enter a non-negative bill and tip, and at least one person.');const t=bill*tip/100,total=bill+t;show(formatCurrency(total/people),list([['Total per person',formatCurrency(total/people)],['Tip per person',formatCurrency(t/people)],['Tip amount',formatCurrency(t)],['Total bill',formatCurrency(total)]])); },
  'average': () => { const tokens=value('numbers').trim().split(/[\s,]+/).filter(Boolean),invalid=tokens.filter(t=>!Number.isFinite(Number(t)));if(invalid.length)throw new Error(`Invalid entr${invalid.length===1?'y':'ies'}: ${invalid.join(', ')}`);const s=averageStats(tokens.map(Number));show(formatNumber(s.mean,8),list([['Mean',formatNumber(s.mean,8)],['Median',formatNumber(s.median,8)],['Minimum',formatNumber(s.min,8)],['Maximum',formatNumber(s.max,8)],['Range',formatNumber(s.range,8)],['Count',s.count],['Sum',formatNumber(s.sum,8)]])); },
  'fraction': () => { const mode=value('mode');let decimal,fraction;if(mode==='fraction'){const raw=value('input').split('/');if(raw.length!==2)throw new Error('Enter a fraction such as 3/4.');fraction=simplifyFraction(Number(raw[0]),Number(raw[1]));decimal=fraction.numerator/fraction.denominator;}else{decimal=number('input')/(mode==='percent'?100:1);fraction=decimalToFraction(decimal);}show(`${fraction.numerator}/${fraction.denominator}`,list([['Decimal',formatNumber(decimal,8)],['Percentage',formatPercent(decimal*100,8)],['Simplest fraction',`${fraction.numerator}/${fraction.denominator}`]]),`<p>${fraction.numerator} ÷ ${fraction.denominator} = ${formatNumber(decimal,8)}</p><p>${formatNumber(decimal,8)} × 100 = ${formatPercent(decimal*100,8)}</p>`); },
  'ratio': () => { if(value('mode')==='simplify'){const a=number('a'),b=number('b');if(!Number.isInteger(a)||!Number.isInteger(b)||a===0||b===0)throw new Error('Enter two non-zero whole numbers.');const g=gcd(a,b);show(`${a/g}:${b/g}`,list([['Common divisor',g]]));}else{const vals=['a','b','c','d'].map(n=>value(n)===''?null:Number(value(n)));const s=solveProportion(vals);show(`x = ${formatNumber(s.value,8)}`,list([['Unknown position',['first numerator','first denominator','second numerator','second denominator'][s.index]]]));} },
  'loan': () => { const principal=number('principal'),rate=number('rate'),term=number('term'),months=Math.round(term*(value('termUnit')==='years'?12:1));const r=loanPayment(principal,rate,months);const monthly=rate/100/12;show(formatCurrency(r.payment),list([['Monthly payment',formatCurrency(r.payment)],['Number of payments',r.payments],['Total interest',formatCurrency(r.interest)],['Total amount paid',formatCurrency(r.total)]]),`<p>Principal: ${formatCurrency(principal)}</p><p>Monthly rate: ${formatNumber(monthly*100,6)}%</p><p>Payments: ${months}</p><p>P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1) = ${formatCurrency(r.payment)}</p>`); },
  'compound': () => { const frequency=Number(value('frequency')),contribution=value('contribution')===''?0:number('contribution'),contributionFrequency=Number(value('contributionFrequency'));const r=compoundInterest({principal:number('principal'),annualRate:number('rate'),years:number('years'),compoundsPerYear:frequency,contribution,contributionsPerYear:contributionFrequency});show(formatCurrency(r.balance),list([['Ending balance',formatCurrency(r.balance)],['Total contributions',formatCurrency(r.totalContributions)],['Interest earned',formatCurrency(r.interest)],['Contribution timing','End of each contribution period']])); },
  'length': () => { const v=number('amount'),a=convertUnit(v,value('from'),value('to'),LENGTH_METERS);show(formatNumber(a,10),list([['Conversion',`${formatNumber(v,10)} ${form.elements.from.selectedOptions[0].text} = ${formatNumber(a,10)} ${form.elements.to.selectedOptions[0].text}`]])); },
  'weight': () => { const v=number('amount'),a=convertUnit(v,value('from'),value('to'),WEIGHT_KG);show(formatNumber(a,10),list([['Conversion',`${formatNumber(v,10)} ${form.elements.from.selectedOptions[0].text} = ${formatNumber(a,10)} ${form.elements.to.selectedOptions[0].text}`]])); },
  'temperature': () => { const v=number('amount'),a=convertTemperature(v,value('from'),value('to'));show(`${formatNumber(a,6)} °${value('to')}`,list([['Input',`${formatNumber(v,6)} °${value('from')}`],['Absolute zero check','Passed']])); },
  'paint': () => { const metric=value('system')==='metric',linear=metric?3.280839895:1,area=linear*linear;const r=paintEstimate({length:number('length')*linear,width:number('width')*linear,height:number('height')*linear,doors:number('doors'),windows:number('windows'),coats:number('coats'),doorArea:number('doorArea')*area,windowArea:number('windowArea')*area,coverage:number('coverage')*(metric?10.7639104:1)});const unit=metric?'liters':'gallons',required=metric?r.required*3.785411784:r.required,purchase=Math.ceil(required);show(`${formatNumber(required,2)} ${unit}`,list([['Paintable wall area',`${formatNumber(metric?r.paintableArea/area:r.paintableArea,2)} ${metric?'m²':'ft²'}`],['Paint required',`${formatNumber(required,2)} ${unit}`],['Suggested amount to purchase',`${purchase} ${unit}`],['Estimate includes',`${number('coats')} coat${number('coats')===1?'':'s'}`]])); },
  'area': () => { const v=number('amount'),a=convertUnit(v,value('from'),value('to'),AREA_SQ_METERS);show(formatNumber(a,10),list([['Conversion',`${formatNumber(v,10)} ${selectedText('from')} = ${formatNumber(a,10)} ${selectedText('to')}`]]),`<p>${formatNumber(v,10)} × conversion factor = ${formatNumber(a,10)}</p>`); },
  'volume': () => { const v=number('amount'),a=convertUnit(v,value('from'),value('to'),VOLUME_LITERS);show(formatNumber(a,10),list([['Conversion',`${formatNumber(v,10)} ${selectedText('from')} = ${formatNumber(a,10)} ${selectedText('to')}`],['Customary system','US units']])); },
  'speed': () => { const v=number('amount'),a=convertUnit(v,value('from'),value('to'),SPEED_MPS);show(formatNumber(a,10),list([['Conversion',`${formatNumber(v,10)} ${selectedText('from')} = ${formatNumber(a,10)} ${selectedText('to')}`]])); },
  'sales-tax': () => { const amount=number('amount'),rate=number('rate'),r=salesTax(amount,rate,value('mode'));show(value('mode')==='add'?formatCurrency(r.total):formatCurrency(r.subtotal),list([['Pre-tax price',formatCurrency(r.subtotal)],['Sales tax',formatCurrency(r.tax)],['Final price',formatCurrency(r.total)]]),value('mode')==='add'?`<p>${formatCurrency(amount)} × ${rate/100} = ${formatCurrency(r.tax)} tax</p><p>${formatCurrency(amount)} + ${formatCurrency(r.tax)} = ${formatCurrency(r.total)}</p>`:`<p>${formatCurrency(amount)} ÷ ${1+rate/100} = ${formatCurrency(r.subtotal)} before tax</p>`); },
  'markup-margin': () => { const mode=value('mode'),cost=number('cost'),r=markupMargin(mode==='price'?{cost,markup:number('markup')}:{cost,sellingPrice:number('sellingPrice')});show(formatCurrency(r.sellingPrice),list([['Selling price',formatCurrency(r.sellingPrice)],['Profit',formatCurrency(r.profit)],['Markup',formatPercent(r.markup)],['Margin',formatPercent(r.margin)]]),`<p>Profit: ${formatCurrency(r.sellingPrice)} − ${formatCurrency(cost)} = ${formatCurrency(r.profit)}</p><p>Markup: ${formatCurrency(r.profit)} ÷ ${formatCurrency(cost)} = ${formatPercent(r.markup)}</p><p>Margin: ${formatCurrency(r.profit)} ÷ ${formatCurrency(r.sellingPrice)} = ${formatPercent(r.margin)}</p>`); }
};

if (form.elements.calendar) form.elements.calendar.innerHTML = calendarOptionsHtml();
root.querySelectorAll('[data-tip]').forEach(button=>button.addEventListener('click',()=>{form.elements.tip.value=button.dataset.tip;handlers.tip();}));
if (type === 'ratio') control('mode').addEventListener('change', () => {
  const solving = value('mode') === 'solve';
  control('a').value = solving ? '3' : '20'; control('b').value = solving ? '5' : '30';
  control('c').value = ''; control('d').value = solving ? '20' : '';
});
if (type === 'markup-margin') control('mode').addEventListener('change', () => {
  const comparing=value('mode')==='compare'; root.querySelector('[data-markup-field]').hidden=comparing; root.querySelector('[data-price-field]').hidden=!comparing;
});

const exampleValues={
  'days-between':{start:'2026-01-01',end:'2026-03-31',includeStart:false,includeEnd:true},
  percentage:{mode:'of',x:'20',y:'150'}, compound:{principal:'10000',rate:'5',years:'10',frequency:'12',contribution:'0',contributionFrequency:'12'},
  paint:{system:'imperial',length:'12',width:'15',height:'8',doors:'1',windows:'2',coats:'2',doorArea:'20',windowArea:'15',coverage:'350'},
  'sales-tax':{mode:'add',amount:'100',rate:'8.25'}, 'markup-margin':{mode:'compare',cost:'80',sellingPrice:'100'}
};
root.querySelector('[data-example]')?.addEventListener('click',()=>{restoreFormState(form,exampleValues[type]);control('mode')?.dispatchEvent(new Event('change'));form.requestSubmit();result.focus?.();});

const favoriteButton=document.querySelector('[data-favorite]');
function renderFavorite(){const saved=getFavorites().includes(calculatorId);favoriteButton.setAttribute('aria-pressed',String(saved));favoriteButton.textContent=saved?'★ Saved':'☆ Save calculator';}
favoriteButton.addEventListener('click',()=>{toggleFavorite(calculatorId);renderFavorite();}); renderFavorite();

form.addEventListener('input', invalidateActions);
form.addEventListener('submit', event => { event.preventDefault(); try { handlers[type](); completeCalculation(); } catch (e) { fail(e.message || 'Check your entries and try again.'); } });
form.addEventListener('reset', () => setTimeout(()=>{result.textContent='—';details.innerHTML='<p class="result-note">Enter your values, then select Calculate.</p>';error.textContent='';root.classList.remove('has-result');invalidateActions();},0));
if (['length','weight','temperature','area','volume','speed'].includes(type)) form.addEventListener('input',()=>{try{handlers[type]();}catch{}});

async function copyText(text,success){try{await navigator.clipboard.writeText(text);feedback.textContent=success;}catch{feedback.textContent='Copy unavailable. Select the result text instead.';}setTimeout(()=>{feedback.textContent='';},1800);}
copyResultButton.addEventListener('click',()=>{if(lastCalculation)copyText(lastCalculation.copyText,'Result copied');});
copyLinkButton.addEventListener('click',()=>{if(lastCalculation)copyText(lastCalculation.url,'Link copied');});
shareButton?.addEventListener('click',async()=>{if(!lastCalculation||!navigator.share)return;try{await navigator.share({title:calculator.title,text:lastCalculation.summary,url:lastCalculation.url});}catch{}});

if (form.elements.calendar) form.elements.calendar.innerHTML = calendarOptionsHtml();
const restored=restoreFormState(form,decodeState(location.search,calculator.shareFields));
if(restored){control('mode')?.dispatchEvent(new Event('change'));form.requestSubmit();}

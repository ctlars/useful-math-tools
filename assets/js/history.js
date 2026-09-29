import { CALCULATOR_BY_ID } from './registry.js';
import { getHistory, clearHistory, getSettings, setHistoryEnabled } from './storage.js';

const list=document.querySelector('[data-history-list]'), empty=document.querySelector('[data-history-empty]');
const setting=document.querySelector('[data-history-setting]');

function render(){
  const entries=getHistory();
  list.innerHTML=''; empty.hidden=entries.length>0;
  for(const entry of entries){
    const tool=CALCULATOR_BY_ID[entry.calculatorId]; if(!tool) continue;
    const article=document.createElement('article'); article.className='history-item';
    const heading=document.createElement('h2'); heading.textContent=tool.shortTitle;
    const summary=document.createElement('p'); summary.textContent=entry.summary;
    const time=document.createElement('time'); time.dateTime=entry.timestamp; time.textContent=new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(entry.timestamp));
    const actions=document.createElement('div'); actions.className='history-actions';
    const reopen=document.createElement('a'); reopen.className='button secondary'; reopen.href=entry.url||tool.url; reopen.textContent='Reopen calculation';
    const copy=document.createElement('button'); copy.className='button secondary'; copy.type='button'; copy.textContent='Copy result'; copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(entry.copyText||entry.summary);copy.textContent='Copied';}catch{copy.textContent='Select the summary to copy';}});
    actions.append(reopen,copy); article.append(heading,summary,time,actions); list.append(article);
  }
}

setting.checked=getSettings().saveHistory;
setting.addEventListener('change',()=>setHistoryEnabled(setting.checked));
document.querySelector('[data-clear-history]')?.addEventListener('click',()=>{if(window.confirm('Clear calculation history saved in this browser?')){clearHistory();render();}});
render();

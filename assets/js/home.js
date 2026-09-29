import { CALCULATOR_BY_ID } from './registry.js';
import { getFavorites, getRecentTools, clearRecentTools } from './storage.js';

function toolLink(id) {
  const tool=CALCULATOR_BY_ID[id];
  return tool ? `<a class="compact-tool" href="${tool.url}"><strong>${tool.shortTitle}</strong><span>${tool.category}</span></a>` : '';
}

function renderSection(sectionSelector, listSelector, ids) {
  const section=document.querySelector(sectionSelector), list=document.querySelector(listSelector);
  const valid=ids.filter(id=>CALCULATOR_BY_ID[id]);
  if(!section||!list||!valid.length) return;
  list.innerHTML=valid.map(toolLink).join(''); section.hidden=false;
}

renderSection('[data-saved-section]','[data-saved-tools]',getFavorites().slice(0,8));
renderSection('[data-recent-section]','[data-recent-tools]',getRecentTools().slice(0,8));
document.querySelector('[data-clear-recent]')?.addEventListener('click',()=>{clearRecentTools();document.querySelector('[data-recent-section]').hidden=true;});


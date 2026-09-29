import { SITE_CONFIG } from './config.js';
import { CALCULATOR_BY_ID, searchCalculators } from './registry.js';
import { clearAllSiteData } from './storage.js';

document.documentElement.classList.add('js');
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
document.querySelectorAll('[data-site-name]').forEach(el => { el.textContent = SITE_CONFIG.name; });

const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
if (menuButton && nav) menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.toggleAttribute('data-open', !open);
});

const search = document.querySelector('[data-tool-search]');
if (search) {
  const items = [...document.querySelectorAll('[data-calculator-id]')];
  const empty = document.querySelector('[data-search-empty]');
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    let shown = 0;
    items.forEach(item => {
      const matches = query ? searchCalculators(query).some(calc=>calc.id===item.dataset.calculatorId) : item.dataset.featured === 'true';
      item.hidden = !matches;
      if (matches) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  });
}

document.addEventListener('click', async event => {
  const button = event.target.closest('[data-copy]');
  if (!button) return;
  const target = document.querySelector(button.dataset.copy);
  if (!target) return;
  try {
    await navigator.clipboard.writeText(target.textContent.trim());
    const original = button.textContent;
    button.textContent = 'Copied';
    setTimeout(() => { button.textContent = original; }, 1400);
  } catch { button.textContent = 'Select the result to copy'; }
});

document.querySelector('[data-clear-site-data]')?.addEventListener('click', () => {
  if (!window.confirm('Clear favorites, recent tools, calculation history, and local preferences saved by Useful Math Tools in this browser?')) return;
  clearAllSiteData();
  const feedback=document.querySelector('[data-clear-feedback]');
  if(feedback) feedback.textContent='Saved calculator data cleared.';
});

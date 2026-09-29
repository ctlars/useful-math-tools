const KEYS = { favorites:'umt:favorites', recent:'umt:recentTools', history:'umt:calculationHistory', settings:'umt:settings', householdBudget:'umt:householdBudget' };

function read(key, fallback) { try { const value=JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } }
function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }

export function getFavorites() { const v=read(KEYS.favorites,[]); return Array.isArray(v)?v:[]; }
export function toggleFavorite(id) { const current=getFavorites(), next=current.includes(id)?current.filter(x=>x!==id):[...current,id]; write(KEYS.favorites,next); return next.includes(id); }
export function getRecentTools() { const v=read(KEYS.recent,[]); return Array.isArray(v)?v:[]; }
export function recordRecentTool(id) { write(KEYS.recent,[id,...getRecentTools().filter(x=>x!==id)].slice(0,8)); }
export function clearRecentTools() { write(KEYS.recent,[]); }
export function getHistory() { const v=read(KEYS.history,[]); return Array.isArray(v)?v:[]; }
export function addHistory(entry) { if (!getSettings().saveHistory) return; write(KEYS.history,[entry,...getHistory()].slice(0,25)); }
export function clearHistory() { write(KEYS.history,[]); }
export function getSettings() { return {...{saveHistory:true},...read(KEYS.settings,{})}; }
export function setHistoryEnabled(value) { write(KEYS.settings,{...getSettings(),saveHistory:Boolean(value)}); }
export function saveHouseholdBudget(model) { return write(KEYS.householdBudget,model); }
export function getHouseholdBudget() { return read(KEYS.householdBudget,null); }
export function clearHouseholdBudget() { try { localStorage.removeItem(KEYS.householdBudget); return true; } catch { return false; } }
export function clearAllSiteData() { Object.values(KEYS).forEach(key=>{try{localStorage.removeItem(key)}catch{}}); }
export { KEYS };

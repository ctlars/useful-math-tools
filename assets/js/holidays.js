import { addCalendarDays, isoDate } from './engines.js';

export const CALENDARS = [
  ['none', 'None'], ['us', 'United States — Federal'], ['ca', 'Canada — Federal'],
  ['uk-ew', 'United Kingdom — England & Wales'], ['uk-sc', 'United Kingdom — Scotland'], ['uk-ni', 'United Kingdom — Northern Ireland'],
  ['au-nsw', 'Australia — New South Wales'], ['au-vic', 'Australia — Victoria'], ['au-qld', 'Australia — Queensland'],
  ['au-wa', 'Australia — Western Australia'], ['au-sa', 'Australia — South Australia'], ['au-tas', 'Australia — Tasmania'],
  ['au-act', 'Australia — ACT'], ['au-nt', 'Australia — Northern Territory'], ['mx', 'Mexico — National'],
  ['in', 'India — National gazetted'], ['cn', 'China — official 2026 schedule'], ['fr', 'France — National'],
  ['de', 'Germany — Nationwide'], ['es', 'Spain — National'], ['it', 'Italy — National'], ['nl', 'Netherlands — National'],
  ['ie', 'Ireland — National'], ['nz', 'New Zealand — National'], ['sg', 'Singapore — National']
];

const NAMES = Object.fromEntries(CALENDARS);
const d = (y, m, day) => new Date(Date.UTC(y, m - 1, day));
const pad = n => String(n).padStart(2, '0');
const key = (y, m, day) => `${y}-${pad(m)}-${pad(day)}`;

function easter(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100, dd = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - dd - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = (h + l - 7 * m + 114) % 31 + 1;
  return d(year, month, day);
}

function nthWeekday(year, month, weekday, nth) {
  const first = d(year, month, 1);
  return d(year, month, 1 + (7 + weekday - first.getUTCDay()) % 7 + 7 * (nth - 1));
}

function lastWeekday(year, month, weekday) {
  const last = d(year, month + 1, 0);
  return d(year, month, last.getUTCDate() - (7 + last.getUTCDay() - weekday) % 7);
}

function observed(date) {
  if (date.getUTCDay() === 6) return addCalendarDays(date, -1);
  if (date.getUTCDay() === 0) return addCalendarDays(date, 1);
  return date;
}

function add(map, date, name) { map[isoDate(date)] = name; }
function addFixed(map, year, items, useObserved = false) { for (const [m, day, name] of items) add(map, useObserved ? observed(d(year, m, day)) : d(year, m, day), name); }

const CHINA_2026 = {
  holidays: [
    ['2026-01-01','New Year holiday'],['2026-01-02','New Year holiday'],['2026-01-03','New Year holiday'],
    ...Array.from({length:9},(_,i)=>[isoDate(addCalendarDays(d(2026,2,15),i)),'Spring Festival holiday']),
    ['2026-04-04','Qingming Festival holiday'],['2026-04-05','Qingming Festival holiday'],['2026-04-06','Qingming Festival holiday'],
    ...Array.from({length:5},(_,i)=>[isoDate(addCalendarDays(d(2026,5,1),i)),'Labor Day holiday']),
    ['2026-06-19','Dragon Boat Festival holiday'],['2026-06-20','Dragon Boat Festival holiday'],['2026-06-21','Dragon Boat Festival holiday'],
    ['2026-09-25','Mid-Autumn Festival holiday'],['2026-09-26','Mid-Autumn Festival holiday'],['2026-09-27','Mid-Autumn Festival holiday'],
    ...Array.from({length:7},(_,i)=>[isoDate(addCalendarDays(d(2026,10,1),i)),'National Day holiday'])
  ],
  working: ['2026-02-14','2026-02-28','2026-05-09','2026-09-20','2026-10-10']
};

export function holidayRules(id, year) {
  if (id === 'none') return { id, label: NAMES[id], supported: true, holidays: new Set(), working: new Set(), names: {}, note: 'Weekends are excluded; no public holidays are applied.' };
  if (id === 'cn') {
    if (year !== 2026) return { id, label: NAMES[id], supported: false, holidays: new Set(), working: new Set(), names: {}, note: 'The official China calendar is currently available for 2026 only.' };
    const names = Object.fromEntries(CHINA_2026.holidays);
    return { id, label: NAMES[id], supported: true, holidays: new Set(Object.keys(names)), working: new Set(CHINA_2026.working), names, note: 'Includes official 2026 holiday periods and compensating weekend workdays.' };
  }
  if (year < 2020 || year > 2035) return { id, label: NAMES[id], supported: false, holidays: new Set(), working: new Set(), names: {}, note: 'This calendar supports years 2020–2035.' };
  const names = {};
  const easterDay = easter(year);
  const fixed = {
    us:[[1,1,"New Year's Day"],[6,19,'Juneteenth'],[7,4,'Independence Day'],[11,11,'Veterans Day'],[12,25,'Christmas Day']],
    ca:[[1,1,"New Year's Day"],[7,1,'Canada Day'],[9,30,'National Day for Truth and Reconciliation'],[11,11,'Remembrance Day'],[12,25,'Christmas Day'],[12,26,'Boxing Day']],
    mx:[[1,1,"New Year's Day"],[5,1,'Labor Day'],[9,16,'Independence Day'],[12,25,'Christmas Day']],
    in:[[1,26,'Republic Day'],[8,15,'Independence Day'],[10,2,'Gandhi Jayanti']],
    fr:[[1,1,"New Year's Day"],[5,1,'Labour Day'],[5,8,'Victory Day'],[7,14,'Bastille Day'],[8,15,'Assumption'],[11,1,"All Saints' Day"],[11,11,'Armistice Day'],[12,25,'Christmas Day']],
    de:[[1,1,"New Year's Day"],[5,1,'Labour Day'],[10,3,'German Unity Day'],[12,25,'Christmas Day'],[12,26,'Second Christmas Day']],
    es:[[1,1,"New Year's Day"],[1,6,'Epiphany'],[5,1,'Labour Day'],[8,15,'Assumption'],[10,12,'National Day'],[11,1,"All Saints' Day"],[12,6,'Constitution Day'],[12,8,'Immaculate Conception'],[12,25,'Christmas Day']],
    it:[[1,1,"New Year's Day"],[1,6,'Epiphany'],[4,25,'Liberation Day'],[5,1,'Labour Day'],[6,2,'Republic Day'],[8,15,'Assumption'],[11,1,"All Saints' Day"],[12,8,'Immaculate Conception'],[12,25,'Christmas Day'],[12,26,"St Stephen's Day"]],
    nl:[[1,1,"New Year's Day"],[4,27,"King's Day"],[5,5,'Liberation Day'],[12,25,'Christmas Day'],[12,26,'Boxing Day']],
    ie:[[1,1,"New Year's Day"],[3,17,"St Patrick's Day"],[12,25,'Christmas Day'],[12,26,"St Stephen's Day"]],
    nz:[[1,1,"New Year's Day"],[1,2,"Day after New Year's Day"],[2,6,'Waitangi Day'],[4,25,'Anzac Day'],[12,25,'Christmas Day'],[12,26,'Boxing Day']],
    sg:[[1,1,"New Year's Day"],[5,1,'Labour Day'],[8,9,'National Day'],[12,25,'Christmas Day']]
  };
  const baseId = id.startsWith('au-') ? 'au' : id.startsWith('uk-') ? 'uk' : id;
  if (fixed[baseId]) addFixed(names, year, fixed[baseId], ['us','ca','nz'].includes(baseId));
  if (baseId === 'us') {
    add(names, nthWeekday(year,1,1,3),'Martin Luther King Jr. Day'); add(names,nthWeekday(year,2,1,3),"Washington's Birthday");
    add(names,lastWeekday(year,5,1),'Memorial Day'); add(names,nthWeekday(year,9,1,1),'Labor Day');
    add(names,nthWeekday(year,10,1,2),'Columbus Day'); add(names,nthWeekday(year,11,4,4),'Thanksgiving Day');
  } else if (baseId === 'ca') {
    add(names,addCalendarDays(easterDay,-2),'Good Friday'); add(names,nthWeekday(year,9,1,1),'Labour Day'); add(names,nthWeekday(year,10,1,2),'Thanksgiving');
  } else if (baseId === 'uk') {
    addFixed(names,year,[[1,1,"New Year's Day"],[12,25,'Christmas Day'],[12,26,'Boxing Day']],true);
    add(names,addCalendarDays(easterDay,-2),'Good Friday'); add(names,addCalendarDays(easterDay,1),'Easter Monday');
    add(names,nthWeekday(year,5,1,1),'Early May bank holiday'); add(names,lastWeekday(year,5,1),'Spring bank holiday'); add(names,lastWeekday(year,8,1),'Summer bank holiday');
    if (id === 'uk-sc') { add(names,d(year,1,2),'2 January'); add(names,d(year,11,30),"St Andrew's Day"); }
    if (id === 'uk-ni') { add(names,d(year,3,17),"St Patrick's Day"); add(names,d(year,7,12),'Battle of the Boyne'); }
  } else if (baseId === 'au') {
    addFixed(names,year,[[1,1,"New Year's Day"],[1,26,'Australia Day'],[4,25,'Anzac Day'],[12,25,'Christmas Day'],[12,26,'Boxing Day']],true);
    add(names,addCalendarDays(easterDay,-2),'Good Friday'); add(names,addCalendarDays(easterDay,1),'Easter Monday');
  } else if (['fr','de','es','it','nl','ie','nz'].includes(baseId)) {
    add(names,addCalendarDays(easterDay,-2),'Good Friday'); add(names,addCalendarDays(easterDay,1),'Easter Monday');
  }
  const regional = baseId === 'au' ? 'Includes nationwide Australian holidays only; verify state and local observances.' :
    baseId === 'in' ? 'Includes India’s national gazetted holidays only; state, religious, and local holidays vary.' :
    ['de','es','fr','it','nl'].includes(baseId) ? 'Includes nationwide holidays; regional and local holidays may differ.' :
    baseId === 'mx' ? 'Includes selected national statutory holidays; workplace observance can vary.' :
    baseId === 'sg' ? 'Includes fixed national holidays; lunar-calendar holidays are not included.' :
    'Public-holiday coverage is intended for general planning; verify special one-off and local observances.';
  return { id, label: NAMES[id], supported: true, holidays: new Set(Object.keys(names)), working: new Set(), names, note: regional };
}

export function calendarOptionsHtml() { return CALENDARS.map(([value,label]) => `<option value="${value}">${label}</option>`).join(''); }


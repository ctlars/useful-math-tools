import test from 'node:test';
import assert from 'node:assert/strict';

const data=new Map();
global.localStorage={getItem:key=>data.has(key)?data.get(key):null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};
const storage=await import('../assets/js/storage.js');

test('favorites store IDs and toggle off cleanly',()=>{data.clear();assert.equal(storage.toggleFavorite('length'),true);assert.deepEqual(storage.getFavorites(),['length']);assert.equal(storage.toggleFavorite('length'),false);assert.deepEqual(storage.getFavorites(),[]);});
test('recent tools are unique and newest first',()=>{data.clear();storage.recordRecentTool('length');storage.recordRecentTool('area');storage.recordRecentTool('length');assert.deepEqual(storage.getRecentTools(),['length','area']);});
test('recent tools keep at most eight IDs',()=>{data.clear();for(let i=0;i<10;i++)storage.recordRecentTool(`tool-${i}`);assert.equal(storage.getRecentTools().length,8);});
test('history stores concise entries and keeps at most 25',()=>{data.clear();for(let i=0;i<30;i++)storage.addHistory({calculatorId:'length',timestamp:String(i),summary:`Entry ${i}`});assert.equal(storage.getHistory().length,25);assert.equal(storage.getHistory()[0].summary,'Entry 29');});
test('history setting can disable new entries',()=>{data.clear();storage.setHistoryEnabled(false);storage.addHistory({calculatorId:'length',summary:'Hidden'});assert.deepEqual(storage.getHistory(),[]);});
test('household budget is saved and cleared independently',()=>{data.clear();const budget={version:1,income:[],expenses:[]};assert.equal(storage.saveHouseholdBudget(budget),true);assert.deepEqual(storage.getHouseholdBudget(),budget);storage.clearHouseholdBudget();assert.equal(storage.getHouseholdBudget(),null);});
test('clear all removes only namespaced site keys',()=>{data.clear();data.set('unrelated','keep');storage.toggleFavorite('length');storage.recordRecentTool('length');storage.setHistoryEnabled(true);storage.addHistory({calculatorId:'length',summary:'One'});storage.clearAllSiteData();assert.equal(data.get('unrelated'),'keep');assert.deepEqual(storage.getFavorites(),[]);assert.deepEqual(storage.getRecentTools(),[]);assert.deepEqual(storage.getHistory(),[]);});

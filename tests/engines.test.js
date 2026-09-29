import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseDate, isoDate, addCalendarDays, addMonths, addYears, daysBetween, daysBetweenOptions, calendarInterval,
  isRuleDay, countRuleDays, addRuleDays, percentageOf, percentRatio, wholeFromPart, percentageChange,
  percentageDifference, averageStats, simplifyFraction, decimalToFraction, solveProportion, loanPayment,
  compoundInterest, LENGTH_METERS, WEIGHT_KG, AREA_SQ_METERS, VOLUME_LITERS, SPEED_MPS,
  convertUnit, convertTemperature, paintEstimate, salesTax, markupMargin
} from '../assets/js/engines.js';
import { holidayRules } from '../assets/js/holidays.js';

const date = parseDate;
const close = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≉ ${expected}`);

test('date parsing preserves a calendar date', () => assert.equal(isoDate(date('2026-09-29')), '2026-09-29'));
test('invalid date is rejected', () => assert.throws(() => date('2026-02-30')));
test('same date has zero elapsed days', () => assert.equal(daysBetween(date('2026-01-01'), date('2026-01-01')), 0));
test('next date has one elapsed day', () => assert.equal(daysBetween(date('2026-01-01'), date('2026-01-02')), 1));
test('leap day is counted', () => assert.equal(daysBetween(date('2024-02-28'), date('2024-03-01')), 2));
test('year boundary is counted', () => assert.equal(daysBetween(date('2025-12-31'), date('2026-01-01')), 1));
test('adding calendar days crosses a month', () => assert.equal(isoDate(addCalendarDays(date('2026-01-31'), 1)), '2026-02-01'));
test('subtracting calendar days crosses a year', () => assert.equal(isoDate(addCalendarDays(date('2026-01-01'), -1)), '2025-12-31'));
test('month addition clamps to February', () => assert.equal(isoDate(addMonths(date('2026-01-31'), 1)), '2026-02-28'));
test('month addition preserves leap day where available', () => assert.equal(isoDate(addMonths(date('2024-01-31'), 1)), '2024-02-29'));
test('year addition clamps leap day', () => assert.equal(isoDate(addYears(date('2024-02-29'), 1)), '2025-02-28'));
test('days options exclude both boundaries', () => assert.equal(daysBetweenOptions(date('2026-01-01'), date('2026-01-03'), false, false), 1));
test('days options include start only', () => assert.equal(daysBetweenOptions(date('2026-01-01'), date('2026-01-03'), true, false), 2));
test('days options include end only', () => assert.equal(daysBetweenOptions(date('2026-01-01'), date('2026-01-03'), false, true), 2));
test('days options include both boundaries', () => assert.equal(daysBetweenOptions(date('2026-01-01'), date('2026-01-03'), true, true), 3));
test('calendar interval uses actual months', () => assert.deepEqual(calendarInterval(date('2026-09-29'), date('2026-11-10')), { sign:1, years:0, months:1, days:12 }));
test('ordinary Saturday is not a rule day', () => assert.equal(isRuleDay(date('2026-09-19'), holidayRules('none', 2026)), false));
test('China working Sunday overrides weekend', () => assert.equal(isRuleDay(date('2026-09-20'), holidayRules('cn', 2026)), true));
test('China National Day is excluded', () => assert.equal(isRuleDay(date('2026-10-01'), holidayRules('cn', 2026)), false));
test('China calendar rejects unavailable year', () => assert.equal(holidayRules('cn', 2027).supported, false));
test('business count handles one workweek', () => assert.equal(countRuleDays(date('2026-09-28'), date('2026-10-02'), holidayRules('none', 2026), true, true).count, 5));
test('business count excludes a US holiday', () => assert.equal(countRuleDays(date('2026-11-25'), date('2026-11-27'), holidayRules('us', 2026), true, true).count, 2));
test('add rule days skips weekend', () => assert.equal(isoDate(addRuleDays(date('2026-09-18'), 1, holidayRules('none', 2026))), '2026-09-21'));
test('add rule days can count start', () => assert.equal(isoDate(addRuleDays(date('2026-09-18'), 1, holidayRules('none', 2026), true)), '2026-09-18'));
test('percentage of', () => assert.equal(percentageOf(15, 240), 36));
test('percentage ratio', () => assert.equal(percentRatio(36, 240), 15));
test('percentage ratio zero denominator is undefined', () => assert.equal(percentRatio(10, 0), null));
test('whole from part', () => assert.equal(wholeFromPart(36, 15), 240));
test('whole from zero percent is undefined', () => assert.equal(wholeFromPart(2, 0), null));
test('percentage increase', () => assert.equal(percentageChange(80, 100), 25));
test('percentage decrease', () => assert.equal(percentageChange(100, 80), -20));
test('negative starting percentage change', () => assert.equal(percentageChange(-100, -50), 50));
test('zero starting percentage change is undefined', () => assert.equal(percentageChange(0, 10), null));
test('percentage difference is symmetrical', () => assert.equal(percentageDifference(80, 100), percentageDifference(100, 80)));
test('percentage difference of zeros is zero', () => assert.equal(percentageDifference(0, 0), 0));
test('average stats returns all measures', () => assert.deepEqual(averageStats([1,2,3,4]), {mean:2.5,median:2.5,min:1,max:4,range:3,count:4,sum:10}));
test('average rejects empty list', () => assert.throws(() => averageStats([])));
test('fraction simplifies', () => assert.deepEqual(simplifyFraction(20,30), {numerator:2,denominator:3}));
test('negative fraction normalizes sign', () => assert.deepEqual(simplifyFraction(3,-4), {numerator:-3,denominator:4}));
test('improper fraction simplifies', () => assert.deepEqual(simplifyFraction(12,8), {numerator:3,denominator:2}));
test('zero denominator is rejected', () => assert.throws(() => simplifyFraction(1,0)));
test('decimal becomes simplest fraction', () => assert.deepEqual(decimalToFraction(.125), {numerator:1,denominator:8}));
test('proportion solves missing numerator', () => assert.deepEqual(solveProportion([3,5,null,20]), {index:2,value:12}));
test('proportion solves missing denominator', () => assert.deepEqual(solveProportion([3,null,12,20]), {index:1,value:5}));
test('proportion requires exactly one blank', () => assert.throws(() => solveProportion([3,null,null,20])));
test('loan supports zero APR', () => assert.deepEqual(loanPayment(1200,0,12), {payment:100,total:1200,interest:0,payments:12}));
test('known loan payment', () => close(loanPayment(25000,6.5,60).payment, 489.1539, .001));
test('loan totals reconcile', () => { const r=loanPayment(10000,5,36); close(r.total-r.interest,10000); });
test('compound interest with no contributions', () => close(compoundInterest({principal:10000,annualRate:5,years:10,compoundsPerYear:12,contribution:0,contributionsPerYear:12}).balance,16470.094, .01));
test('compound interest at zero rate', () => assert.equal(compoundInterest({principal:1000,annualRate:0,years:1,compoundsPerYear:12,contribution:100,contributionsPerYear:12}).balance,2200));
test('compound contributions occur at period end', () => close(compoundInterest({principal:0,annualRate:12,years:1,compoundsPerYear:12,contribution:100,contributionsPerYear:12}).balance,1268.2503,.01));
test('length meters to feet', () => close(convertUnit(1,'m','ft',LENGTH_METERS),3.280839895));
test('length mile to kilometers', () => close(convertUnit(1,'mi','km',LENGTH_METERS),1.609344));
test('weight kilograms to pounds', () => close(convertUnit(1,'kg','lb',WEIGHT_KG),2.2046226218));
test('weight stone to pounds', () => close(convertUnit(1,'st','lb',WEIGHT_KG),14));
test('Celsius to Fahrenheit', () => assert.equal(convertTemperature(20,'C','F'),68));
test('Fahrenheit to Celsius', () => close(convertTemperature(32,'F','C'),0));
test('Kelvin to Celsius', () => assert.equal(convertTemperature(273.15,'K','C'),0));
test('below absolute zero is rejected', () => assert.throws(() => convertTemperature(-274,'C','K')));
test('paint room with no openings', () => assert.deepEqual(paintEstimate({length:10,width:10,height:8,doors:0,windows:0,coats:2,coverage:400}), {gross:320,paintableArea:320,required:1.6,purchase:2}));
test('paint subtracts openings', () => close(paintEstimate({length:12,width:10,height:8,doors:1,windows:2,coats:2,doorArea:20,windowArea:15,coverage:350}).required,1.7257142857));
test('paint never returns negative wall area', () => assert.equal(paintEstimate({length:1,width:1,height:1,doors:2,windows:2,coats:1,doorArea:20,windowArea:15,coverage:350}).paintableArea,0));
test('square meter to square feet', () => close(convertUnit(1,'m2','ft2',AREA_SQ_METERS),10.7639104167));
test('acre is 43,560 square feet', () => close(convertUnit(1,'acre','ft2',AREA_SQ_METERS),43560));
test('hectare is 10,000 square meters', () => assert.equal(convertUnit(1,'hectare','m2',AREA_SQ_METERS),10000));
test('liter is 1,000 milliliters', () => assert.equal(convertUnit(1,'l','ml',VOLUME_LITERS),1000));
test('US gallon is four US quarts', () => close(convertUnit(1,'gallon','quart',VOLUME_LITERS),4));
test('US cup is eight US fluid ounces', () => close(convertUnit(1,'cup','floz',VOLUME_LITERS),8));
test('mph to kilometers per hour', () => close(convertUnit(1,'mph','kmh',SPEED_MPS),1.609344));
test('knot uses one nautical mile per hour', () => close(convertUnit(1,'knot','kmh',SPEED_MPS),1.852));
test('sales tax adds 8.25 percent', () => assert.deepEqual(salesTax(100,8.25), {subtotal:100,tax:8.25,total:108.25}));
test('sales tax can be removed', () => { const r=salesTax(108.25,8.25,'remove'); close(r.subtotal,100); close(r.tax,8.25); });
test('markup and margin distinguish their bases', () => assert.deepEqual(markupMargin({cost:80,sellingPrice:100}), {sellingPrice:100,profit:20,markup:25,margin:20}));
test('markup determines selling price', () => assert.deepEqual(markupMargin({cost:80,markup:25}), {sellingPrice:100,profit:20,markup:25,margin:20}));

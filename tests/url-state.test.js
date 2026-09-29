import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeState, decodeState } from '../assets/js/url-state.js';

test('URL state encodes ordinary values', () => assert.equal(encodeState(['amount','rate'],{amount:25000,rate:6.5}),'amount=25000&rate=6.5'));
test('URL state encodes special characters safely', () => assert.equal(encodeState(['input'],{input:'3/4 & 1/2'}),'input=3%2F4+%26+1%2F2'));
test('URL state encodes checkboxes', () => assert.equal(encodeState(['includeStart','includeEnd'],{includeStart:false,includeEnd:true}),'includeStart=0&includeEnd=1'));
test('URL state ignores fields outside the allowlist', () => assert.deepEqual(decodeState('?amount=5&tracking=secret',['amount']),{amount:'5'}));
test('URL state handles missing values', () => assert.deepEqual(decodeState('',['amount']),{}));
test('URL state ignores excessively long values', () => assert.deepEqual(decodeState('?input='+encodeURIComponent('x'.repeat(121)),['input']),{}));

import { describe, it, expect } from 'vitest';
import { unixTimestampSeconds, getRandom, runtime, clockString, isUrl, bytesToSize, parseMention, getGroupAdmins, logic } from '../../lib/myfunc.js';

describe('unixTimestampSeconds()', () => {
    it('returns a number', () => expect(typeof unixTimestampSeconds()).toBe('number'));
    it('is close to Date.now()/1000', () => expect(Math.abs(unixTimestampSeconds() - Math.floor(Date.now()/1000))).toBeLessThan(2));
    it('accepts a custom date', () => expect(unixTimestampSeconds(new Date('2024-01-01T00:00:00Z'))).toBe(1704067200));
});

describe('getRandom()', () => {
    it('returns string with ext', () => expect(getRandom('.mp3').endsWith('.mp3')).toBe(true));
});

describe('runtime()', () => {
    it('returns empty for 0', () => expect(runtime(0)).toBe(''));
    it('includes minute for 61s', () => expect(runtime(61)).toContain('minute'));
    it('includes hour for 3661s', () => expect(runtime(3661)).toContain('hour'));
    it('singular second', () => { expect(runtime(1)).toContain('second'); expect(runtime(1)).not.toContain('seconds'); });
});

describe('clockString()', () => {
    it('formats to HH:MM:SS', () => expect(clockString(3661000)).toBe('01:01:01'));
    it('pads with zeros', () => expect(clockString(0)).toBe('00:00:00'));
    it('handles NaN', () => expect(clockString(NaN)).toBe('--:--:--'));
});

describe('isUrl()', () => {
    it('matches valid URLs', () => expect(isUrl('https://google.com')).toBeTruthy());
    it('returns null for invalid', () => expect(isUrl('not a url')).toBeNull());
});

describe('bytesToSize()', () => {
    it('0 Bytes for 0', () => expect(bytesToSize(0)).toBe('0 Bytes'));
    it('converts KB', () => expect(bytesToSize(1024)).toBe('1 KB'));
    it('converts MB', () => expect(bytesToSize(1048576)).toBe('1 MB'));
});

describe('parseMention()', () => {
    it('extracts JIDs', () => expect(parseMention('Hello @923001234567')).toEqual(['923001234567@s.whatsapp.net']));
    it('empty array for no mentions', () => expect(parseMention('no mentions')).toEqual([]));
});

describe('getGroupAdmins()', () => {
    it('returns admin JIDs', () => expect(getGroupAdmins([{id:'u1@s.whatsapp.net',admin:'admin'},{id:'u2@s.whatsapp.net',admin:null}])).toEqual(['u1@s.whatsapp.net']));
});

describe('logic()', () => {
    it('returns correct output', () => expect(logic('a', ['a','b'], [1,2])).toBe(1));
    it('returns null for no match', () => expect(logic('z', ['a','b'], [1,2])).toBeNull());
});

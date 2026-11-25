import { describe, it, beforeAll, expect } from 'vitest';

describe('Database - Integration', () => {
    let store;

    beforeAll(async () => {
        const mod = await import('../../lib/lightweight_store.js');
        store = mod.default;
    });

    it('loads store module', () => expect(store).toBeTruthy());
    it('has loadMessage method', () => expect(typeof store.loadMessage).toBe('function'));
    it('has bind method', () => expect(typeof store.bind).toBe('function'));

    it('valid MONGO_URL format if set', () => {
        const url = process.env.MONGO_URL;
        if (url) expect(url.startsWith('mongodb')).toBe(true);
    });
});

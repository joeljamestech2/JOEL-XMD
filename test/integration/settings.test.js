import { describe, it, beforeAll, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Settings Persistence', () => {
    let store;

    beforeAll(async () => {
        const mod = await import('../../lib/lightweight_store.js');
        store = mod.default;
    });

    const keys = ['autoStatus','autoread','autotyping','pmblocker','anticall','stealthMode','autoBio','autoReaction'];

    for (const key of keys) {
        it(`saves and reads ${key}`, async () => {
            await store.saveSetting('global', key, { enabled: true });
            const val = await store.getSetting('global', key);
            expect(val?.enabled).toBe(true);

            await store.saveSetting('global', key, { enabled: false });
            const val2 = await store.getSetting('global', key);
            expect(val2?.enabled).toBe(false);

            const filePath = path.join(process.cwd(), 'data', `${key}.json`);
            if (fs.existsSync(filePath)) {
                const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                expect('global' in raw).toBe(false);
                expect('enabled' in raw).toBe(true);
            }
        });
    }
});

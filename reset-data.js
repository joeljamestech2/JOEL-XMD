import fs from 'fs';
import path from 'path';
const DATA_DIR = path.join(process.cwd(), 'data');
const defaults = {
    'autoStatus.json': { enabled: false },
    'autoread.json': { enabled: false },
    'autotyping.json': { enabled: false },
    'pmblocker.json': { enabled: false },
    'anticall.json': { enabled: false },
    'stealthMode.json': { enabled: false },
    'autoBio.json': { enabled: false, customBio: null },
    'autoReaction.json': { enabled: false },
    'messageCount.json': { isPublic: true, messageCount: {} },
    'userGroupData.json': {
        users: [], groups: [], antilink: {}, antibadword: {},
        warnings: {}, sudo: [], welcome: {}, goodbye: {},
        chatbot: {}, autoReaction: false
    },
    'banned.json': [],
    'warnings.json': {},
    'notes.json': {},
    'owner.json': [],
    'premium.json': [],
    'autoAi.json': {},
    'antidelete.json': { enabled: false },
    'antilink.json': {},
    'antibadword.json': {},
    'antispam.json': { groups: {} },
    'autoreplies.json': { enabled: true, replies: [] },
    'schedules.json': [],
    'polls.json': { polls: [] },
    'baileys_store.json': {},
};
if (!fs.existsSync(DATA_DIR))
    fs.mkdirSync(DATA_DIR, { recursive: true });
for (const [file, value] of Object.entries(defaults)) {
    const filePath = path.join(DATA_DIR, file);
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
    console.log(`✅ Reset: ${file}`);
}
console.log('\n✅ All data files reset to defaults!');

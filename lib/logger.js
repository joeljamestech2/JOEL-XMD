import fs from 'fs';
import path from 'path';
const LOG_DIR = path.join(process.cwd(), 'logs');
if (!fs.existsSync(LOG_DIR))
    fs.mkdirSync(LOG_DIR, { recursive: true });
const LOG_FILE = path.join(LOG_DIR, 'error.log');
const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB
const MAX_BACKUPS = 3;
function rotateLogs() {
    try {
        if (!fs.existsSync(LOG_FILE))
            return;
        const stats = fs.statSync(LOG_FILE);
        if (stats.size < MAX_SIZE_BYTES)
            return;
        // Shift backups: .error.log.2 -> .error.log.3, .error.log.1 -> .error.log.2
        for (let i = MAX_BACKUPS - 1; i >= 1; i--) {
            const src = `${LOG_FILE}.${i}`;
            const dst = `${LOG_FILE}.${i + 1}`;
            if (fs.existsSync(src))
                fs.renameSync(src, dst);
        }
        // Rotate current log to .error.log.1
        fs.renameSync(LOG_FILE, `${LOG_FILE}.1`);
    }
    catch (e) {
        console.error('Log rotation failed:', e.message);
    }
}
export function writeErrorLog(entry) {
    try {
        rotateLogs();
        fs.appendFileSync(LOG_FILE, `${JSON.stringify(entry) }\n`);
    }
    catch (e) {
        console.error('Failed to write error log:', e.message);
    }
}

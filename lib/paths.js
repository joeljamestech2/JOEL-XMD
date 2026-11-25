import path from 'path';
// Always resolve data directory relative to project root (process.cwd())
// Works whether running from source (ts-node) or compiled (dist/)
export const DATA_DIR = path.join(process.cwd(), 'data');
export const ASSETS_DIR = path.join(process.cwd(), 'assets');
export const TEMP_DIR = path.join(process.cwd(), 'temp');
export const SESSION_DIR = path.join(process.cwd(), 'session');
export const dataFile = (filename) => path.join(DATA_DIR, filename);

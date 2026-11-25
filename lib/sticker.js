import { Sticker, StickerTypes } from 'stickers-formatter';
import path from 'path';
import crypto from 'crypto';
import webp from 'node-webpmux';
import { fileURLToPath } from 'url';
import config from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const _tmp = path.join(process.cwd(), 'temp');
export async function sticker(isImage, url, _packname, _author) {
    try {
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        return await new Sticker(buffer, {
            pack: config.packname || 'MEGA-MD',
            author: config.author || 'GlobalTechInfo',
            type: StickerTypes.DEFAULT
        }).toBuffer();
    }
    catch (error) {
        console.error('Error in sticker creation:', error);
        return null;
    }
}
export async function sticker2(img, url) {
    const input = (url || img);
    return await new Sticker(input, { type: StickerTypes.DEFAULT }).toBuffer();
}
export async function sticker3(img, url, packname, author) {
    const input = (url || img);
    return await new Sticker(input, {
        pack: packname,
        author,
        type: StickerTypes.DEFAULT
    }).toBuffer();
}
export async function sticker4(img, url) {
    const input = (url || img);
    return await new Sticker(input, { type: StickerTypes.DEFAULT }).toBuffer();
}
export async function sticker5(img, url, packname, author, categories = [''], extra = {}) {
    const input = (url || img);
    return await new Sticker(input, {
        pack: packname || config.packname,
        author: author || config.author,
        type: StickerTypes.DEFAULT,
        categories,
        ...extra
    }).toBuffer();
}
export async function sticker6(img, url) {
    const input = (url || img);
    return await new Sticker(input, { type: StickerTypes.FULL }).toBuffer();
}
export async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
    const img = new webp.Image();
    const stickerPackId = crypto.randomBytes(32).toString('hex');
    const json = {
        'sticker-pack-id': stickerPackId,
        'sticker-pack-name': packname,
        'sticker-pack-publisher': author,
        'emojis': categories,
        ...extra
    };
    const exifAttr = Buffer.from([
        0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ]);
    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    await img.load(webpSticker);
    img.exif = exif;
    return await img.save(null);
}
export const support = {
    ffmpeg: true,
    ffprobe: true,
    ffmpegWebp: true,
    convert: true,
    magick: false,
    gm: false,
    find: false
};

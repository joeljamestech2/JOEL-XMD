import { Sticker, StickerTypes } from 'stickers-formatter';
import path from 'path';
import { tmpdir } from 'os';
import crypto from 'crypto';
import fs from 'fs';
function randomFileName() {
    return path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
}
export async function imageToWebp(media) {
    return await new Sticker(media, { type: StickerTypes.DEFAULT }).toBuffer();
}
export async function videoToWebp(media) {
    return await new Sticker(media, { type: StickerTypes.DEFAULT }).toBuffer();
}
export async function writeExifImg(media, metadata) {
    const buff = await new Sticker(media, {
        pack: metadata.packname,
        author: metadata.author,
        categories: (metadata.categories || ['']),
        type: StickerTypes.DEFAULT
    }).toBuffer();
    const tmpFileOut = randomFileName();
    fs.writeFileSync(tmpFileOut, buff);
    return tmpFileOut;
}
export async function writeExifVid(media, metadata) {
    const buff = await new Sticker(media, {
        pack: metadata.packname,
        author: metadata.author,
        categories: (metadata.categories || ['']),
        type: StickerTypes.DEFAULT
    }).toBuffer();
    const tmpFileOut = randomFileName();
    fs.writeFileSync(tmpFileOut, buff);
    return tmpFileOut;
}
export async function writeExif(media, metadata) {
    const input = /webp|image|video/.test(media.mimetype) ? media.data : null;
    if (!input)
        return null;
    const buff = await new Sticker(input, {
        pack: metadata.packname,
        author: metadata.author,
        categories: (metadata.categories || ['']),
        type: StickerTypes.DEFAULT
    }).toBuffer();
    const tmpFileOut = randomFileName();
    fs.writeFileSync(tmpFileOut, buff);
    return tmpFileOut;
}

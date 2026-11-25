import chalk from 'chalk';
import PhoneNumber, { parsePhoneNumber } from 'awesome-phonenumber';
import config from '../config.js';
/**
 * Extract real phone number from various JID formats
 */
function extractPhoneNumber(jid) {
    if (!jid)
        return null;
    const number = jid
        .replace('@s.whatsapp.net', '')
        .replace('@lid', '')
        .replace('@g.us', '')
        .split(':')[0];
    if (number.length < 10 && jid.includes('@lid')) {
        return null;
    }
    return number;
}
/**
 * Get name with fallback options
 */
async function getNameWithFallback(jid, sock, pushName) {
    try {
        if (pushName && pushName.trim()) {
            return pushName.trim();
        }
        if (sock.store?.contacts?.[jid]) {
            const contact = sock.store.contacts[jid];
            if (contact.name || contact.notify) {
                return contact.name || contact.notify;
            }
        }
        const phone = extractPhoneNumber(jid);
        if (phone && phone.length >= 10) {
            const pn = PhoneNumber(`+${ phone}`);
            if (pn.valid) {
                return null;
            }
        }
        return jid.split('@')[0].split(':')[0];
    }
    catch (e) {
        return jid.split('@')[0].split(':')[0];
    }
}
/**
 * Beautiful message logger for console
 * Prints formatted message info with colors and emojis
 */
async function printMessage(message, sock) {
    try {
        if (!message?.key)
            return;
        const m = message;
        const chatId = m.key.remoteJid;
        const senderId = m.key.participant || m.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const fromMe = m.key.fromMe;
        let senderName = '';
        let senderPhone = '';
        try {
            if (fromMe) {
                senderName = sock.user?.name || 'Owner';
                const botNumber = extractPhoneNumber(sock.user?.id || sock.user?.jid);
                if (botNumber) {
                    const pn = parsePhoneNumber(`+${ botNumber}`);
                    senderPhone = pn.valid ? pn.number?.international || botNumber : botNumber;
                }
            }
            else {
                senderName = await getNameWithFallback(senderId, sock, m.pushName);
                const phone = extractPhoneNumber(senderId);
                if (phone && phone.length >= 10) {
                    const pn = PhoneNumber(`+${ phone}`);
                    senderPhone = pn.valid ? pn.getNumber('international') : phone;
                }
                else {
                    senderPhone = senderId.split('@')[0].split(':')[0];
                }
            }
        }
        catch (e) {
            senderName = m.pushName || senderId.split('@')[0];
            senderPhone = senderId.split('@')[0].split(':')[0];
        }
        let chatName = null;
        try {
            if (isGroup) {
                const metadata = await sock.groupMetadata(chatId).catch(() => null);
                chatName = metadata?.subject || null;
            }
        }
        catch (e) {
            chatName = null;
        }
        const messageType = Object.keys(m.message || {})[0];
        let messageText = '';
        let fileSize = 0;
        let shouldSkipLog = false;
        if (messageType === 'senderKeyDistributionMessage' ||
            messageType === 'protocolMessage' ||
            messageType === 'reactionMessage') {
            shouldSkipLog = true;
        }
        if (shouldSkipLog)
            return;
        const messageTypeLabels = {
            conversation: 'TEXT',
            extendedTextMessage: 'TEXT',
            imageMessage: 'IMAGE',
            videoMessage: 'VIDEO',
            audioMessage: 'AUDIO',
            documentMessage: 'DOCUMENT',
            stickerMessage: 'STICKER',
            contactMessage: 'CONTACT',
            locationMessage: 'LOCATION'
        };
        if (m.message) {
            if (messageType === 'conversation') {
                messageText = m.message.conversation;
            }
            else if (messageType === 'extendedTextMessage') {
                messageText = m.message.extendedTextMessage?.text || '';
            }
            else if (messageType === 'imageMessage') {
                messageText = m.message.imageMessage?.caption || '[Image]';
                fileSize = m.message.imageMessage?.fileLength || 0;
            }
            else if (messageType === 'videoMessage') {
                messageText = m.message.videoMessage?.caption || '[Video]';
                fileSize = m.message.videoMessage?.fileLength || 0;
            }
            else if (messageType === 'audioMessage') {
                const duration = m.message.audioMessage?.seconds || 0;
                messageText = `[Audio ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}]`;
                fileSize = m.message.audioMessage?.fileLength || 0;
            }
            else if (messageType === 'documentMessage') {
                const fileName = m.message.documentMessage?.fileName || 'Document';
                messageText = `[📄 ${fileName}]`;
                fileSize = m.message.documentMessage?.fileLength || 0;
            }
            else if (messageType === 'stickerMessage') {
                messageText = '[Sticker]';
                fileSize = m.message.stickerMessage?.fileLength || 0;
            }
            else if (messageType === 'contactMessage') {
                messageText = `[👤 ${m.message.contactMessage?.displayName || 'Contact'}]`;
            }
            else if (messageType === 'locationMessage') {
                messageText = '[📍 Location]';
            }
            else {
                messageText = `[${messageType.replace('Message', '')}]`;
            }
        }
        let fileSizeStr = '';
        if (fileSize > 0) {
            const units = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(fileSize) / Math.log(1024));
            fileSizeStr = ` (${(fileSize / Math.pow(1024, i)).toFixed(1)} ${units[i]})`;
        }
        const timestamp = m.messageTimestamp
            ? new Date((m.messageTimestamp.low || m.messageTimestamp) * 1000)
            : new Date();
        const timeStr = timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: config.timeZone || 'Asia/Karachi'
        });
        const isCommand = messageText.startsWith('.') ||
            messageText.startsWith('!') ||
            messageText.startsWith('#') ||
            messageText.startsWith('/');
        const displayType = messageTypeLabels[messageType] || messageType.replace('Message', '').toUpperCase();
        console.log(chalk.hex('#00D9FF').bold('╭─────────────────────────────────'));
        console.log(`${chalk.hex('#00D9FF').bold('│') } ${ 
            chalk.cyan.bold('🤖 Bot') } ${ 
            chalk.black(chalk.bgCyan.bold(` ${timeStr} `)) } ${ 
            chalk.magenta.bold(displayType) 
            }${chalk.gray.bold(fileSizeStr)}`);
        const senderDisplay = senderName && senderName !== senderPhone
            ? `${senderName} (${senderPhone})`
            : senderPhone;
        console.log(`${chalk.hex('#00D9FF').bold('│') } ${ 
            fromMe ? chalk.green.bold('📤 ME') : chalk.yellow.bold('📨 FROM') } ${ 
            chalk.white.bold(senderDisplay)}`);
        if (isGroup && chatName) {
            console.log(`${chalk.hex('#00D9FF').bold('│') } ${ 
                chalk.blue.bold('👥 GROUP') } ${ 
                chalk.white.bold(chatName)}`);
        }
        else if (!isGroup) {
            console.log(`${chalk.hex('#00D9FF').bold('│') } ${ 
                chalk.magenta.bold('💬 PRIVATE') } ${ 
                chalk.white.bold('Private Chat')}`);
        }
        if (messageText) {
            const maxLength = 100;
            const displayText = messageText.length > maxLength
                ? `${messageText.substring(0, maxLength) }...`
                : messageText;
            const isBotResponse = messageText.includes('MEGA-MD') ||
                messageText.includes('Pinging...') ||
                messageText.includes('*🤖') ||
                (fromMe && messageText.includes('*'));
            console.log(`${chalk.hex('#00D9FF').bold('│') } ${ 
                chalk.hex('#FFD700').bold('💭 MSG') } ${ 
                isCommand
                    ? chalk.greenBright.bold(displayText)
                    : isBotResponse
                        ? chalk.cyan.bold(displayText)
                        : fromMe
                            ? chalk.blueBright.bold(displayText)
                            : chalk.white.bold(displayText)}`);
        }
        console.log(chalk.hex('#00D9FF').bold('╰─────────────────────────────────'));
        console.log();
    }
    catch (error) {
        console.log(chalk.red.bold('❌ Error logging message:'), error.message);
        console.log(chalk.gray.bold(`[${message.key?.fromMe ? 'ME' : 'MSG'}] ${message.key?.remoteJid}`));
    }
}
/**
 * Simple colored logger for events
 */
function printLog(type, message) {
    const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: config.timeZone || 'Asia/Karachi'
    });
    const colors = {
        info: chalk.blue,
        success: chalk.green,
        warning: chalk.yellow,
        error: chalk.red,
        connection: chalk.cyan,
        store: chalk.magenta
    };
    const icons = {
        info: '💡',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        connection: '🔌',
        store: '🗄️'
    };
    const color = colors[type] || chalk.white;
    const icon = icons[type] || '•';
    console.log(`${chalk.gray.bold(`[${timestamp}]`) } ${ 
        color(icon) } ${ 
        color(message)}`);
}
export { printMessage, printLog };


/*
──────────────────────────────────────────────────────────────────────────────
─██████──────────██████████████──████████████████────████████████────────────
─██░░██──────────██░░░░░░░░░░██──██░░░░░░░░░░░░██────██░░░░░░░░████───────────
─██░░██──────────██░░██████░░██──██░░████████░░██────██░░████░░░░██───────────
─██░░██──────────██░░██──██░░██──██░░██────██░░██────██░░██──██░░██───────────
─██░░██──────────██░░██──██░░██──██░░████████░░██────██░░██──██░░██───────────
─██░░██──────────██░░██──██░░██──██░░░░░░░░░░░░██────██░░██──██░░██───────────
─██░░██──────────██░░██──██░░██──██░░██████░░████────██░░██──██░░██───────────
─██░░██──────────██░░██──██░░██──██░░██──██░░██──────██░░██──██░░██───────────
─██░░██████████──██░░██████░░██──██░░██──██░░██████──██░░████░░░░██───────────
─██░░░░░░░░░░██──██░░░░░░░░░░██──██░░██──██░░░░░░██──██░░░░░░░░████───────────
─██████████████──██████████████──██████──██████████──████████████────────────
──────────────────────────────────────────────────────────────────────────────
made by lord joel | +255711459078 | Joel MD v10 | @joeljamestech255
*/

import config from '../../config.cjs';

const AddCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const botNumber = await Matrix.decodeJid(Matrix.user.id);

  if (cmd === 'add') {
    if (!m.isGroup) return m.reply('👥 *This command can only be used in groups!*');

    try {
      const groupMetadata = await Matrix.groupMetadata(m.from);
      const senderIsAdmin = groupMetadata.participants.some(
        p => p.id === m.sender && p.admin !== null
      );
      const botIsAdmin = groupMetadata.participants.some(
        p => p.id === botNumber && p.admin !== null
      );

      if (!senderIsAdmin)
        return m.reply('🚫 *You must be a group admin to use this command!*');
      if (!botIsAdmin)
        return m.reply('⚠️ *I need to be an admin to add users!*');
      if (!text)
        return m.reply('📞 *Please provide a phone number to add!*');

      const number = text.replace(/\D/g, '');
      if (number.length < 9)
        return m.reply('❌ *Invalid number!*');

      const userJid = number + '@s.whatsapp.net';

      await Matrix.groupParticipantsUpdate(m.from, [userJid], 'add');
      m.reply(`✅ *Successfully added @${number} to the group!*`, {
        mentions: [userJid]
      });
    } catch (err) {
      console.error('Add Error:', err);
      m.reply('❌ *Failed to add user. They may have privacy settings that prevent being added.*');
    }
  }
};

export default AddCommand;

*/

import config from '../../config.cjs';

const JoinCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'join') {
    if (!text) {
      return m.reply(
        '🔗 *Please provide a WhatsApp group invite link!*\n\n' +
        'Example:\n' +
        '```' + prefix + 'join https://chat.whatsapp.com/AbCdEfGhIjK' + '```'
      );
    }

    const match = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/);
    if (!match) {
      return m.reply('❌ *Invalid link format!* Please use a valid WhatsApp invite link.');
    }

    const groupCode = match[1];

    try {
      await Matrix.groupAcceptInvite(groupCode);
      m.reply('✅ *Successfully joined the group!*');
    } catch (err) {
      console.error('Join Error:', err);
      m.reply(
        '❌ *Failed to join group.*\n' +
        'Reasons may include:\n' +
        '• Expired or revoked link\n' +
        '• Bot was removed before\n' +
        '• Group is full\n' +
        '• Bot not allowed by privacy settings'
      );
    }
  }
};

export default JoinCommand;

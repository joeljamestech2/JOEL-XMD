import config from '../../config.cjs';

const attpCommandHandler = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (!['attp', 'attp2', 'attp3'].includes(cmd)) return;
  if (!text) return m.reply(`Usage: ${prefix}${cmd}attp lord joel`);

  const stickerUrl = `https://api.nexoracle.com/image-creating/${cmd}?apikey=33241c3a8402295fdc&text=${encodeURIComponent(text)}`;

  await gss.sendImageAsSticker(m.from, stickerUrl, m, {
    packname: 'jᴏᴇʟ xᴍᴅ',
    author: 'ʙᴏᴛ',
    type: 'full',
  });
};
//codes by lord joel 
export default attpCommandHandler;

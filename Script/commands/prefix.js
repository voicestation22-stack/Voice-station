module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "given prefix detail",
  commandCategory: "Dành cho Admin",
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  var { threadID, messageID, body } = event;

  if ((this.config.credits) != "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️") {
    return api.sendMessage("Again change credit to 𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦", threadID, messageID);
  }

  function out(data) {
    api.sendMessage(data, threadID, messageID);
  }

  var dataThread = (await Threads.getData(threadID));
  var data = dataThread.data;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  var arr = [
    "mpre", "mprefix", "prefix", "dấu lệnh", "prefix của bot là gì",
    "daulenh", "duong", "what prefix", "freefix", "what is the prefix", "bot dead",
    "bots dead", "where prefix", "what is bot", "what prefix bot", "how to use bot",
    "how use bot", "where are the bots", "bot not working", "bot is offline", 
    "prefx", "prfix", "prifx", "perfix", "bot not talking", "where is bot"
  ];

  arr.forEach(i => {
    let str = i[0].toUpperCase() + i.slice(1);
    if (body === i.toUpperCase() || body === i || str === body) {
      const prefix = threadSetting.PREFIX || global.config.PREFIX;
      return out(
        `╭─『 ⚙️ 𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 𝐈𝐍𝐅𝐎 』─╮\n` +
        `│ 🌀 Prefix: ⇉ [ ${prefix} ]\n` +
        `│ 👑 Owner: 亗٭R͜͡ÃṄ͜͡Ã٭亗\n` +
        `│ 🌐 Facebook ID:\n` +
        `│ https://www.facebook.com/share/1CKaD99iG9/?\n` +
        `│ 📞 WhatsApp: +971586256079\n` +
        `│ 💬 Messenger:\n` +
        `│ https://www.facebook.com/share/1CKaD99iG9/\n` +
        `╰──────────────────╯`
      );
    }
  });
};

module.exports.run = async ({ event, api }) => {
  return api.sendMessage("error", event.threadID);
};

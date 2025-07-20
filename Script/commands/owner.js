const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
 name: "owner",
 version: "1.0.1",
 hasPermssion: 0,
 credits: "Modified by Shahadat",
 description: "Display bot owner's information",
 commandCategory: "Info",
 usages: "",
 cooldowns: 5,
 dependencies: {
 request: "",
 "fs-extra": "",
 axios: ""
 }
};

module.exports.run = async function ({ api, event }) {
 const imageUrl = "https://www.facebook.com/share/1CKaD99iG9/";
 const path = __dirname + "/cache/owner.png";

 request(imageUrl)
 .pipe(fs.createWriteStream(path))
 .on("close", () => {
 api.sendMessage({
 body:
`🌟 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌟

👑 𝗡𝗮𝗺𝗲: 亗٭R͜͡ÃṄ͜͡Ã٭亗😘
😻 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: মঞ্জুলিকার মনে
💼 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻: পোলাপান দের পিছন মারা

🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸  : 亗٭R͜͡ÃṄ͜͡Ã٭亗
💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿:https://m.me/100036047565461?source=qr_link_share
📺 𝗬𝗼𝘂𝗧𝘂𝗯𝗲: দেখলে উষ্ঠা খাবা
📸 𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺: আমি গরিব এইসব নাই
📱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: 971586256079
🎵 𝗧𝗶𝗸𝗧𝗼𝗸: rana_vai.2.0
👻 𝗦𝗻𝗮𝗽𝗰𝗵𝗮𝘁: ফিল্টার সুন্দর🤭

🤖 𝗕𝗢𝗧 𝗕𝗬: 亗٭R͜͡ÃṄ͜͡Ã٭亗 𝐁𝐨𝐭
`,
 attachment: fs.createReadStream(path)
 }, event.threadID, () => fs.unlinkSync(path));
 });
};

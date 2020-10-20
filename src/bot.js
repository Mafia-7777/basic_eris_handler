require('dotenv').config();
const bot = new require('eris')(process.env.BOT_TOKEN, { allowedMentions: [], defaultImageFormat: "png", defaultImageSize: 256, autoreconnect: false });
require(__dirname + "/core/MongoDBconnect").init();
require(__dirname + "/core/CmdSet").set(bot);

bot.on("messageCreate", async msg => require(__dirname + "/core/events/messageCreate").msg(bot, msg) );
bot.on("ready", async () => require(__dirname + "/core/events/ready").ready(bot) );
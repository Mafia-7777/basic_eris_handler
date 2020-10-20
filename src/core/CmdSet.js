const util = require("util");
const fs = require("fs");
module.exports.set = async (bot) => {
    bot.cmds = new Map();
    bot.alli = new Map();

    const dirs = await util.promisify(fs.readdir)(__dirname + "/cmds/");
    dirs.forEach(async dir => {
        let FILES = await util.promisify(fs.readdir)(`${__dirname}/cmds/${dir}/`);
        FILES.forEach(async file => {
            if(!file.endsWith('js')) return;
            let fileReq = require(`${__dirname}/cmds/${dir}/${file}`);
            bot.cmds.set(fileReq.name, fileReq);
            await fileReq.alli.forEach(async alli => {
                bot.alli.set(alli, fileReq);
            });
        });
    });
    
    await bot.connect()

    console.log(`Loaded ${bot.cmds.size} cmds()), With ${bot.alli.size} alli`) 

};
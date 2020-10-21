const cooldown = new Map();
const devs = ["695520751842885672"]

const Server = require('../Schemas/Guild');
const User = require('../Schemas/users');
const data = {};

function perm_check(userID, perm, msg){
    let perms = msg.channel.guild.members.get(userID).permission;
    if(!perms.has(perm)){
        return false
    }else{ return true };
};

function perm_check_channel(userID, perm, msg){
    let perms = msg.channel.permissionsOf(userID);
    if(!perms.has(perm)){
        return false
    }else{ return true };
};

module.exports.msg = async (bot, msg) => {
    
    if(perm_check_channel(bot.user.id, "embedLinks", msg) == false){
        try{
            let dm_chammel = await bot.getDMChannel(authorID);
            return dm_chammel.sendErr(`I need embedLinks permission in **${msg.channel.guild.name}**, So you can use me`);
        }catch(e){};
    };

    const guildID = msg.guildID;
    const authorID = msg.author.id;

    data.server = await Server.findOne({id: guildID});
    if(!data.server){
        await new Server({id: guildID}).save();
        data.server = await Server.findOne({id: guildID});
    } 
    
    let prefix = data.server.prefix.toLowerCase();
    if(msg.mentions[0] && msg.mentions[0].id == bot.user.id && msg.content.length == 22){
        if(perm_check_channel(bot.user.id, "embedLinks", msg) == true){
            return msg.channel.send({embed: {title: `Prefix`, description: `\`${prefix}\`\nTo view commands ----> ${prefix}help`, color: parseInt(process.env.BASE_COLOR)}});
        }else{
            try{
                let dm_chammel = await bot.getDMChannel(authorID);
                return dm_chammel.send({embed: {title: `Prefix`, description: `\`${prefix}\`\nI do not have embedLinks permission in **${msg.channel.guild.name}**, I need these to work correctly`, color: parseInt(process.env.BASE_COLOR)}});
            }catch(e){}
            
        };
    };

    
    let user_cmd = msg.content.split(" ")[0].slice(prefix.length);
    let args = msg.content.slice(user_cmd.length + 2).split(" ")

    let cmd = await bot.cmds.get(user_cmd.toLowerCase()) || bot.alli.get(user_cmd);
    if(!cmd) return; 
    
    if(cmd.allowInDm == false && !msg.channel.guild) return msg.channel.sendErr('This command does not work in DMs.');
    if(msg.channel.nsfw == false && cmd.nsfw == true) return msg.channel.sendNSFW();
    if(cmd.dev == true && !devs.includes(authorID)) return msg.channel.sendErr('This is a dev only command.');
    if(cmd.owner == true && !authorID == process.env.OWNER) return msg.channel.sendErr('This is a owner only command.');
    if(cmd.caryData == true){
        data.author = await User.findOne({id: authorID + guildID});
        if(!data.author){
            await new User({id: authorID + guildID}).save();
            data.author = await User.findOne({id: authorID + guildID});
        };
    };
    
    if(msg.channel.guild){
        let needed_perms = [];
        let needed_perms_bot = [];
        if(cmd.channelPermCheck == true){
            await cmd.memberPerm.forEach(async perm => {
                if(perm_check_channel(authorID, perm, msg) == false) needed_perms.push(perm);
            });
        }else{
            await cmd.memberPerm.forEach(async perm => {
                if(perm_check(authorID, perm, msg) == false) needed_perms.push(perm);
            });
        };
        
        if(cmd.channelPermCheck == true){
            await cmd.botPerms.forEach(async perm => {
                if(perm_check_channel(bot.user.id, perm, msg) == false) needed_perms_bot.push(perm);
            });
        }else{
            await cmd.botPerms.forEach(async perm => {
                if(perm_check(bot.user.id, perm, msg) == false) needed_perms_bot.push(perm);
            });
        };
    
        if(!needed_perms.length == 0) return msg.channel.memberPerms(needed_perms.join(", "));
        if(!needed_perms_bot.length == 0) return msg.channel.botPerms(needed_perms_bot.join(", "));
    }

    if(cmd.ignoreArgs == false){
        if(cmd.ignoreMinArgs == false && args.length - 1 < cmd.minArgs && args[0] == "") return msg.channel.sendErr(`Command args incorrect, \`\`\`  <prefix>${cmd.usage}  \`\`\` <> = required, [] = optional`)
        if(cmd.ignoreMinArgs == false && args.length > cmd.maxArgs && !args[0] == "") return msg.channel.sendErr(`Command args incorrect, \`\`\`  <prefix>${cmd.usage}  \`\`\` <> = required, [] = optional`)
    }
    
    

    let user_cooldown = await cooldown.get(`ID=${authorID}CMD=${cmd.name}`);
    if(user_cooldown){
        let time_left_ms = Date.now() - user_cooldown;
        let time_left = Math.floor((cmd.cooldown / 1000) - (time_left_ms / (1000)));
        return msg.channel.sendErr(`You are still in cooldown, Time left: => ${time_left} second(s)`);
    }else{
        cooldown.set(`ID=${authorID}CMD=${cmd.name}` ,Date.now());
        setTimeout(() => {
            cooldown.delete(`ID=${authorID}CMD=${cmd.name}`);
        }, cmd.cooldown);
    };
    
    


    try{ cmd.run(bot, msg, args, data) }catch(e){ console.log(e) };
};
